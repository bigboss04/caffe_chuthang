import api from './api';

export const blogService = {
    // Get all blog posts
    // BE: GET /api/blog
    getBlogs: async () => {
        const { data } = await api.get('/blog');
        return data.data;
    },

    // Get blog by slug
    // BE: GET /api/blog/{slug}
    getBlogBySlug: async (slug) => {
        const { data } = await api.get(`/blog/${slug}`);
        return data.data;
    },
};

export default blogService;
