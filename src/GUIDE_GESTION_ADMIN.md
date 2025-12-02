# Guide de Gestion - Interface Administrateur

## 📋 Vue d'ensemble

L'interface administrateur de Dame Sarr E-Commerce a été entièrement repensée pour offrir une expérience professionnelle, épurée et moderne.

---

## 🧩 1. Gestion des Catégories

### Accès
Depuis le Dashboard Admin → **Onglet "Catégories"**

### Fonctionnalités

#### ✅ Ajouter une catégorie
1. Cliquer sur **"Ajouter une catégorie"**
2. Remplir le formulaire :
   - **Nom de la catégorie** (requis) - Ex: "Meubles & Fauteuils"
   - **Image de la catégorie** (requis) :
     - Option 1 : Entrer une URL d'image
     - Option 2 : Cliquer sur "Upload" pour sélectionner un fichier
   - Prévisualisation automatique de l'image
3. Cliquer sur **"Ajouter la catégorie"**

#### ✏️ Modifier une catégorie
1. Cliquer sur **"Modifier"** sur la carte de la catégorie
2. Modifier le nom et/ou l'image
3. Cliquer sur **"Enregistrer les modifications"**

#### 🗑️ Supprimer une catégorie
1. Cliquer sur **"Supprimer"** sur la carte de la catégorie
2. Confirmer la suppression dans la boîte de dialogue
3. **Note** : Les produits de cette catégorie ne sont pas supprimés

### Interface visuelle
- **Cartes avec images** : Chaque catégorie est affichée dans une carte élégante avec son image
- **Icône dossier** : Identification visuelle de chaque catégorie
- **Actions rapides** : Boutons "Modifier" et "Supprimer" directement sur chaque carte
- **Hover effects** : Zoom léger de l'image au survol

---

## 📦 2. Gestion des Produits

### Accès
Depuis le Dashboard Admin → **Onglet "Produits"**

### Fonctionnalités

#### ✅ Ajouter un produit

1. Cliquer sur **"Ajouter un produit"**
2. Remplir le formulaire complet :

   **Informations générales :**
   - Nom du produit (requis)
   - Description
   - Catégorie (menu déroulant - requis)

   **Prix :**
   - Prix détail actuel (requis) - Ex: 45,000 FCFA
   - Prix avant promo (optionnel) - Ex: 55,000 FCFA
     - Si renseigné, le système calcule automatiquement le pourcentage de réduction
   - Prix grossiste (requis) - Ex: 38,000 FCFA

   **Stock et organisation :**
   - Stock (requis) - Ex: 100
   - Nombre de pièces (optionnel) - Ex: 6

   **Galerie d'images (requis - minimum 1 image) :**
   - Option 1 : Entrer une URL et cliquer sur "+" pour l'ajouter
   - Option 2 : Cliquer sur "Upload" pour sélectionner des fichiers
   - **Plusieurs images peuvent être ajoutées**
   - Prévisualisation en miniatures
   - La 1ère image devient l'image principale
   - Bouton "X" pour retirer une image

3. Cliquer sur **"Ajouter le produit"**

#### 👁️ Voir les détails d'un produit
1. Cliquer sur **"Voir"** sur la carte du produit
2. Affichage complet :
   - Galerie d'images (toutes les photos)
   - Toutes les informations du produit
   - Prix avec réductions éventuelles

#### ✏️ Modifier un produit
1. Cliquer sur **"Modifier"** sur la carte du produit
2. Le formulaire se pré-remplit avec les données existantes
3. Modifier les informations souhaitées
4. Possibilité d'ajouter/remplacer les images
5. Cliquer sur **"Enregistrer les modifications"**

#### 🗑️ Supprimer un produit
1. Cliquer sur l'icône **poubelle** sur la carte du produit
2. Confirmer la suppression dans la boîte de dialogue

### Interface visuelle

**Cartes produits :**
- Image principale avec effet zoom au survol
- Badges en superposition :
  - "Populaire" (si applicable)
  - Pourcentage de réduction (ex: "-18%") en rouge
  - Nombre de photos (ex: "🖼️ 4")
- Catégorie en badge
- Prix actuel en couleur primaire
- Prix barré si promotion
- Stock affiché
- Actions : Voir / Modifier / Supprimer

**Couleurs et design :**
- Badges de réduction : Rouge (#DC2626)
- Badges populaires : Couleur accent (or)
- Boutons d'action : Bleu primaire
- Cartes blanches avec ombre au survol
- Grille responsive : 1-4 colonnes selon l'écran

---

## 🎨 Style et Design

### Principes de design appliqués

✅ **Professionnel et épuré**
- Interface claire sans éléments superflus
- Espaces bien définis entre les sections
- Typographie cohérente

✅ **Cartes (Cards)**
- Tous les éléments (catégories, produits) sont dans des cartes
- Ombre légère et effet de survol
- Image en en-tête de chaque carte

✅ **Icônes claires**
- Edit (crayon) pour modifier
- Trash (poubelle) pour supprimer
- Eye (œil) pour voir
- Plus (+) pour ajouter
- Upload pour télécharger
- Image pour galerie

✅ **Couleurs cohérentes**
- Neutral : Beige/Blanc/Gris pour le fond
- Accent : Or (#C8A882) pour les éléments importants
- Primaire : Bleu pour les actions principales
- Vert : Pour les actions positives
- Rouge : Pour les suppressions et réductions

---

## 💡 Fonctionnalités Avancées

### Prix promotionnels
- Renseignez le "Prix avant promo" pour activer une promotion
- Le système affiche automatiquement :
  - Badge de réduction (ex: -18%)
  - Montant économisé (ex: 10,000 FCFA)
  - Prix barré vs prix actuel

### Galerie d'images
- Upload multiple de photos par produit
- Réorganisation par glisser-déposer (1ère = principale)
- Indicateur du nombre de photos sur les cartes
- Navigation fluide dans la galerie sur la page détail

### Synchronisation
- Les catégories sont sauvegardées dans localStorage
- Les nouvelles catégories apparaissent instantanément dans les listes déroulantes
- Event system pour mise à jour en temps réel

---

## 📱 Responsive Design

L'interface s'adapte automatiquement à tous les écrans :

- **Desktop (>1280px)** : 4 cartes par ligne
- **Laptop (1024-1279px)** : 3 cartes par ligne  
- **Tablet (768-1023px)** : 2 cartes par ligne
- **Mobile (<768px)** : 1 carte par ligne

---

## 🔄 Workflow Recommandé

### Configuration initiale
1. ✅ Créer toutes les catégories avec leurs images
2. ✅ Ajouter les produits avec galeries complètes
3. ✅ Définir les prix promotionnels si applicable
4. ✅ Vérifier l'affichage sur la boutique client

### Gestion quotidienne
1. Mettre à jour les stocks
2. Ajouter de nouveaux produits
3. Modifier les prix/promotions
4. Gérer les catégories si besoin

---

## 🎯 Avantages de la Nouvelle Interface

✅ **Plus rapide** : Actions en 2 clics
✅ **Plus visuelle** : Aperçu immédiat des produits et catégories
✅ **Plus intuitive** : Tout est centralisé et clair
✅ **Plus professionnelle** : Design moderne et épuré
✅ **Plus flexible** : Galeries d'images et promotions intégrées

---

## 📞 Support

Pour toute question sur l'utilisation de l'interface admin, référez-vous à ce guide ou contactez le support technique.

---

**Version:** 2.0 - Novembre 2024
**Application:** Dame Sarr E-Commerce
