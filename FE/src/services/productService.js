import api from './api';

export const productService = {
    // Get all products with filtering, sorting, and pagination
    // BE: GET /api/products/search?category=...&search=...&sort=...&page=0&size=12
    getProducts: async ({ category, search, sort, page = 0, size = 20 } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search) params.append('search', search);
        if (sort && sort !== 'default') params.append('sort', sort);
        params.append('page', page);
        params.append('size', size);

        const { data } = await api.get(`/products/search?${params.toString()}`);
        return data.data; // ApiResponse → { success, message, data: PagedResponse }
    },

    // Get all products (no pagination)
    // BE: GET /api/products
    getAllProducts: async () => {
        const { data } = await api.get('/products');
        return data.data;
    },

    // Get single product by slug
    // BE: GET /api/products/slug/{slug}
    getProductBySlug: async (slug) => {
        const { data } = await api.get(`/products/slug/${slug}`);
        return data.data;
    },

    // Get featured products
    // BE: GET /api/products/featured
    getFeaturedProducts: async () => {
        const { data } = await api.get('/products/featured');
        return data.data;
    },

    // Get related products
    // BE: GET /api/products/{id}/related?limit=4
    getRelatedProducts: async (productId, limit = 4) => {
        const { data } = await api.get(`/products/${productId}/related?limit=${limit}`);
        return data.data;
    },
};

export default productService;
