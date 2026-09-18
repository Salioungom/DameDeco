/**
 * @file /lib/payment-status.ts
 * @description Résolution partagée de l'état de paiement courant.
 *
 * Le contrat backend distingue le statut de la COMMANDE (order.status) du
 * statut de PAIEMENT (payment.status / order.payment_status). Un ancien
 * paiement annulé/échoué/expiré ne doit JAMAIS dominer un paiement plus
 * récent (pending/processing/completed), ni faire passer une commande
 * toujours active en « annulée ».
 */

export interface PaymentLike {
  status?: string | null;
  created_at?: string;
}

export type PaymentState =
  | 'paid'
  | 'processing'
  | 'pending'
  | 'failed'
  | 'unknown';

export type OrderFinalState = 'cancelled' | 'refunded' | null;

export interface PaymentStateResolution {
  /** État du paiement courant (« paid » = confirmé par le backend uniquement). */
  state: PaymentState;
  /** État final non payable de la commande (annulée / remboursée), sinon null. */
  orderFinal: OrderFinalState;
  /** Paiement le plus récent, ou null. */
  currentPayment: PaymentLike | null;
}

/** Statuts de paiement qui confirment définitivement une transaction. */
const PAID_STATUSES = ['paid', 'completed'];

/**
 * Renvoie le paiement le plus récent (tri par created_at, ordre du tableau
 * en secours). C'est le paiement « courant » : les plus anciens ne doivent
 * pas servir à déterminer l'état affiché.
 */
export function getMostRecentPayment(payments: PaymentLike[] | null | undefined): PaymentLike | null {
  const list = Array.isArray(payments) ? [...payments] : [];
  list.sort((a, b) => {
    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    if (Number.isNaN(aTime)) return bTime ? -1 : 0;
    if (Number.isNaN(bTime)) return aTime ? 1 : 0;
    return aTime - bTime;
  });
  return list[list.length - 1] ?? null;
}

function statusToPaymentState(status: string | null | undefined): PaymentState | null {
  if (!status) return null;
  if (PAID_STATUSES.includes(status)) return 'paid';
  if (status === 'processing') return 'processing';
  if (status === 'pending') return 'pending';
  if (status === 'failed' || status === 'cancelled' || status === 'expired') return 'failed';
  return null;
}

/**
 * Résout l'état de paiement courant avec la priorité suivante :
 * 1. paiement courant (le plus récent) si son statut est explicite ;
 * 2. order.payment_status comme état agrégé de secours.
 *
 * order.status est remonté séparément (orderFinal) : une commande
 * « cancelled » n'est jamais traitée comme un simple échec de paiement, mais
 * un paiement confirmé (paid/completed) n'est jamais reclassé en cancelled.
 */
export function resolvePaymentState(input: {
  orderStatus?: string | null;
  paymentStatus?: string | null;
  payments?: PaymentLike[] | null;
}): PaymentStateResolution {
  const currentPayment = getMostRecentPayment(input.payments);
  const currentStatus = currentPayment?.status ?? null;

  let state: PaymentState = statusToPaymentState(currentStatus) ?? 'unknown';

  if (state === 'unknown') {
    state = statusToPaymentState(input.paymentStatus) ?? 'unknown';
  }

  let orderFinal: OrderFinalState = null;
  if (input.orderStatus === 'cancelled') orderFinal = 'cancelled';
  else if (input.orderStatus === 'refunded') orderFinal = 'refunded';

  return { state, orderFinal, currentPayment };
}

/**
 * Indique si un paiement est déjà en cours (pending/processing), que ce soit
 * via le paiement courant détaillé ou l'état agrégé order.payment_status.
 * Utilisé comme garde UX pour empêcher un second paiement depuis l'UI ;
 * le backend reste l'autorité finale.
 */
export function shouldBlockPayment(input: {
  paymentStatus?: string | null;
  payments?: PaymentLike[] | null;
}): boolean {
  const aggregated = input.paymentStatus;
  if (aggregated === 'pending' || aggregated === 'processing') return true;

  const current = getMostRecentPayment(input.payments);
  const status = current?.status;
  if (status === 'pending' || status === 'processing') return true;

  return false;
}

/**
 * Indique si la commande est dans un état final non payable
 * (annulée ou remboursée). Aucune règle métier supplémentaire n'est inventée.
 */
export function isNonPayableOrder(orderStatus?: string | null): boolean {
  return orderStatus === 'cancelled' || orderStatus === 'refunded';
}

/** Phases affichables par /checkout/success. */
export type SuccessPhase = 'paid' | 'pending' | 'failed' | 'error' | 'order_cancelled' | 'order_refunded';

/**
 * Décision d'affichage de /checkout/success.
 *
 * Une commande annulée/remboursée n'est jamais réduite à un « échec de
 * paiement » ; un ancien paiement annulé/échoué/expiré ne domine jamais un
 * paiement plus récent (pending/processing/completed). Tout statut non
 * confirmé par le backend reste « en cours de vérification » (jamais
 * « échoué » sans confirmation).
 */
export function resolveSuccessPhase(input: {
  orderStatus?: string | null;
  paymentStatus?: string | null;
  payments?: PaymentLike[] | null;
}): SuccessPhase {
  const { state, orderFinal } = resolvePaymentState(input);

  if (orderFinal) return orderFinal === 'refunded' ? 'order_refunded' : 'order_cancelled';
  if (state === 'paid') return 'paid';
  if (state === 'processing' || state === 'pending') return 'pending';
  if (state === 'failed') return 'failed';
  return 'pending';
}

/**
 * Vrai si le paiement a été définitivement confirmé par le backend
 * (paid/completed), indépendamment de l'état de la commande. Permet de ne
 * jamais reclasser un paiement payé en annulé.
 */
export function wasPaymentConfirmed(input: {
  paymentStatus?: string | null;
  payments?: PaymentLike[] | null;
}): boolean {
  return resolvePaymentState({ paymentStatus: input.paymentStatus, payments: input.payments }).state === 'paid';
}

/** Phases affichables par /checkout/cancel. */
export type CancelPhase = 'paid' | 'cancelled' | 'pending' | 'order_cancelled' | 'order_refunded';

/**
 * Décision d'affichage de /checkout/cancel. Une commande annulée est affichée
 * comme telle ; une annulation de paiement (sale_canceled) laisse la commande
 * active et le retry possible.
 */
export function resolveCancelPhase(input: {
  orderStatus?: string | null;
  paymentStatus?: string | null;
  payments?: PaymentLike[] | null;
}): CancelPhase {
  const { state, orderFinal } = resolvePaymentState(input);

  if (orderFinal) return orderFinal === 'refunded' ? 'order_refunded' : 'order_cancelled';
  if (state === 'paid') return 'paid';
  if (state === 'processing' || state === 'pending') return 'pending';
  return 'cancelled';
}

/**
 * Autorise-t-on un nouveau paiement (retry) depuis les pages de sortie ?
 *
 * Interdit si la commande est annulée/remboursée OU si le paiement est déjà
 * confirmé. Un paiement annulé/échoué/expiré avec commande active reste
 * réessayable.
 */
export function allowRetry(input: {
  orderStatus?: string | null;
  paymentStatus?: string | null;
  payments?: PaymentLike[] | null;
}): boolean {
  const { state, orderFinal } = resolvePaymentState(input);
  if (orderFinal) return false;
  if (state === 'paid') return false;
  return true;
}