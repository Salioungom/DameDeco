export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DRAFT = 'draft',
    ARCHIVED = 'archived',
    OUT_OF_STOCK = 'out_of_stock'
}

export interface ProductImage {
    id: number;
    product_id: string;
    image_url: string;
    alt_text?: string;
    is_cover: boolean;
    sort_order: number;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    original_price?: number;
    compare_price?: number; // Backend field
    wholesale_price?: number;
    cost_price?: number; // Backend field
    sku: string;
    inventory_quantity: number;
    min_order_quantity: number;
    weight?: number;
    dimensions?: string;
    status: ProductStatus;
    is_featured: boolean;
    popular?: boolean; // Backend field
    is_new: boolean;
    category_id: number;
    category_name?: string;
    cover_image_url?: string;
    images?: ProductImage[];
    pieces?: number;
    meta_title?: string;
    meta_description?: string;
    average_rating?: string; // Backend field
    review_count?: number; // Backend field
    created_at: string;
    updated_at: string;
}

export interface ProductFilters {
    search?: string;
    category_id?: number | null;
    status?: ProductStatus | null;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    is_new?: boolean;
    skip?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface ProductPaginatedResponse {
    items: Product[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface CreateProductData {
    name: string;
    description?: string;
    short_description?: string;
    price: number;
    original_price?: number;
    wholesale_price?: number;
    sku: string;
    inventory_quantity: number;
    min_order_quantity?: number;
    weight?: number;
    dimensions?: string;
    status?: ProductStatus;
    is_featured?: boolean;
    is_new?: boolean;
    category_id: number;
    pieces?: number;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
    id: string;
}
