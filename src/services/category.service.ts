import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const handleApiError = (error: unknown): never => {
  const axiosError = error as any;

  if (axiosError.response) {
    const { status, data } = axiosError.response;

    switch (status) {
      case 401:
        // Déconnexion en cas d'expiration de session
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      case 403:
        throw new Error('Accès refusé. Vous n\'avez pas les droits nécessaires.');
      case 404:
        throw new Error('Catégorie non trouvée.');
      case 409:
        throw new Error('Une catégorie avec ce nom ou ce slug existe déjà.');
      default:
        const errorMessage = data?.message || 'Une erreur est survenue';
        throw new Error(errorMessage);
    }
  }

  throw new Error('Erreur de connexion au serveur');
};

export const categoryService = {
  // Récupérer toutes les catégories avec pagination et filtres
  async getCategories(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
  }): Promise<PaginatedResponse<Category>> {
    try {
      const response = await axios.get<PaginatedResponse<Category>>(
        `${API_BASE_URL}/api/v1/categories/`,
        {
          ...getAuthHeader(),
          params,
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Récupérer les catégories actives
  async getActiveCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(
        `${API_BASE_URL}/api/v1/categories/active`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Récupérer une catégorie par ID
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await axios.get<Category>(
        `${API_BASE_URL}/api/v1/categories/${id}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Récupérer une catégorie par slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const response = await axios.get<Category>(
        `${API_BASE_URL}/api/v1/categories/slug/${slug}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Créer une nouvelle catégorie
  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
  }): Promise<Category> {
    try {
      const response = await axios.post<Category>(
        `${API_BASE_URL}/api/v1/categories/`,
        data,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mettre à jour une catégorie
  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    try {
      const response = await axios.put<Category>(
        `${API_BASE_URL}/api/v1/categories/${id}`,
        data,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Supprimer une catégorie
  async deleteCategory(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/categories/${id}`, getAuthHeader());
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Basculer le statut actif/inactif d'une catégorie
  async toggleCategoryStatus(id: number): Promise<Category> {
    try {
      const response = await axios.patch<Category>(
        `${API_BASE_URL}/api/v1/categories/${id}/toggle`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Téléverser ou remplacer une image de catégorie
  async uploadCategoryImage(id: number, file: File): Promise<Category> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<Category>(
        `${API_BASE_URL}/api/v1/categories/${id}/image`,
        formData,
        {
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mettre à jour une image de catégorie (NEW)
  async updateCategoryImage(id: number, file: File): Promise<Category> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put<Category>(
        `${API_BASE_URL}/api/v1/categories/${id}/image`,
        formData,
        {
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Supprimer l'image d'une catégorie
  async deleteCategoryImage(id: number): Promise<Category> {
    try {
      const response = await axios.delete<Category>(
        `${API_BASE_URL}/api/v1/categories/${id}/image`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
