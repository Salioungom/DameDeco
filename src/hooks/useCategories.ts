import { useState, useEffect, useCallback } from 'react';
import { categoryService, type Category } from '@/services/category.service';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getActiveCategories();
      setCategories(data);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryById = useCallback(async (id: number) => {
    try {
      const category = await categoryService.getCategoryById(id);
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Catégorie non trouvée';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getCategoryBySlug = useCallback(async (slug: string) => {
    try {
      const category = await categoryService.getCategoryBySlug(slug);
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Catégorie non trouvée';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryBySlug,
    refetch: fetchCategories,
  };
}
