import { useCart } from '../../context/CartContext';
import { ShoppingBag, X, Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck, Coffee } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleCheckout = () => {
        closeCart();
        navigate('/thanh-toan');
    };

    const freeShippingThreshold = 500000;
    const shippingLeft = freeShippingThreshold - totalPrice;
    const progressPercent = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

    return (
        <>
            {/* Background Overlay */}
            <div
                className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-[900] transition-opacity duration-500 animate-in fade-in"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <aside
                className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white z-[901] shadow-2xl flex flex-col transform transition-transform duration-500 ease-out animate-in slide-in-from-right"
                role="dialog"
                aria-label="Giỏ hàng của bạn"
            >
                {/* Header */}
                <div className="p-8 border-b border-cream flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-cream relative shadow-xl">
                            <ShoppingBag size={24} strokeWidth={2.5} />
                            <span className="absolute -top-1 -right-1 bg-secondary text-primary text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                                {totalItems}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-black text-primary uppercase tracking-tight">Giỏ Hàng</h2>
                            <span className="text-[10px] text-text-muted font-black uppercase tracking-widest leading-none">Cùng lan tỏa phong vị sạch</span>
                        </div>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:rotate-90 transition-all duration-300 active:scale-90"
                        aria-label="Đóng"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Shipping Progress */}
                {totalPrice > 0 && (
                    <div className="px-8 py-6 bg-cream/50 border-b border-secondary/5">
                        <div className="flex justify-between items-end mb-3 font-bold text-xs">
                            <span className="text-primary uppercase tracking-widest">
                                {shippingLeft > 0
                                    ? `Mua thêm ${formatPrice(shippingLeft)} để FREESHIP`
                                    : 'BẠN ĐÃ ĐƯỢC MIỄN PHÍ VẬN CHUYỂN ✨'}
                            </span>
                            <span className="text-secondary">{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-secondary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,163,115,0.5)]"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-reveal">
                            <div className="w-32 h-32 bg-cream rounded-[3rem] flex items-center justify-center text-secondary shadow-inner relative">
                                <ShoppingBag size={48} className="opacity-20 translate-y-2" />
                                <div className="absolute inset-x-0 bottom-4 text-[4rem]">☕</div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-black text-primary italic">Giỏ hàng đang trống</h3>
                                <p className="text-text-secondary text-sm font-medium">Bạn chưa chọn được sản phẩm ưng ý? Hãy ghé thăm cửa hàng của chúng tôi.</p>
                            </div>
                            <button
                                onClick={() => { closeCart(); navigate('/san-pham'); }}
                                className="btn btn-primary px-10 py-4 shadow-xl hover:shadow-2xl active:scale-95"
                            >
                                Đi mua sắm ngay
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 pt-8">
                            {items.map((item) => (
                                <div
                                    key={`${item.id}-${item.variantLabel}`}
                                    className="group flex gap-5 animate-reveal border-b border-cream pb-6 last:border-0"
                                >
                                    <Link to={item.slug ? `/san-pham/${item.slug}` : '/san-pham'} className="w-24 h-24 rounded-2xl overflow-hidden bg-cream flex-shrink-0 shadow-premium group-hover:shadow-premium-lg transition-all">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </Link>
                                    <div className="flex-1 space-y-2 relative">
                                        <div className="space-y-0.5">
                                            <h4 className="font-serif font-black text-primary line-clamp-1 group-hover:text-secondary transition-colors italic leading-tight uppercase tracking-tight">
                                                <Link to={item.slug ? `/san-pham/${item.slug}` : '/san-pham'}>{item.name}</Link>
                                            </h4>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted bg-cream px-2 py-0.5 rounded-lg border border-secondary/5">
                                                {item.variantLabel}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center bg-cream rounded-full border border-secondary/5 p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.variantLabel, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-primary hover:bg-secondary hover:text-primary rounded-full transition-colors active:scale-75"
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </button>
                                                <span className="px-4 font-black text-sm text-primary">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.variantLabel, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-primary hover:bg-secondary hover:text-primary rounded-full transition-colors active:scale-75"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                            <div className="font-serif font-black text-primary text-lg tracking-tight">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id, item.variantLabel)}
                                            className="absolute -top-1 -right-1 p-2 text-text-muted hover:text-secondary opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                            aria-label="Xóa sản phẩm"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-8 bg-cream/30 border-t border-secondary/5 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2 py-1">
                                <span className="text-text-secondary text-sm font-bold uppercase tracking-widest opacity-60">Tạm tính:</span>
                                <span className="text-2xl font-serif font-black text-primary tracking-tight">{formatPrice(totalPrice)}</span>
                            </div>
                            <p className="text-[10px] text-center font-bold text-text-muted uppercase tracking-widest leading-none bg-white/50 py-3 rounded-2xl border border-secondary/5">
                                Thuế và phí vận chuyển sẽ được tính tại trang thanh toán
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary w-full py-5 text-base flex items-center justify-center gap-4 bg-gradient-to-r from-primary to-primary-light shadow-[0_15px_40px_rgba(44,24,16,0.25)] group relative overflow-hidden"
                            >
                                <span className="relative z-10 font-black uppercase tracking-[0.2em]">Tiến hành đặt hàng</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" size={20} strokeWidth={3} />
                                <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>

                            <Link
                                to="/gio-hang"
                                onClick={closeCart}
                                className="w-full flex items-center justify-center py-4 text-xs font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors underline underline-offset-8 decoration-secondary/30"
                            >
                                Xem chi tiết giỏ hàng
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-10 pt-4 border-t border-secondary/5 text-secondary opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <ShieldCheck size={28} />
                            <Truck size={28} />
                            <Coffee size={28} />
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
