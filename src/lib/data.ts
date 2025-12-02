export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verified?: boolean; // Si le client a acheté le produit
  helpful?: number; // Nombre de "utile"
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number; // Prix avant promo
  wholesalePrice: number;
  description: string;
  image: string;
  images: string[];
  stock: number;
  pieces?: number;
  popular?: boolean;
  reviews?: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment: string;
  items: number;
  source?: 'website' | 'whatsapp';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'retail' | 'wholesale';
  orders: number;
  totalSpent: number;
}

export const categories: Category[] = [
  { 
    id: 'sheets', 
    name: 'Draps', 
    icon: 'Bed',
    image: 'https://images.unsplash.com/photo-1720582611572-baf85ba10ed3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkJTIwc2hlZXRzfGVufDF8fHx8MTc2MTEzNjg4MXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'curtains', 
    name: 'Rideaux', 
    icon: 'Blinds',
    image: 'https://images.unsplash.com/photo-1754611380518-61a923cc47ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWluc3xlbnwxfHx8fDE3NjExMzY4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'prayer-mats', 
    name: 'Tapis de prière', 
    icon: 'CircleDot',
    image: 'https://images.unsplash.com/photo-1591624298055-3cfb0aa676c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBtYXR8ZW58MXx8fHwxNzYxMTM2ODgyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'carpets', 
    name: 'Moquettes', 
    icon: 'Square',
    image: 'https://images.unsplash.com/photo-1760444731155-e01b22bd6501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwY2FycGV0JTIwcnVnfGVufDF8fHx8MTc2MTEzNjg4Mnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'dialaber', 
    name: 'Dialaber', 
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1757140447779-9cffcc270104?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdHJhZGl0aW9uYWwlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjEwNDMyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: 'furniture', 
    name: 'Meubles & Fauteuils', 
    icon: 'Armchair',
    image: 'https://images.unsplash.com/photo-1675528030415-dc82908eeb73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjBhcm1jaGFpcnxlbnwxfHx8fDE3NjExMzY4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Ensemble draps luxe 6 pièces',
    category: 'sheets',
    price: 45000,
    originalPrice: 55000, // Prix en promo - 18% de réduction
    wholesalePrice: 38000,
    description: 'Ensemble complet de draps en coton égyptien premium, importé directement de Chine. Comprend 1 drap housse, 1 drap plat, 4 taies d\'oreillers. Qualité supérieure, doux et respirant.',
    image: 'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkZGluZyUyMHNoZWV0c3xlbnwxfHx8fDE3NjA2NTc4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkZGluZyUyMHNoZWV0c3xlbnwxfHx8fDE3NjA2NTc4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1634574094895-f38cd9aa8d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRkaW5nJTIwY2xvc2V1cHxlbnwxfHx8fDE3NjExMzcwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzYxMTE4MDkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 150,
    pieces: 6,
    popular: true,
    reviews: [
      {
        id: 'rev1',
        productId: '1',
        customerName: 'Aminata Ndiaye',
        rating: 5,
        comment: 'Excellente qualité ! Les draps sont très doux et confortables. La livraison a été rapide et le service client impeccable. Je recommande vivement !',
        date: '2024-10-15T10:30:00Z',
        verified: true,
        helpful: 12,
      },
      {
        id: 'rev2',
        productId: '1',
        customerName: 'Moussa Sow',
        rating: 4,
        comment: 'Très bon produit, conforme à la description. Le tissu est de qualité et les couleurs sont belles. Petit bémol sur le délai de livraison qui était un peu long.',
        date: '2024-10-20T14:15:00Z',
        verified: true,
        helpful: 8,
      },
      {
        id: 'rev3',
        productId: '1',
        customerName: 'Fatou Diallo',
        rating: 5,
        comment: 'Je suis ravie de mon achat ! Les draps sont exactement comme sur les photos. Le prix grossiste est très avantageux pour ma boutique. Merci Dame Sarr !',
        date: '2024-10-25T09:45:00Z',
        verified: true,
        helpful: 15,
      },
      {
        id: 'rev4',
        productId: '1',
        customerName: 'Omar Ba',
        rating: 5,
        comment: 'Produit de très haute qualité. Ma femme est très contente. La commande via WhatsApp était très pratique. Continuez comme ça !',
        date: '2024-11-01T16:20:00Z',
        verified: false,
        helpful: 5,
      },
    ],
    averageRating: 4.75,
    reviewCount: 4,
  },
  {
    id: '2',
    name: 'Rideaux premium 3 pièces',
    category: 'curtains',
    price: 35000,
    originalPrice: 42000, // Prix en promo - 17% de réduction
    wholesalePrice: 28000,
    description: 'Magnifiques rideaux occultants en tissu de haute qualité. Set de 3 pièces parfait pour salon ou chambre. Design élégant et moderne.',
    image: 'https://images.unsplash.com/photo-1754611380518-61a923cc47ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWlucyUyMGludGVyaW9yfGVufDF8fHx8MTc2MDYxODQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1754611380518-61a923cc47ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWlucyUyMGludGVyaW9yfGVufDF8fHx8MTc2MDYxODQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1585915430754-c519de12621a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJ0YWluJTIwZmFicmljJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjExMzcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1714424401350-f6da4b5e17c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjB0cmVhdG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjExMzcwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 80,
    pieces: 3,
    popular: true,
    reviews: [
      {
        id: 'rev5',
        productId: '2',
        customerName: 'Aissatou Kane',
        rating: 5,
        comment: 'Magnifiques rideaux ! Ils bloquent vraiment bien la lumière et donnent un style élégant à mon salon. Je vais en commander d\'autres pour les chambres.',
        date: '2024-10-18T11:00:00Z',
        verified: true,
        helpful: 9,
      },
      {
        id: 'rev6',
        productId: '2',
        customerName: 'Ibrahima Sarr',
        rating: 4,
        comment: 'Bonne qualité, le tissu est épais et les finitions sont soignées. Un peu cher mais ça vaut le coup pour la qualité.',
        date: '2024-10-28T15:30:00Z',
        verified: true,
        helpful: 6,
      },
      {
        id: 'rev7',
        productId: '2',
        customerName: 'Mariama Fall',
        rating: 5,
        comment: 'Parfait ! Exactement ce que je cherchais. L\'équipe Dame Sarr est très professionnelle. Livraison rapide à Dakar.',
        date: '2024-11-02T13:45:00Z',
        verified: false,
        helpful: 4,
      },
    ],
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
      'https://images.unsplash.com/photo-1760272147659-d3a65102e7e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBydWclMjBkZXRhaWx8ZW58MXx8fHwxNzYxMTM3MDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 200,
    popular: false,
  },
  {
    id: '4',
    name: 'Moquette luxueuse grande taille',
    category: 'carpets',
    price: 85000,
    originalPrice: 105000, // Prix en promo - 19% de réduction
    wholesalePrice: 70000,
    description: 'Moquette élégante pour salon ou chambre. Matière premium, résistante et facile d\'entretien. Parfaite pour une ambiance chaleureuse.',
    image: 'https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJwZXQlMjBydWd8ZW58MXx8fHwxNzYwNjU3ODM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJwZXQlMjBydWd8ZW58MXx8fHwxNzYwNjU3ODM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1660338183207-12f52f1bf9e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwZXQlMjB0ZXh0dXJlJTIwcGF0dGVybnxlbnwxfHx8fDE3NjExMzcwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1514887293667-9ea176e6c42d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwcnVnfGVufDF8fHx8MTc2MTEzNzAwMnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29tJTIwaW50ZXJpb3IlMjBydWd8ZW58MXx8fHwxNzYxMTM3MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
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
      'https://images.unsplash.com/photo-1637606240283-259eddf8d89c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm1jaGFpciUyMGRldGFpbHxlbnwxfHx8fDE3NjExMzcwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
  {
    id: '7',
    name: 'Draps ensemble 4 pièces',
    category: 'sheets',
    price: 32000,
    wholesalePrice: 26000,
    description: 'Ensemble de draps 4 pièces en coton de qualité. Confortable et durable, idéal pour usage quotidien.',
    image: 'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkZGluZyUyMHNoZWV0c3xlbnwxfHx8fDE3NjA2NTc4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1587552370813-a5140dbbc82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkZGluZyUyMHNoZWV0c3xlbnwxfHx8fDE3NjA2NTc4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    stock: 120,
    pieces: 4,
    popular: false,
  },
];

export const orders: Order[] = [
  {
    id: 'CMD-001',
    customer: 'Fatou Diop',
    date: '2025-10-14',
    total: 180000,
    status: 'delivered',
    payment: 'Wave',
    items: 4,
    source: 'website',
  },
  {
    id: 'CMD-002',
    customer: 'Moussa Ndiaye',
    date: '2025-10-15',
    total: 450000,
    status: 'processing',
    payment: 'Orange Money',
    items: 12,
    source: 'whatsapp',
  },
  {
    id: 'CMD-003',
    customer: 'Aminata Sow',
    date: '2025-10-15',
    total: 85000,
    status: 'shipped',
    payment: 'PayPal',
    items: 1,
    source: 'website',
  },
  {
    id: 'CMD-004',
    customer: 'Ibrahima Fall',
    date: '2025-10-16',
    total: 320000,
    status: 'pending',
    payment: 'Paiement à la livraison',
    items: 8,
    source: 'whatsapp',
  },
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Fatou Diop',
    email: 'fatou.diop@example.sn',
    phone: '+221 77 123 45 67',
    type: 'retail',
    orders: 8,
    totalSpent: 650000,
  },
  {
    id: '2',
    name: 'Moussa Ndiaye',
    email: 'moussa.ndiaye@example.sn',
    phone: '+221 76 234 56 78',
    type: 'wholesale',
    orders: 15,
    totalSpent: 2450000,
  },
  {
    id: '3',
    name: 'Aminata Sow',
    email: 'aminata.sow@example.sn',
    phone: '+221 70 345 67 89',
    type: 'retail',
    orders: 3,
    totalSpent: 215000,
  },
];
