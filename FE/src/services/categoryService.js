import api from './api';

export const categoryService = {
    // Get all categories
    // BE: GET /api/categories
    getCategories: async () => {
        const { data } = await api.get('/categories');
        return data.data;
    },
};

export default categoryService;
