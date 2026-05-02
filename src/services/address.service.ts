/**
 * @file /services/address.service.ts
 * @description Service dédié à la gestion des adresses utilisateur avec API v1
 * @version 2.0.0
 * @author DameDéco Team
 */

import { api } from '@/lib/api';

// Types pour les adresses (alignés avec le backend)
export interface Address {
  id: number;
  user_id: number;
  address_type: "billing" | "shipping";
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  is_default: boolean;
  first_name: string;
  last_name: string;
  phone: string;
  delivery_instructions?: string;
  created_at: string;
  updated_at: string;
}

// Interface pour la réponse paginée
export interface AddressListResponse {
  items: Address[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Interface pour la création d'adresse
export interface CreateAddressData {
  address_type?: "billing" | "shipping";
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  first_name: string;
  last_name: string;
  phone: string;
  delivery_instructions?: string;
  is_default?: boolean;
}

// Interface pour la mise à jour d'adresse
export interface UpdateAddressData {
  address_type?: "billing" | "shipping";
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  delivery_instructions?: string;
  is_default?: boolean;
}

// Service de gestion des adresses
export class AddressService {
  private static readonly API_BASE = '/api/v1/addresses';

  /**
   * Récupérer la liste des adresses de l'utilisateur avec pagination
   */
  static async getUserAddresses(skip = 0, limit = 20): Promise<AddressListResponse> {
    try {
      const response = await api.get<AddressListResponse>(`${this.API_BASE}/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération adresses:', error);
      throw new Error('Impossible de récupérer les adresses');
    }
  }

  /**
   * Récupérer une adresse par son ID
   */
  static async getAddressById(id: number): Promise<Address> {
    try {
      const response = await api.get<Address>(`${this.API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération adresse:', error);
      throw new Error('Impossible de récupérer l\'adresse');
    }
  }

  /**
   * Créer une nouvelle adresse
   */
  static async createAddress(addressData: CreateAddressData): Promise<Address> {
    try {
      const response = await api.post<Address>(`${this.API_BASE}/`, addressData);
      return response.data;
    } catch (error) {
      console.error('Erreur création adresse:', error);
      throw new Error('Impossible de créer l\'adresse');
    }
  }

  /**
   * Mettre à jour une adresse existante
   */
  static async updateAddress(id: number, addressData: UpdateAddressData): Promise<Address> {
    try {
      const response = await api.put<Address>(`${this.API_BASE}/${id}`, addressData);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour adresse:', error);
      throw new Error('Impossible de mettre à jour l\'adresse');
    }
  }

  /**
   * Supprimer une adresse
   */
  static async deleteAddress(id: number): Promise<void> {
    try {
      await api.delete(`${this.API_BASE}/${id}`);
    } catch (error) {
      console.error('Erreur suppression adresse:', error);
      throw new Error('Impossible de supprimer l\'adresse');
    }
  }

  /**
   * Définir une adresse comme adresse par défaut
   */
  static async setDefaultAddress(id: number): Promise<Address> {
    try {
      const response = await api.patch<Address>(`${this.API_BASE}/${id}/default`);
      return response.data;
    } catch (error) {
      console.error('Erreur définition adresse par défaut:', error);
      throw new Error('Impossible de définir l\'adresse par défaut');
    }
  }

  /**
   * Récupérer l'adresse par défaut de l'utilisateur
   */
  static async getDefaultAddress(): Promise<Address | null> {
    try {
      const response = await this.getUserAddresses(0, 100);
      return response.items.find(addr => addr.is_default) || null;
    } catch (error) {
      console.error('Erreur récupération adresse par défaut:', error);
      return null;
    }
  }

  /**
   * Formater l'adresse pour l'affichage
   */
  static formatAddress(address: Address): string {
    let parts = [address.address_line_1];
    if (address.address_line_2) parts.push(address.address_line_2);
    parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(', ');
  }

  /**
   * Formater le nom complet pour l'affichage
   */
  static formatFullName(address: Address): string {
    return `${address.first_name} ${address.last_name}`;
  }

  /**
   * Formater l'adresse complète avec nom et téléphone
   */
  static formatFullAddress(address: Address): string {
    return `${this.formatFullName(address)}\n${address.phone}\n${this.formatAddress(address)}${address.delivery_instructions ? `\nInstructions: ${address.delivery_instructions}` : ''}`;
  }
}
