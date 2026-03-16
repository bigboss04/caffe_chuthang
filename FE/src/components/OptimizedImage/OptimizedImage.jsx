import { useState, useRef, useEffect } from 'react';

/**
 * Optimized image component with:
 * - IntersectionObserver lazy loading
 * - Blur-up placeholder effect
 * - Proper width/height for CLS prevention
 * - Unsplash auto-format optimization
 */
export default function OptimizedImage({
    src,
    alt,
    className = '',
    width,
    height,
    sizes = '100vw',
    priority = false,
    ...props
}) {
    const [loaded, setLoaded] = useState(priority);
    const [inView, setInView] = useState(priority);
    const imgRef = useRef(null);

    // Optimize Unsplash URLs for smaller size
    const optimizeSrc = (url, w = 800) => {
        if (!url) return url;
        if (url.includes('unsplash.com')) {
            // Replace or add quality and width params
            const base = url.split('?')[0];
            return `${base}?auto=format&fit=crop&q=75&w=${w}`;
        }
        return url;
    };

    // Tiny placeholder (20px wide blurred)
    const placeholderSrc = (url) => {
        if (!url) return url;
        if (url.includes('unsplash.com')) {
            const base = url.split('?')[0];
            return `${base}?auto=format&fit=crop&q=10&w=20&blur=10`;
        }
        return url;
    };

    useEffect(() => {
        if (priority || !imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Start loading 200px before in viewport
        );

        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [priority]);

    const optimizedSrc = optimizeSrc(src);
    const srcSet = src?.includes('unsplash.com')
        ? `${optimizeSrc(src, 400)} 400w, ${optimizeSrc(src, 600)} 600w, ${optimizeSrc(src, 800)} 800w, ${optimizeSrc(src, 1200)} 1200w`
        : undefined;

    return (
        <div
            ref={imgRef}
            className={`optimized-img-wrap ${className}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#E8E0D4',
                ...(width && height ? { aspectRatio: `${width}/${height}` } : {})
            }}
            {...props}
        >
            {/* Blur placeholder */}
            {!loaded && (
                <img
                    src={placeholderSrc(src)}
                    alt=""
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(20px)',
                        transform: 'scale(1.1)',
                    }}
                />
            )}

            {/* Real image - only load when in viewport */}
            {(inView || priority) && (
                <img
                    src={optimizedSrc}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding={priority ? 'sync' : 'async'}
                    fetchPriority={priority ? 'high' : 'auto'}
                    onLoad={() => setLoaded(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                    }}
                />
            )}
        </div>
    );
}
