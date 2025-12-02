
# E-commerce Site Mockup

Ce projet est une maquette fonctionnelle d'un site e-commerce moderne développé avec React et Vite. Il propose une interface utilisateur complète pour la gestion d'une boutique en ligne.

## Structure du Projet

### Fichiers Racine
- `index.html` - Point d'entrée de l'application
- `package.json` - Configuration du projet et dépendances
- `vite.config.ts` - Configuration de Vite
- `README.md` - Documentation du projet

### Dossier `src/`
#### Fichiers Principaux
- `App.tsx` - Composant principal de l'application qui gère le routage et l'état global
- `main.tsx` - Point d'entrée React
- `index.css` - Styles CSS globaux

#### Documentation et Guides
- `Attributions.md` - Attributions et crédits
- `AVIS_CLIENTS_GUIDE.md` - Guide pour la gestion des avis clients
- `GUIDE_GESTION_ADMIN.md` - Guide pour l'administration
- `NAVIGATION_GUIDE.md` - Guide de navigation
- `WHATSAPP_INFO.md` - Informations sur l'intégration WhatsApp

#### Dossier `components/`
##### Composants Principaux
- `AboutPage.tsx` - Page À propos
- `AddProductDialog.tsx` - Dialog pour ajouter des produits
- `AdminDashboard.tsx` - Tableau de bord administrateur
- `CartDrawer.tsx` - Panier latéral
- `CategoryManagement.tsx` - Gestion des catégories
- `CategoryPage.tsx` - Page de catégorie
- `CheckoutPage.tsx` - Page de paiement
- `Footer.tsx` - Pied de page
- `HomePage.tsx` - Page d'accueil
- `ManageCategoriesDialog.tsx` - Dialog de gestion des catégories
- `Navigation.tsx` - Barre de navigation
- `PaymentIcons.tsx` - Icônes de paiement
- `ProductCard.tsx` - Carte de produit
- `ProductDetailPage.tsx` - Page détaillée du produit
- `ProductManagement.tsx` - Gestion des produits
- `ProductReviews.tsx` - Avis sur les produits
- `ShopPage.tsx` - Page principale de la boutique

##### Composants UI (dans `components/ui/`)
Une collection complète de composants d'interface utilisateur réutilisables incluant :
- Accordéons, alertes, boutons
- Formulaires, menus, modales
- Tables, onglets, tooltips
- Et bien d'autres composants d'UI

#### Dossier `lib/`
- `data.ts` - Données et types de l'application
- `whatsapp.ts` - Intégration WhatsApp

## Fonctionnalités Principales

- 🛍️ Navigation fluide entre les produits et catégories
- 🛒 Gestion du panier en temps réel
- 👤 Mode client et administrateur
- 💖 Système de favoris
- ⭐ Système d'avis clients
- 🌙 Mode sombre/clair
- 📱 Design responsive
- 💼 Prix différenciés (détail/gros)

## Installation

1. Installez les dépendances :
```bash
npm install
# ou
pnpm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
# ou
pnpm dev
```

## Technologies Utilisées

- React 18
- Vite
- Radix UI
- Tailwind CSS
- TypeScript
- Sonner pour les notifications
- Recharts pour les graphiques

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Convention de nommage et mapping front ↔ backend (Option A)

Dans ce projet nous avons choisi l'Option A : conserver exactement les mêmes noms de champs que le frontend (camelCase) dans la base de données et dans l'API. Cela garantit une correspondance 1:1 entre les objets JavaScript/TypeScript et les colonnes SQL.

Principes clés
- Les noms exposés à l'API sont identiques à ceux de `src/lib/data.ts` (ex : `originalPrice`, `wholesalePrice`, `averageRating`, etc.).
- Les modèles Django utiliseront `db_column` pour forcer ces noms exacts en base si besoin.
- Les endpoints JSON renverront les mêmes clés camelCase que le front.

Mapping synthétique (front -> db column)
- Category
	- id -> id
	- name -> name
	- image -> image

