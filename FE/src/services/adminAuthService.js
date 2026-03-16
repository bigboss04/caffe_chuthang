import api from './api';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';

const adminAuthService = {
    /**
     * Login with username and password
     */
    login: async (username, password) => {
        const { data } = await api.post('/admin/auth/login', { username, password });
        if (data.success && data.data) {
            localStorage.setItem(ADMIN_TOKEN_KEY, data.data.token);
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({
                username: data.data.username,
                fullName: data.data.fullName,
                role: data.data.role,
            }));
        }
        return data;
    },

    /**
     * Logout - clear stored credentials
     */
    logout: () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
    },

    /**
     * Check if admin is logged in (has token)
     */
    isLoggedIn: () => {
        return !!localStorage.getItem(ADMIN_TOKEN_KEY);
    },

    /**
     * Get stored token
     */
    getToken: () => {
        return localStorage.getItem(ADMIN_TOKEN_KEY);
    },

    /**
     * Get stored admin user info
     */
    getUser: () => {
        const user = localStorage.getItem(ADMIN_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Verify token with server
     */
    verifyToken: async () => {
        try {
            const token = localStorage.getItem(ADMIN_TOKEN_KEY);
            if (!token) return false;
            const { data } = await api.get('/admin/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.success;
        } catch {
            // Token invalid or expired
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            localStorage.removeItem(ADMIN_USER_KEY);
            return false;
        }
    },
};

export default adminAuthService;
