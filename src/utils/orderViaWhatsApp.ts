export function orderViaWhatsApp(
  name: string,
  price: number,
  quantity: number,
  imageUrl: string,
  productId: string,
  description?: string
) {
  const message = `
🛒 Nouvelle commande

Produit: ${name}
Prix: ${price} F CFA
Quantité: ${quantity}
ID: ${productId}

${description ? `Description: ${description}` : ''}
  `;

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}