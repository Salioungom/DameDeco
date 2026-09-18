import { describe, it, expect } from 'vitest';
import {
  getMostRecentPayment,
  resolvePaymentState,
  resolveSuccessPhase,
  resolveCancelPhase,
  shouldBlockPayment,
  isNonPayableOrder,
  allowRetry,
  wasPaymentConfirmed,
} from '../payment-status';

const ORDER_PENDING = { orderStatus: 'pending', paymentStatus: 'pending' } as const;

describe('getMostRecentPayment', () => {
  it('retourne le paiement le plus récent via created_at', () => {
    const payments = [
      { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
      { status: 'pending', created_at: '2026-01-02T10:00:00Z' },
    ];
    expect(getMostRecentPayment(payments)?.status).toBe('pending');
  });

  it('retombe sur le dernier élément du tableau si les dates manquent', () => {
    const payments = [{ status: 'completed' }, { status: 'pending' }];
    expect(getMostRecentPayment(payments)?.status).toBe('pending');
  });

  it('retourne null si la liste est vide ou absente', () => {
    expect(getMostRecentPayment([])).toBeNull();
    expect(getMostRecentPayment(null)).toBeNull();
  });
});

describe('Test 1 — ancien cancelled + nouveau pending', () => {
  it('→ état pending et jamais failed', () => {
    const res = resolvePaymentState({
      ...ORDER_PENDING,
      payments: [
        { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
        { status: 'pending', created_at: '2026-01-02T10:00:00Z' },
      ],
    });
    expect(res.state).toBe('pending');
    expect(res.state).not.toBe('failed');
    expect(res.orderFinal).toBeNull();
    expect(resolveSuccessPhase({
      ...ORDER_PENDING,
      payments: [
        { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
        { status: 'pending', created_at: '2026-01-02T10:00:00Z' },
      ],
    })).toBe('pending');
  });
});

describe('Test 2 — ancien cancelled + nouveau processing', () => {
  it('→ état processing (paiement en cours)', () => {
    const res = resolvePaymentState({
      orderStatus: 'pending',
      paymentStatus: 'pending',
      payments: [
        { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
        { status: 'processing', created_at: '2026-01-02T10:00:00Z' },
      ],
    });
    expect(res.state).toBe('processing');
    expect(resolveSuccessPhase({
      orderStatus: 'pending',
      paymentStatus: 'pending',
      payments: [
        { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
        { status: 'processing', created_at: '2026-01-02T10:00:00Z' },
      ],
    })).toBe('pending');
  });
});

describe('Test 3 — ancien cancelled + nouveau completed', () => {
  it('→ paiement confirmé', () => {
    const res = resolvePaymentState({
      orderStatus: 'pending',
      paymentStatus: 'pending',
      payments: [
        { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
        { status: 'completed', created_at: '2026-01-02T10:00:00Z' },
      ],
    });
    expect(res.state).toBe('paid');
    expect(resolveSuccessPhase({
      orderStatus: 'pending',
      paymentStatus: 'pending',
      payments: [
        { status: 'cancelled', created_at: '2026-01-01T10:00:00Z' },
        { status: 'completed', created_at: '2026-01-02T10:00:00Z' },
      ],
    })).toBe('paid');
  });
});

describe('Test 4 — commande annulée dans success', () => {
  it('→ commande annulée, aucun retry', () => {
    const res = resolvePaymentState({
      orderStatus: 'cancelled',
      paymentStatus: 'pending',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    });
    expect(res.orderFinal).toBe('cancelled');
    expect(resolveSuccessPhase({
      orderStatus: 'cancelled',
      paymentStatus: 'pending',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe('order_cancelled');
    expect(allowRetry({
      orderStatus: 'cancelled',
      paymentStatus: 'pending',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(false);
  });
});

describe('Test 5 — commande annulée dans finalize', () => {
  it('→ commande non payable (isNonPayableOrder) et retry interdit', () => {
    expect(isNonPayableOrder('cancelled')).toBe(true);
    expect(isNonPayableOrder('refunded')).toBe(true);
    expect(isNonPayableOrder('pending')).toBe(false);
    expect(allowRetry({
      orderStatus: 'cancelled',
      paymentStatus: 'pending',
      payments: [],
    })).toBe(false);
  });
});

describe('Test 6 — commande annulée dans cancel', () => {
  it('→ affichage commande annulée, pas de bouton retry', () => {
    expect(resolveCancelPhase({
      orderStatus: 'cancelled',
      paymentStatus: 'cancelled',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe('order_cancelled');
    expect(allowRetry({
      orderStatus: 'cancelled',
      paymentStatus: 'cancelled',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(false);
  });
});

describe('Test 7 — paiement annulé + commande active', () => {
  it('→ commande non annulée, retry autorisé', () => {
    const res = resolvePaymentState({
      orderStatus: 'pending',
      paymentStatus: 'cancelled',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    });
    expect(res.state).toBe('failed');
    expect(res.orderFinal).toBeNull();
    expect(allowRetry({
      orderStatus: 'pending',
      paymentStatus: 'cancelled',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(true);
  });
});

describe('Test 8 — paiement pending', () => {
  it('→ bouton Payer indisponible (shouldBlockPayment)', () => {
    expect(shouldBlockPayment({ paymentStatus: 'pending', payments: [] })).toBe(true);
    expect(shouldBlockPayment({
      paymentStatus: 'pending',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(true);
    expect(shouldBlockPayment({
      paymentStatus: 'cancelled',
      payments: [{ status: 'pending', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(true);
  });
});

describe('Test 9 — paiement processing', () => {
  it('→ bouton Payer indisponible (shouldBlockPayment)', () => {
    expect(shouldBlockPayment({ paymentStatus: 'processing', payments: [] })).toBe(true);
    expect(shouldBlockPayment({
      paymentStatus: 'cancelled',
      payments: [{ status: 'processing', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(true);
  });
});

describe('Test 10 — paiement completed', () => {
  it('→ paiement confirmé', () => {
    expect(resolveSuccessPhase({
      orderStatus: 'pending',
      paymentStatus: 'completed',
      payments: [],
    })).toBe('paid');
    expect(resolveSuccessPhase({
      orderStatus: 'pending',
      paymentStatus: 'pending',
      payments: [{ status: 'completed', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe('paid');
  });
});

describe('Règles métier complémentaires', () => {
  it('commande cancelled + payment completed : le paiement n’est pas reclassé en cancelled', () => {
    const res = resolvePaymentState({
      orderStatus: 'cancelled',
      paymentStatus: 'paid',
      payments: [{ status: 'completed', created_at: '2026-01-01T10:00:00Z' }],
    });
    expect(res.state).toBe('paid');
    expect(res.orderFinal).toBe('cancelled');
    expect(wasPaymentConfirmed({
      paymentStatus: 'paid',
      payments: [{ status: 'completed', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(true);
  });

  it('order.status=cancelled + order.payment_status=paid : paid conservé', () => {
    expect(wasPaymentConfirmed({ paymentStatus: 'paid', payments: [] })).toBe(true);
  });

  it('sale_canceled → Payment cancelled + Order active : retry autorisé, commande non annulée', () => {
    expect(allowRetry({
      orderStatus: 'active',
      paymentStatus: 'cancelled',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe(true);
    expect(isNonPayableOrder('active')).toBe(false);
    expect(resolveCancelPhase({
      orderStatus: 'active',
      paymentStatus: 'cancelled',
      payments: [{ status: 'cancelled', created_at: '2026-01-01T10:00:00Z' }],
    })).toBe('cancelled');
  });

  it('timeout/résultat inconnu → jamais « failed » sur success', () => {
    expect(resolveSuccessPhase({ orderStatus: 'pending' }) === 'failed').toBe(false);
    expect(resolveSuccessPhase({ orderStatus: 'pending', paymentStatus: 'pending', payments: [] })).toBe('pending');
  });

  it('order.payment_status pending est le fallback quand aucun paiement détaillé', () => {
    expect(resolvePaymentState({ orderStatus: 'pending', paymentStatus: 'pending' }).state).toBe('pending');
    expect(resolvePaymentState({ orderStatus: 'pending', paymentStatus: 'paid' }).state).toBe('paid');
  });
});