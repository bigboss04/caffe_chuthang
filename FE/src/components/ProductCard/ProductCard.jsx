import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart, Star, TrendingUp, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const { addItem, toggleCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) return;

        addItem(product, selectedVariant);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
            icon: '🛍️',
            style: {
                borderRadius: '16px',
                background: '#2C1810',
                color: '#FDF8F0',
                fontWeight: 'bold',
            },
        });

        // Smoothly toggle the cart after a short delay for better UX
        setTimeout(toggleCart, 800);
    };

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group bg-white rounded-[2rem] overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-500 border border-secondary/5 flex flex-col h-full perspective-1000">
            {/* Visual Area */}
            <div className="relative aspect-square overflow-hidden bg-cream/30">
                <Link to={`/san-pham/${product.slug}`} className="block h-full group-hover:scale-110 transition-transform duration-1000">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {discount > 0 && (
                        <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Giảm {discount}%
                        </span>
                    )}
                    {product.badge === 'bestseller' && (
                        <span className="bg-secondary text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                            <TrendingUp size={10} strokeWidth={3} /> Bán chạy
                        </span>
                    )}
                    {product.badge === 'new' && (
                        <span className="bg-cream text-primary border border-primary/10 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Mới về
                        </span>
                    )}
                </div>

                {/* Action Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10 drop-shadow-2xl">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${product.stock === 0
                            ? 'bg-primary/20 text-text-muted cursor-not-allowed'
                            : 'bg-primary text-cream hover:bg-primary-light active:scale-95 shadow-xl hover:shadow-2xl'
                            }`}
                    >
                        <ShoppingBag size={14} strokeWidth={2.5} />
                        {product.stock === 0 ? 'Hết hàng' : 'Thêm ngay'}
                    </button>
                    <Link
                        to={`/san-pham/${product.slug}`}
                        className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl text-primary hover:bg-secondary hover:text-primary transition-all shadow-xl active:scale-95 group/link flex-shrink-0"
                        title="Xem chi tiết"
                    >
                        <Eye size={18} strokeWidth={2.5} className="group-hover/link:scale-110 transition-transform" />
                    </Link>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col gap-4 flex-1 bg-white">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary tracking-[0.2em]">{product.categoryLabel || (typeof product.category === 'object' ? product.category?.name : product.category)}</span>
                        <div className="flex items-center gap-1 text-[#F59E0B]">
                            <Star size={10} className="fill-[#F59E0B]" />
                            <span className="text-[10px] font-bold text-text-muted">4.9 (120)</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-serif font-black text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                        <Link to={`/san-pham/${product.slug}`}>{product.name}</Link>
                    </h3>
                </div>

                {product.variants && product.variants.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {product.variants.map((v) => (
                            <button
                                key={v.label}
                                onClick={() => setSelectedVariant(v)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${selectedVariant?.label === v.label
                                    ? 'bg-secondary text-primary shadow-lg border border-secondary'
                                    : 'bg-cream text-text-muted hover:bg-secondary/20 border border-secondary/5'
                                    }`}
                            >
                                {v.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="pt-2 mt-auto border-t border-secondary/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-serif font-black text-primary tracking-tight">
                            {formatPrice(selectedVariant ? selectedVariant.price : product.price)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-[10px] font-bold text-text-muted line-through opacity-50">
                                {formatPrice(product.originalPrice)}
                            </span>
                        )}
                    </div>
                    {product.stock > 0 && product.stock < 10 && (
                        <span className="text-[10px] font-black text-secondary flex items-center gap-1">
                            <span className="w-1 h-1 bg-secondary rounded-full animate-ping" /> Sắp hết
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
