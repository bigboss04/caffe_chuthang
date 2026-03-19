import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 120000, // 2 minutes - Render free tier can take up to 60s cold start
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach admin token for admin API calls
api.interceptors.request.use(
    (config) => {
        // Auto-attach token for admin endpoints (except auth)
        if (config.url?.includes('/admin') && !config.url?.includes('/admin/auth')) {
            const token = localStorage.getItem('admin_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            const message = error.response.data?.message || 'Đã có lỗi xảy ra';

            // If 401 on admin endpoint, clear token and redirect to login
            if (status === 401 && window.location.pathname.startsWith('/admin')) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.dispatchEvent(new Event('admin-logout'));
            }

            console.error(`[API Error] ${status}: ${message}`);
        } else if (error.code === 'ECONNABORTED') {
            console.error('[API Error] Request timeout - server đang khởi động, vui lòng thử lại');
        } else if (error.request) {
            console.error('[API Error] Không thể kết nối đến server');
        } else {
            console.error('[API Error]', error.message);
        }
        return Promise.reject(error);
    }
);

// Wake up the backend server on app load (Render free tier cold start)
const wakeUpServer = () => {
    api.get('/products?size=1')
        .then(() => console.log('✅ Server is awake'))
        .catch(() => console.log('⏳ Server is waking up...'));
};

// Only ping in production
if (import.meta.env.VITE_API_URL?.includes('render.com')) {
    wakeUpServer();
}

export default api;
