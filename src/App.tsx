import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoryPage } from './components/CategoryPage';
import { CheckoutPage } from './components/CheckoutPage';
import { AboutPage } from './components/AboutPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Product, Review } from './lib/data';

type Page = 'home' | 'shop' | 'product' | 'category' | 'checkout' | 'about' | 'contact' | 'account' | 'orders' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userType, setUserType] = useState<'retail' | 'wholesale'>('retail');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Charger les favoris depuis localStorage
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Sauvegarder les favoris dans localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleNavigate = (page: string, category?: string) => {
    setCurrentPage(page as Page);
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success(`${product.name} (x${quantity}) ajouté au panier`);
    } else {
      setCartItems([
        ...cartItems,
        { product, quantity, priceType: userType },
      ]);
      toast.success(`${product.name} ajouté au panier`);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    setCartItems(cartItems.filter((item) => item.product.id !== productId));
    if (item) {
      toast.success(`${item.product.name} retiré du panier`);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setCartItems([]);
    toast.success('Commande passée avec succès !');
    setTimeout(() => {
      setCurrentPage('home');
    }, 3000);
  };

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
    if (!isAdmin) {
      setCurrentPage('admin');
      toast.success('Mode administrateur activé');
    } else {
      setCurrentPage('home');
      toast.success('Mode client activé');
    }
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        toast.success('Retiré des favoris');
        return prev.filter((id) => id !== productId);
      } else {
        toast.success('Ajouté aux favoris');
        return [...prev, productId];
      }
    });
  };

  const handleAddReview = (review: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    // Créer un nouvel avis avec ID et date
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      helpful: 0,
    };

    // En production, ceci serait sauvegardé dans une base de données
    // Pour le moment, on met à jour l'état local du produit
    if (selectedProduct) {
      const updatedProduct = {
        ...selectedProduct,
        reviews: [...(selectedProduct.reviews || []), newReview],
      };
      setSelectedProduct(updatedProduct);
    }

    console.log('Nouvel avis ajouté:', newReview);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Render admin dashboard
  if (isAdmin && currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigate}
          currentPage={currentPage}
          isAdmin={isAdmin}
          onToggleAdmin={handleToggleAdmin}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
        />
        <AdminDashboard />
        <CartDrawer
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
        <Toaster />
      </div>
    );
  }

  // Render customer pages
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
            onViewCategory={handleViewCategory}
            userType={userType}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
            userType={userType}
            initialCategory={selectedCategory}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentPage('shop')}
            userType={userType}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewProduct={handleViewProduct}
            onAddReview={handleAddReview}
          />
        )}

        {currentPage === 'category' && selectedCategory && (
          <CategoryPage
            categoryId={selectedCategory}
            onBack={() => setCurrentPage('shop')}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
            userType={userType}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            onBack={() => setIsCartOpen(true)}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {(currentPage === 'about' || currentPage === 'contact') && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'account' && (
          <div className="min-h-screen py-16 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl mb-4">Mon Compte</h1>
              <p className="text-muted-foreground mb-8">
                Cette section sera développée prochainement
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setUserType(userType === 'retail' ? 'wholesale' : 'retail')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Passer en mode {userType === 'retail' ? 'Grossiste' : 'Détail'}
                </button>
              </div>
              {userType === 'wholesale' && (
                <p className="text-accent mt-4">
                  Mode grossiste activé - Les prix sont réduits !
                </p>
              )}
            </div>
          </div>
        )}

        {currentPage === 'orders' && (
          <div className="min-h-screen py-16 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl mb-4">Mes Commandes</h1>
              <p className="text-muted-foreground">
                Vous n'avez pas encore de commandes
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <Toaster />
    </div>
  );
}