- Product
	- id -> id
	- name -> name
	- category -> category (FK)
	- price -> price
	- originalPrice -> originalPrice
	- wholesalePrice -> wholesalePrice
	- description -> description
	- image -> image
	- images -> images (relation ProductImage)
	- stock -> stock
	- pieces -> pieces
	- popular -> popular
	- averageRating -> averageRating
	- reviewCount -> reviewCount

- Review
	- id -> id
	- productId -> productId (FK)
	- customerName -> customerName
	- customerEmail -> customerEmail
	- rating -> rating
	- comment -> comment
	- date -> date
	- verified -> verified
	- helpful -> helpful

- Order
	- id -> id
	- customer -> customer (FK or string)
	- date -> date
	- total -> total
	- status -> status
	- payment -> payment
	- items -> items
	- source -> source

- Customer
	- id -> id
	- name -> name
	- email -> email
	- phone -> phone
	- type -> type
	- orders -> orders
	- totalSpent -> totalSpent

Exemple minimal de modèles Django (Option A) — extraits
```
# catalog/models.py (extrait)
from django.db import models


class Category(models.Model):
		id = models.CharField(primary_key=True, max_length=100, db_column='id')
		name = models.CharField(max_length=200, db_column='name')
		image = models.URLField(max_length=1000, db_column='image', blank=True)

		class Meta:
				db_table = 'category'

class Product(models.Model):
		id = models.CharField(primary_key=True, max_length=100, db_column='id')
		name = models.CharField(max_length=300, db_column='name')
		category = models.ForeignKey(Category, on_delete=models.PROTECT, db_column='category', related_name='products')
		price = models.DecimalField(max_digits=12, decimal_places=2, db_column='price')
		originalPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, db_column='originalPrice')
		wholesalePrice = models.DecimalField(max_digits=12, decimal_places=2, db_column='wholesalePrice')
		description = models.TextField(db_column='description', blank=True)
		image = models.URLField(max_length=1000, db_column='image', blank=True)
		stock = models.IntegerField(db_column='stock', default=0)
		pieces = models.IntegerField(db_column='pieces', null=True, blank=True)
		popular = models.BooleanField(db_column='popular', default=False)
		averageRating = models.FloatField(db_column='averageRating', null=True, blank=True)
		reviewCount = models.IntegerField(db_column='reviewCount', default=0)

		class Meta:
				db_table = 'product'
```

Notes
- Cette méthode est non-idiomatique en Python (on préfère généralement snake_case), mais elle respecte strictement la contrainte de nommage 1:1 avec le frontend.
- Veillez aux éventuelles contraintes du moteur SQL concernant la casse des colonnes (certains moteurs/clients SQL peuvent être sensibles à la casse ou requérir des guillemets pour les noms mixtes).

Descriptions des fichiers et dossiers principaux (par composant)

- `index.html` : page HTML d'entrée pour Vite/React.
- `package.json` : configuration du projet, scripts (dev, build), dépendances.
- `vite.config.ts` : configuration Vite (alias, plugins).

- `src/main.tsx` : bootstrap React, attache l'app au DOM.
- `src/App.tsx` : composant racine, gère le routage et l'état global.
- `src/index.css` et `src/styles/globals.css` : styles globaux et thèmes (Tailwind + personnalisations).

- `src/lib/data.ts` : source de vérité côté frontend — typescript interfaces et jeux de données d'exemple (Product, Category, Review, Order, Customer). Utilisé par les pages de démonstration et le dashboard.
- `src/lib/whatsapp.ts` : configuration et utilitaires pour l'intégration WhatsApp (numéro, message template).

- `src/components/` : composants React principaux :
	- `HomePage.tsx` : page d'accueil présentant catégories et produits populaires.
	- `ShopPage.tsx` : page catalogue/boutique avec filtres et tri.
	- `CategoryPage.tsx` : liste des produits d'une catégorie.
	- `ProductDetailPage.tsx` : page détaillée produit (galerie, description, avis, actions: panier/whatsapp).
	- `ProductCard.tsx` : carte produit réutilisable (image, prix, badges, actions rapides).
	- `CartDrawer.tsx` : composant panier (drawer) avec gestion des quantités.
	- `CheckoutPage.tsx` : page de finalisation de commande (maquette).
	- `AdminDashboard.tsx`, `ProductManagement.tsx`, `CategoryManagement.tsx` : interfaces d'administration mockup.
	- `AddProductDialog.tsx`, `ManageCategoriesDialog.tsx` : modales pour créer/éditer des éléments (mockup admin).
	- `ProductReviews.tsx` : affichage et ajout d'avis (guide et UI implémentés côté front).

