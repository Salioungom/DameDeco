import { useState, useEffect, useCallback } from 'react';
import { categoryService, type Category } from '@/services/category.service';
import { ApiError, ApiErrorHandler } from '@/lib/error-handler';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await categoryService.getActiveCategories();
      
      if (result.error) {
        setError(result.error);
        setCategories([]);
      } else {
        setCategories(result.data || []);
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      setCategories([]);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryById = useCallback(async (id: number) => {
    try {
      const result = await categoryService.getCategoryById(id);
      
      if (result.error) {
        throw result.error;
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      throw apiError;
    }
  }, []);

  const getCategoryBySlug = useCallback(async (slug: string) => {
    try {
      const result = await categoryService.getCategoryBySlug(slug);
      
      if (result.error) {
        throw result.error;
      }
      
      return result.data;
    } catch (err) {
      const apiError = ApiErrorHandler.classifyError(err);
      setError(apiError);
      throw apiError;
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
