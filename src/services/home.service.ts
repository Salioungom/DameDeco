import axios from 'axios';
import { Category } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export const homeService = {
  // Récupérer les catégories actives pour la page d'accueil
  async getActiveCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/categories/active`,
        getAuthHeader()
      );
      // L'API retourne { items: Category[] }
      const apiCategories = response.data.items || response.data || [];
      
      // Transformer les catégories de l'API vers le format attendu par HomePage
      return apiCategories.map((apiCategory: any) => ({
        id: apiCategory.id.toString(),
        name: apiCategory.name,
        icon: '🏠', // Icône par défaut
        image: apiCategory.cover_image_url || '/placeholder-image.jpg'
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      // En cas d'erreur, retourner un tableau vide
      return [];
    }
  },
};
