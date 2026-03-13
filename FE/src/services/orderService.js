import api from './api';

export const orderService = {
    // Place a new order
    // BE: POST /api/orders
    createOrder: async (orderData) => {
        const payload = {
            fullName: orderData.fullName,
            phone: orderData.phone,
            email: orderData.email || null,
            city: orderData.city || null,
            district: orderData.district || null,
            address: orderData.address,
            note: orderData.note || null,
            paymentMethod: orderData.paymentMethod,
            items: orderData.items.map(item => ({
                productId: item.id,
                productName: item.name,
                productImage: item.image,
                variantLabel: item.variantLabel,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        const { data } = await api.post('/orders', payload);
        return data; // ApiResponse → { success, message, data: OrderResponse }
    },

    // Get order by orderId
    // BE: GET /api/orders/{orderId}
    getOrder: async (orderId) => {
        const { data } = await api.get(`/orders/${orderId}`);
        return data.data;
    },
};

export default orderService;