- `src/components/ui/` : bibliothèque de composants UI (basés sur Radix / primitives) : boutons, inputs, dialogs, toasts (sonner), accordions, table, carousel, etc. Ces composants sont réutilisés par les pages et facilitent l'homogénéité visuelle.

- `src/components/figma/ImageWithFallback.tsx` : petit utilitaire d'image avec fallback et lazy-loading.

- `src/guidelines/Guidelines.md` : lignes directrices de design UI/UX.

- `src/Attributions.md` : crédits et licences des images/icônes utilisées.
- `src/AVIS_CLIENTS_GUIDE.md`, `src/GUIDE_GESTION_ADMIN.md`, `src/NAVIGATION_GUIDE.md`, `src/WHATSAPP_INFO.md` : guides métiers et instructions (interface admin, avis clients, navigation produits et intégration WhatsApp). Ces fichiers contiennent des spécifications utiles pour le backend (ex : champs attendus, format message WhatsApp, statut des commandes).

Checklist pour l'implémentation backend (Option A)
- Créer une app Django `catalog` pour Category/Product/Review/ProductImage.
- Créer une app Django `orders` pour Order/OrderItem/Customer.
- Utiliser `db_column` dans les champs pour correspondre aux noms camelCase du front.
- Exposer des API via Django REST Framework en renvoyant des objets JSON avec les mêmes clés camelCase.
- Écrire des tests d'intégration pour vérifier la compatibilité front ↔ API.

Si vous souhaitez que je génère les fichiers Django complets (models.py, serializers.py, viewsets, urls) avec `db_column` appliqué exactement pour chaque champ, dites-le et je les créerai dans une archive ou je vous proposerai les fichiers prêts à copier dans une nouvelle app Django.

## Exemples complets de modèles Django (Option A)

Ci-dessous vous trouverez des exemples complets prêts à copier pour les apps `catalog`, `orders` et `accounts`. Ils utilisent la convention Option A (noms camelCase exposés et `db_column` pour forcer les mêmes noms en base).

catalog/models.py
```python
from django.db import models
from django.utils import timezone


class Category(models.Model):
	id = models.CharField(primary_key=True, max_length=100, db_column='id')
	name = models.CharField(max_length=200, db_column='name')
	image = models.URLField(max_length=1000, db_column='image', blank=True)

	class Meta:
		db_table = 'category'

	def __str__(self):
		return self.name


class Product(models.Model):
	id = models.CharField(primary_key=True, max_length=100, db_column='id')
	name = models.CharField(max_length=300, db_column='name')
	category = models.ForeignKey(Category, on_delete=models.PROTECT, db_column='category', related_name='products')
	price = models.DecimalField(max_digits=12, decimal_places=2, db_column='price')
	originalPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, db_column='originalPrice')
	wholesalePrice = models.DecimalField(max_digits=12, decimal_places=2, db_column='wholesalePrice')
	description = models.TextField(db_column='description', blank=True)
	image = models.URLField(max_length=1000, db_column='image', blank=True)
	stock = models.IntegerField(db_column='stock', default=0)
	pieces = models.IntegerField(db_column='pieces', null=True, blank=True)
	popular = models.BooleanField(db_column='popular', default=False)
	averageRating = models.FloatField(db_column='averageRating', null=True, blank=True)
	reviewCount = models.IntegerField(db_column='reviewCount', default=0)
	created_at = models.DateTimeField(db_column='created_at', default=timezone.now)
	updated_at = models.DateTimeField(db_column='updated_at', auto_now=True)

	class Meta:
		db_table = 'product'

	def __str__(self):
		return self.name


class ProductImage(models.Model):
	id = models.AutoField(primary_key=True)
	product = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='product', related_name='images')
	image = models.URLField(max_length=1000, db_column='image')
	is_primary = models.BooleanField(db_column='is_primary', default=False)

	class Meta:
		db_table = 'product_image'

	def __str__(self):
		return f"Image for {self.product_id} -> {self.image}"


class Review(models.Model):
	id = models.CharField(primary_key=True, max_length=100, db_column='id')
	product = models.ForeignKey(Product, on_delete=models.CASCADE, db_column='productId', related_name='reviews')
	customerName = models.CharField(max_length=200, db_column='customerName')
	customerEmail = models.EmailField(max_length=254, db_column='customerEmail', null=True, blank=True)
	rating = models.IntegerField(db_column='rating')
	comment = models.TextField(db_column='comment')
	date = models.DateTimeField(db_column='date', default=timezone.now)
	verified = models.BooleanField(db_column='verified', default=False)
	helpful = models.IntegerField(db_column='helpful', default=0)

	class Meta:
		db_table = 'review'

	def __str__(self):
		return f"Review {self.id} on {self.product_id} by {self.customerName}"
```

