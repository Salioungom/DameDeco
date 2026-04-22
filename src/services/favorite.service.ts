/**
 * @file /services/favorite.service.ts
 * @description Service dédié à la gestion des favoris produits avec API v1
 * @version 1.0.0
 * @author DameDéco Team
 */

import { api } from '@/lib/api';

// Types pour les favoris
export interface ProductInfo {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  original_price?: number;
  compare_price?: number;
  pieces?: number;
}

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  product: ProductInfo;
  created_at: string;
  updated_at: string;
}

// Interface pour la réponse paginée des favoris
export interface FavoritesList {
  items: Favorite[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Interface pour la création de favori
export interface CreateFavoriteData {
  product_id: number;
}

// Service de gestion des favoris
export class FavoriteService {
  /**
   * Récupérer la liste des favoris de l'utilisateur
   */
  static async getUserFavorites(skip: number = 0, limit: number = 20): Promise<FavoritesList> {
    try {
      const response = await api.get<FavoritesList>(`/api/v1/favorites/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération favoris:', error);
      throw new Error('Impossible de récupérer les favoris');
    }
  }

  /**
   * Ajouter un produit aux favoris
   */
  static async addFavorite(productId: number): Promise<Favorite> {
    try {
      const response = await api.post<Favorite>(`/api/v1/favorites/?product_id=${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur ajout favori:', error);
      if (error.response?.data?.detail === "Produit déjà dans les favoris") {
        throw new Error("Ce produit est déjà dans vos favoris");
      }
      throw new Error('Impossible d\'ajouter aux favoris');
    }
  }

  /**
   * Retirer un produit des favoris
   */
  static async removeFavorite(productId: number): Promise<void> {
    try {
      await api.delete(`/api/v1/favorites/${productId}`);
    } catch (error: any) {
      console.error('Erreur suppression favori:', error);
      if (error.response?.status === 404) {
        throw new Error("Favori non trouvé");
      }
      throw new Error('Impossible de retirer des favoris');
    }
  }

  /**
   * Vérifier si un produit est dans les favoris
   */
  static async checkFavorite(productId: number): Promise<boolean> {
    try {
      const response = await api.get<{ isFavorite: boolean }>(`/api/v1/favorites/check/${productId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('Erreur vérification favori:', error);
      return false;
    }
  }

  /**
   * Basculer le statut de favori d'un produit
   */
  static async toggleFavorite(productId: number): Promise<boolean> {
    try {
      const isFavorite = await this.checkFavorite(productId);
      if (isFavorite) {
        await this.removeFavorite(productId);
        return false;
      } else {
        await this.addFavorite(productId);
        return true;
      }
    } catch (error) {
      console.error('Erreur basculement favori:', error);
      throw new Error('Impossible de modifier les favoris');
    }
  }

  /**
   * Récupérer le nombre de favoris de l'utilisateur
   */
  static async getFavoritesCount(): Promise<number> {
    try {
      const favorites = await this.getUserFavorites(0, 20);
      return favorites.total;
    } catch (error) {
      console.error('Erreur récupération nombre favoris:', error);
      return 0;
    }
  }

  /**
   * Vider tous les favoris de l'utilisateur
   */
  static async clearFavorites(): Promise<void> {
    try {
      const favorites = await this.getUserFavorites(0, 100);
      await Promise.all(
        favorites.items.map(favorite => this.removeFavorite(favorite.product_id))
      );
    } catch (error) {
      console.error('Erreur vidage favoris:', error);
      throw new Error('Impossible de vider les favoris');
    }
  }
}
