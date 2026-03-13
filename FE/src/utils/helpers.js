// Format currency VND
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

// Calculate discount percentage
export const getDiscountPercent = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Format date in Vietnamese
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// Generate star rating array
export const getStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating)) return 'full';
        if (i < rating) return 'half';
        return 'empty';
    });
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// Scroll to top
export const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Badge color mapping
export const getBadgeClass = (type) => {
    const map = {
        hot: 'badge-hot',
        new: 'badge-new',
        sale: 'badge-sale',
        organic: 'badge-organic',
    };
    return map[type] || 'badge-new';
};