orders/models.py
```python
from django.db import models
from django.utils import timezone


class Customer(models.Model):
	id = models.CharField(primary_key=True, max_length=100, db_column='id')
	name = models.CharField(max_length=200, db_column='name')
	email = models.EmailField(max_length=254, db_column='email', null=True, blank=True)
	phone = models.CharField(max_length=50, db_column='phone', null=True, blank=True)
	type = models.CharField(max_length=20, db_column='type', default='retail')
	orders = models.IntegerField(db_column='orders', default=0)
	totalSpent = models.DecimalField(max_digits=12, decimal_places=2, db_column='totalSpent', default=0)

	class Meta:
		db_table = 'customer'

	def __str__(self):
		return self.name


class Order(models.Model):
	id = models.CharField(primary_key=True, max_length=100, db_column='id')
	customer = models.CharField(max_length=200, db_column='customer')
	date = models.DateTimeField(db_column='date', default=timezone.now)
	total = models.DecimalField(max_digits=12, decimal_places=2, db_column='total')
	status = models.CharField(max_length=20, db_column='status')
	payment = models.CharField(max_length=100, db_column='payment')
	items = models.IntegerField(db_column='items', default=0)
	source = models.CharField(max_length=20, db_column='source', null=True, blank=True)
	created_at = models.DateTimeField(db_column='created_at', default=timezone.now)
	updated_at = models.DateTimeField(db_column='updated_at', auto_now=True)

	class Meta:
		db_table = 'order'

	def __str__(self):
		return self.id


class OrderItem(models.Model):
	id = models.AutoField(primary_key=True)
	order = models.ForeignKey(Order, on_delete=models.CASCADE, db_column='order', related_name='orderItems')
	productId = models.CharField(max_length=100, db_column='productId')
	quantity = models.IntegerField(db_column='quantity')
	price = models.DecimalField(max_digits=12, decimal_places=2, db_column='price')

	class Meta:
		db_table = 'order_item'

	def __str__(self):
		return f"{self.productId} x{self.quantity} @ {self.price}"
```

accounts/models.py (optionnel)
```python
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	phone = models.CharField(max_length=50, blank=True, null=True, db_column='phone')
	type = models.CharField(max_length=20, default='retail', db_column='type')
	totalSpent = models.DecimalField(max_digits=12, decimal_places=2, default=0, db_column='totalSpent')

	class Meta:
		db_table = 'auth_user'
```

Notes:
- Ces fichiers sont des exemples prêts à l'emploi. Après les avoir ajoutés à votre projet Django, n'oubliez pas d'ajouter les apps à `INSTALLED_APPS` et d'exécuter `makemigrations` / `migrate`.
- Si vous préférez des `UUIDField` pour les identifiants, remplacez les `CharField` correspondants.

Souhaitez-vous que je génère aussi un script d'import pour convertir les données de `src/lib/data.ts` en fixtures Django ?