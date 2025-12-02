// Configuration WhatsApp pour Dame Sarr Import & Commerce
export const WHATSAPP_CONFIG = {
  phoneNumber: '221785950601', // Numéro WhatsApp: 78 595 06 01
  businessName: 'Dame Sarr Import & Commerce',
};

/**
 * Génère un lien WhatsApp avec un message pré-rempli
 * @param message Le message à envoyer
 * @returns L'URL WhatsApp complète
 */
export function generateWhatsAppLink(message: string): string {
  const { phoneNumber } = WHATSAPP_CONFIG;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Ouvre WhatsApp avec un message pré-rempli concernant un produit
 * @param productName Nom du produit
 * @param price Prix du produit
 * @param quantity Quantité (optionnel)
 * @param productImage URL de l'image du produit (optionnel)
 * @param productId ID du produit (optionnel)
 * @param description Description du produit (optionnel)
 */
export function orderViaWhatsApp(
  productName: string,
  price: number,
  quantity: number = 1,
  productImage?: string,
  productId?: string,
  description?: string
): void {
  const total = price * quantity;
  let message = 
    `🛍️ *NOUVELLE COMMANDE*\n` +
    `_${WHATSAPP_CONFIG.businessName}_\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📦 *${productName}*\n`;
  
  // Ajouter l'ID du produit si disponible
  if (productId) {
    message += `🆔 Réf: #${productId}\n`;
  }
  
  message += 
    `🔢 Quantité: *${quantity}*\n` +
    `💰 Prix unitaire: *${price.toLocaleString('fr-FR')} FCFA*\n` +
    `💵 *TOTAL: ${total.toLocaleString('fr-FR')} FCFA*\n` +
    `━━━━━━━━━━━━━━━━━━\n`;
  
  // Ajouter le lien de l'image pour que le fournisseur puisse voir le produit
  if (productImage) {
    message += `\n📸 *Photo du produit:*\n${productImage}\n`;
  }
  
  message += `\n✅ _Je souhaite finaliser cette commande. Merci de me contacter._`;
  
  const whatsappUrl = generateWhatsAppLink(message);
  window.open(whatsappUrl, '_blank');
}
