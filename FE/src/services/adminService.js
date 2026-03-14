import api from './api';

export const adminService = {
    // ==================== DASHBOARD ====================
    getDashboard: async () => {
        const { data } = await api.get('/admin/dashboard');
        return data.data;
    },

    // ==================== PRODUCTS ====================
    getProducts: async () => {
        const { data } = await api.get('/admin/products');
        return data.data;
    },
    createProduct: async (product) => {
        const { data } = await api.post('/admin/products', product);
        return data.data;
    },
    updateProduct: async (id, product) => {
        const { data } = await api.put(`/admin/products/${id}`, product);
        return data.data;
    },
    deleteProduct: async (id) => {
        const { data } = await api.delete(`/admin/products/${id}`);
        return data.data;
    },
    toggleProduct: async (id) => {
        const { data } = await api.put(`/admin/products/${id}/toggle`);
        return data.data;
    },
    updateProductStock: async (id, stock) => {
        const { data } = await api.put(`/admin/products/${id}/stock?stock=${stock}`);
        return data.data;
    },

    // ==================== CATEGORIES ====================
    getCategories: async () => {
        const { data } = await api.get('/admin/categories');
        return data.data;
    },
    createCategory: async (category) => {
        const { data } = await api.post('/admin/categories', category);
        return data.data;
    },
    updateCategory: async (id, category) => {
        const { data } = await api.put(`/admin/categories/${id}`, category);
        return data.data;
    },
    deleteCategory: async (id) => {
        const { data } = await api.delete(`/admin/categories/${id}`);
        return data.data;
    },

    // ==================== ORDERS ====================
    getOrders: async ({ page = 0, size = 20, status } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        if (status && status !== 'ALL') params.append('status', status);
        const { data } = await api.get(`/admin/orders?${params.toString()}`);
        return data.data;
    },
    getOrderDetail: async (orderId) => {
        const { data } = await api.get(`/admin/orders/${orderId}`);
        return data.data;
    },
    updateOrderStatus: async (orderId, status) => {
        const { data } = await api.put(`/admin/orders/${orderId}/status?status=${status}`);
        return data.data;
    },
    cancelOrder: async (orderId) => {
        const { data } = await api.delete(`/admin/orders/${orderId}`);
        return data.data;
    },

    // ==================== CUSTOMERS ====================
    getCustomers: async ({ page = 0, size = 20, search } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        if (search) params.append('search', search);
        const { data } = await api.get(`/admin/customers?${params.toString()}`);
        return data.data;
    },
    getCustomerDetail: async (id) => {
        const { data } = await api.get(`/admin/customers/${id}`);
        return data.data;
    },
    toggleLockCustomer: async (id) => {
        const { data } = await api.put(`/admin/customers/${id}/lock`);
        return data.data;
    },

    // ==================== COUPONS ====================
    getCoupons: async () => {
        const { data } = await api.get('/admin/coupons');
        return data.data;
    },
    createCoupon: async (coupon) => {
        const { data } = await api.post('/admin/coupons', coupon);
        return data.data;
    },
    updateCoupon: async (id, coupon) => {
        const { data } = await api.put(`/admin/coupons/${id}`, coupon);
        return data.data;
    },
    deleteCoupon: async (id) => {
        const { data } = await api.delete(`/admin/coupons/${id}`);
        return data.data;
    },

    // ==================== REVIEWS ====================
    getReviews: async ({ page = 0, size = 20 } = {}) => {
        const { data } = await api.get(`/admin/reviews?page=${page}&size=${size}`);
        return data.data;
    },
    toggleReviewVisibility: async (id) => {
        const { data } = await api.put(`/admin/reviews/${id}/toggle`);
        return data.data;
    },
    deleteReview: async (id) => {
        const { data } = await api.delete(`/admin/reviews/${id}`);
        return data.data;
    },

    // ==================== INVENTORY ====================
    getInventory: async () => {
        const { data } = await api.get('/admin/inventory');
        return data.data;
    },
    updateInventory: async (id, stock) => {
        const { data } = await api.put(`/admin/inventory/${id}?stock=${stock}`);
        return data.data;
    },

    // ==================== SHIPPING ====================
    getShippingZones: async () => {
        const { data } = await api.get('/admin/shipping');
        return data.data;
    },
    createShippingZone: async (zone) => {
        const { data } = await api.post('/admin/shipping', zone);
        return data.data;
    },
    updateShippingZone: async (id, zone) => {
        const { data } = await api.put(`/admin/shipping/${id}`, zone);
        return data.data;
    },
    deleteShippingZone: async (id) => {
        const { data } = await api.delete(`/admin/shipping/${id}`);
        return data.data;
    },

    // ==================== ANALYTICS ====================
    getAnalytics: async (days = 30) => {
        const { data } = await api.get(`/admin/analytics?days=${days}`);
        return data.data;
    },

    // ==================== CMS / BANNERS ====================
    getBanners: async () => {
        const { data } = await api.get('/admin/banners');
        return data.data;
    },
    createBanner: async (banner) => {
        const { data } = await api.post('/admin/banners', banner);
        return data.data;
    },
    updateBanner: async (id, banner) => {
        const { data } = await api.put(`/admin/banners/${id}`, banner);
        return data.data;
    },
    deleteBanner: async (id) => {
        const { data } = await api.delete(`/admin/banners/${id}`);
        return data.data;
    },

    // ==================== SETTINGS ====================
    getSettings: async () => {
        const { data } = await api.get('/admin/settings');
        return data.data;
    },
    updateSettings: async (settings) => {
        const { data } = await api.put('/admin/settings', settings);
        return data.data;
    },

    // ==================== CONTACTS ====================
    getContacts: async ({ page = 0, size = 20 } = {}) => {
        const { data } = await api.get(`/admin/contacts?page=${page}&size=${size}`);
        return data.data;
    },
    markContactRead: async (id) => {
        const { data } = await api.put(`/admin/contacts/${id}/read`);
        return data.data;
    },
    deleteContact: async (id) => {
        const { data } = await api.delete(`/admin/contacts/${id}`);
        return data.data;
    },
};

export default adminService;
