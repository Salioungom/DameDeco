// Données temporaires pour éviter les erreurs de build
// Ces données seront remplacées par des appels API réels

import { Category, Product } from './types';
import { categoryImages } from './category-images';

// Types pour les données manquantes
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  paymentMethod: string;
  shippingAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Données mock pour les clients
export const customers: Customer[] = [
  {
    id: '1',
    name: 'Marie Diop',
    email: 'marie.diop@email.com',
    phone: '+221 77 123 45 67',
    address: 'Dakar, Sénégal',
    totalOrders: 5,
    totalSpent: 250000,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Ahmadou Bâ',
    email: 'ahmadou.ba@email.com',
    phone: '+221 76 987 65 43',
    address: 'Thiès, Sénégal',
    totalOrders: 3,
    totalSpent: 180000,
    joinDate: '2024-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@email.com',
    phone: '+221 78 456 78 90',
    address: 'Saint-Louis, Sénégal',
    totalOrders: 8,
    totalSpent: 420000,
    joinDate: '2023-12-10',
    status: 'active'
  }
];

// Données mock pour les commandes
export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerId: '1',
    customerName: 'Marie Diop',
    items: [
      {
        productId: '1',
        productName: 'Ensemble draps luxe 6 pièces',
        quantity: 2,
        price: 45000,
        total: 90000
      }
    ],
    total: 90000,
    status: 'delivered',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-22',
    paymentMethod: 'Wave',
    shippingAddress: 'Dakar, Sénégal'
  },
  {
    id: 'ORD-002',
    customerId: '2',
    customerName: 'Ahmadou Bâ',
    items: [
      {
        productId: '2',
        productName: 'Rideaux premium 3 pièces',
        quantity: 1,
        price: 35000,
        total: 35000
      },
      {
        productId: '4',
        productName: 'Moquette luxueuse grande taille',
        quantity: 1,
        price: 85000,
        total: 85000
      }
    ],
    total: 120000,
    status: 'processing',
    orderDate: '2024-02-25',
    paymentMethod: 'Orange Money',
    shippingAddress: 'Thiès, Sénégal'
  }
];

export const categories: Category[] = [
  { 
    id: 'sheets', 
    name: 'Draps', 
    icon: 'Bed',
    image: categoryImages.sheets
  },
  { 
    id: 'curtains', 
    name: 'Rideaux', 
    icon: 'Blinds',
    image: categoryImages.curtains
  },
  { 
    id: 'prayer-mats', 
    name: 'Tapis de prière', 
    icon: 'CircleDot',
    image: categoryImages['prayer-mats']
  },
  { 
    id: 'carpets', 
    name: 'Moquettes', 
    icon: 'Square',
    image: categoryImages.carpets
  },
  { 
    id: 'dialaber', 
    name: 'Dialaber', 
    icon: 'Shirt',
    image: categoryImages.dialaber
  },
  { 
    id: 'furniture', 
    name: 'Meubles & Fauteuils', 
    icon: 'Armchair',
    image: categoryImages.furniture
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Ensemble draps luxe 6 pièces',
    category: 'sheets',
    price: 45000,
    originalPrice: 55000,
    wholesalePrice: 38000,
    description: 'Ensemble complet de draps en coton égyptien premium, importé directement de Chine. Comprend 1 drap housse, 1 drap plat, 4 taies d\'oreillers. Qualité supérieure, doux et respirant.',
    image: 'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkZGluZyUyMHNoZWV0c3xlbnwxfHx8fDE3NjA2NTc4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkZGluZyUyMHNoZWV0c3xlbnwxfHx8fDE3NjA2NTc4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1634574094895-f38cd9aa8d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRkaW5nJTIwY2xvc2V1cHxlbnwxfHx8fDE3NjExMzcwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 150,
    pieces: 6,
    popular: true,
    averageRating: 4.75,
    reviewCount: 4,
  },
  {
    id: '2',
    name: 'Rideaux premium 3 pièces',
    category: 'curtains',
    price: 35000,
    originalPrice: 42000,
    wholesalePrice: 28000,
    description: 'Magnifiques rideaux occultants en tissu de haute qualité. Set de 3 pièces parfait pour salon ou chambre. Design élégant et moderne.',
    image: 'https://images.unsplash.com/photo-1754611380518-61a923cc47ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWlucyUyMGludGVyaW9yfGVufDF8fHx8MTc2MDYxODQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1754611380518-61a923cc47ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWlucyUyMGludGVyaW9yfGVufDF8fHx8MTc2MDYxODQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 80,
    pieces: 3,
    popular: true,
    averageRating: 4.67,
    reviewCount: 3,
  },
  {
    id: '3',
    name: 'Tapis de prière artisanal',
    category: 'prayer-mats',
    price: 15000,
    wholesalePrice: 12000,
    description: 'Tapis de prière de qualité supérieure, design islamique traditionnel, doux et confortable. Parfait pour vos moments de prière.',
    image: 'https://images.unsplash.com/photo-1741719396796-6b7484ef9f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBtYXQlMjBjYXJwZXR8ZW58MXx8fHwxNzYwNjU3ODM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1741719396796-6b7484ef9f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBtYXQlMjBjYXJwZXR8ZW58MXx8fHwxNzYwNjU3ODM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 200,
    popular: false,
  },
  {
    id: '4',
    name: 'Moquette luxueuse grande taille',
    category: 'carpets',
    price: 85000,
    originalPrice: 105000,
    wholesalePrice: 70000,
    description: 'Moquette élégante pour salon ou chambre. Matière premium, résistante et facile d\'entretien. Parfaite pour une ambiance chaleureuse.',
    image: 'https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJwZXQlMjBydWd8ZW58MXx8fHwxNzYwNjU3ODM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJwZXQlMjBydWd8ZW58MXx8fHwxNzYwNjU3ODM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 45,
    popular: true,
  },
  {
    id: '5',
    name: 'Fauteuil moderne premium',
    category: 'furniture',
    price: 125000,
    wholesalePrice: 105000,
    description: 'Fauteuil design moderne et confortable. Structure robuste, revêtement de qualité. Idéal pour salon ou bureau.',
    image: 'https://images.unsplash.com/photo-1675528030415-dc82908eeb73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBhcm1jaGFpcnxlbnwxfHx8fDE3NjA2NTc4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1675528030415-dc82908eeb73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBhcm1jaGFpcnxlbnwxfHx8fDE3NjA2NTc4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 30,
    popular: true,
  },
  {
    id: '6',
    name: 'Dialaber femme élégant',
    category: 'dialaber',
    price: 25000,
    wholesalePrice: 20000,
    description: 'Dialaber traditionnel pour femme, tissu de qualité premium. Design élégant et authentique.',
    image: 'https://images.unsplash.com/photo-1641422162969-3a3d177124d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBzaG9wcGluZ3xlbnwxfHx8fDE3NjA2NDI4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1641422162969-3a3d177124d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBzaG9wcGluZ3xlbnwxfHx8fDE3NjA2NDI4MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 100,
    popular: false,
  },
];
