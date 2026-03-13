import api from './api';

export const contactService = {
    // Send a contact message
    // BE: POST /api/contact
    sendMessage: async (contactData) => {
        const { data } = await api.post('/contact', contactData);
        return data; // ApiResponse → { success, message, data: ContactMessage }
    },
};

export default contactService;
