import { useEffect } from 'react';

const DEFAULT_TITLE = 'Nông Sản Đắk Nông - Cà Phê Rang Xay Nguyên Chất | Mứt Gừng | Hồ Tiêu';
const DEFAULT_DESCRIPTION = 'Nông Sản Đắk Nông - Chuyên cà phê rang xay Arabica, Robusta nguyên chất từ Đà Lạt. Mứt gừng đặc sản Đắk Nông, hồ tiêu Phú Quốc. 100% tự nhiên, không phụ gia.';
const SITE_URL = 'https://caffe-chuthang.vercel.app';

/**
 * Hook to update page title and meta tags for SEO.
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description  
 * @param {string} options.path - Page path (e.g. '/san-pham')
 * @param {string} options.image - OG image URL
 */
export function useSEO({ title, description, path = '', image } = {}) {
    useEffect(() => {
        const fullTitle = title ? `${title} | Nông Sản Đắk Nông` : DEFAULT_TITLE;
        const desc = description || DEFAULT_DESCRIPTION;
        const url = `${SITE_URL}${path}`;
        const ogImage = image || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=630&fit=crop';

        // Update title
        document.title = fullTitle;

        // Helper to set meta content
        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (el) {
                el.setAttribute('content', content);
            } else {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                el.setAttribute('content', content);
                document.head.appendChild(el);
            }
        };

        setMeta('name', 'description', desc);
        setMeta('name', 'title', fullTitle);
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:url', url);
        setMeta('property', 'og:image', ogImage);
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:image', ogImage);

        // Update canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', url);
        }

        return () => {
            // Reset to defaults on unmount
            document.title = DEFAULT_TITLE;
        };
    }, [title, description, path, image]);
}
