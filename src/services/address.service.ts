/**
 * @file /services/address.service.ts
 * @description Service dédié à la gestion des adresses utilisateur avec API v1
 * @version 1.0.0
 * @author DameDéco Team
 */

import { api } from '@/lib/api';

// Types pour les adresses
export interface Address {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Interface pour la création d'adresse
export interface CreateAddressData {
  first_name: string;
  last_name: string;
  address: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  is_default?: boolean;
}

// Interface pour la mise à jour d'adresse
export interface UpdateAddressData {
  first_name?: string;
  last_name?: string;
  address?: string;
  street?: string;
  city?: string;
  country?: string;
  phone?: string;
  is_default?: boolean;
}

// Service de gestion des adresses
export class AddressService {
  /**
   * Récupérer la liste des adresses de l'utilisateur
   */
  static async getUserAddresses(): Promise<Address[]> {
    try {
      const response = await api.get<Address[]>('/api/v1/addresses');
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
      const response = await api.get<Address>(`/api/v1/addresses/${id}`);
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
      const response = await api.post<Address>('/api/v1/addresses', addressData);
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
      const response = await api.put<Address>(`/api/v1/addresses/${id}`, addressData);
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
      await api.delete(`/api/v1/addresses/${id}`);
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
      const response = await api.patch<Address>(`/api/v1/addresses/${id}/default`);
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
      const addresses = await this.getUserAddresses();
      return addresses.find(addr => addr.is_default) || null;
    } catch (error) {
      console.error('Erreur récupération adresse par défaut:', error);
      return null;
    }
  }

  /**
   * Formater l'adresse pour l'affichage
   */
  static formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.country}`;
  }

  /**
   * Formater le nom complet pour l'affichage
   */
  static formatFullName(address: Address): string {
    return `${address.first_name} ${address.last_name}`;
  }
}
