import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.message || 'Đã có lỗi xảy ra';
            console.error(`[API Error] ${error.response.status}: ${message}`);
        } else if (error.request) {
            // No response received
            console.error('[API Error] Không thể kết nối đến server');
        } else {
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
