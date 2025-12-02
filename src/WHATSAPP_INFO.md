# 📱 Configuration WhatsApp - Dame Sarr Import & Commerce

## Numéro WhatsApp Professionnel
**78 595 06 01** (Sénégal: +221 78 595 06 01)

## Fonctionnalités

### Pour les Clients
Les clients peuvent commander directement via WhatsApp depuis n'importe quelle page produit :
- ✅ Bouton WhatsApp sur chaque carte produit
- ✅ Bouton WhatsApp sur la page de détails produit
- ✅ Message pré-rempli avec tous les détails
- ✅ Image du produit incluse dans le message
- ✅ Référence produit pour faciliter le suivi

### Message WhatsApp Type
Lorsqu'un client clique sur le bouton WhatsApp, un message professionnel est généré automatiquement :

```
🛍️ *NOUVELLE COMMANDE*
_Dame Sarr Import & Commerce_

━━━━━━━━━━━━━━━━━━
📦 *Nom du produit*
🆔 Réf: #ID-produit
🔢 Quantité: *X*
💰 Prix unitaire: *XX XXX FCFA*
💵 *TOTAL: XX XXX FCFA*
━━━━━━━━━━━━━━━━━━

📸 *Photo du produit:*
[URL de l'image]

✅ _Je souhaite finaliser cette commande. Merci de me contacter._
```

### Pour l'Administrateur

#### Tableau de bord Admin
- 📊 Statistiques des commandes WhatsApp
- 🏷️ Badge "WhatsApp" sur les commandes venant de WhatsApp
- 📈 Pourcentage de commandes WhatsApp vs Site Web
- 👁️ Vue détaillée de la source de chaque commande

#### Suivi des Commandes
Chaque commande dans le dashboard affiche :
- Source : Site Web ou WhatsApp (avec icône verte)
- Détails complets de la commande
- Possibilité de changer le statut
- Historique des commandes par client

## Configuration Technique

### Fichier de Configuration
`/lib/whatsapp.ts` - Contient toutes les configurations WhatsApp

### Modification du Numéro
Pour changer le numéro WhatsApp, modifier le fichier `/lib/whatsapp.ts` :

```typescript
export const WHATSAPP_CONFIG = {
  phoneNumber: '221785950601', // Format: code pays + numéro (sans espaces)
  businessName: 'Dame Sarr Import & Commerce',
};
```

### Données
Le champ `source` a été ajouté à l'interface `Order` :
- `'website'` : Commande depuis le site
- `'whatsapp'` : Commande via WhatsApp

## Avantages

### Pour le Business
✅ Communication directe et instantanée avec les clients
✅ Réduction du taux d'abandon de panier
✅ Confiance accrue (conversation personnalisée)
✅ Facilite les commandes pour les clients moins à l'aise avec le e-commerce
✅ Tracking précis des sources de commandes

### Pour les Clients
✅ Commander rapidement sans créer de compte
✅ Poser des questions directement
✅ Négociation possible pour les gros volumes
✅ Confirmation immédiate de disponibilité
✅ Service client personnalisé

## Bonnes Pratiques

1. **Réponse Rapide** : Répondre aux messages WhatsApp dans les 2h maximum
2. **Confirmation** : Confirmer la disponibilité du produit immédiatement
3. **Suivi** : Mettre à jour le statut de la commande dans le dashboard
4. **Images** : Les images des produits sont automatiquement incluses pour éviter toute confusion
5. **Archivage** : Enregistrer toutes les commandes WhatsApp dans le système

## Support

Pour toute question concernant la configuration WhatsApp, consultez :
- `/lib/whatsapp.ts` : Configuration principale
- `/components/ProductCard.tsx` : Bouton WhatsApp sur les cartes
- `/components/ProductDetailPage.tsx` : Bouton WhatsApp sur la page détails
- `/components/AdminDashboard.tsx` : Affichage et tracking des commandes
