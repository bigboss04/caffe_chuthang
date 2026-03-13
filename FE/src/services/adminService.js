import api from './api';

export const adminService = {
    // Dashboard overview
    getDashboard: async () => {
        const { data } = await api.get('/admin/dashboard');
        return data.data;
    },

    // Orders
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

    // Contacts
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

    // Products
    getProducts: async () => {
        const { data } = await api.get('/admin/products');
        return data.data;
    },
};

export default adminService;
