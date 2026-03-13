import { useCart } from '../../context/CartContext';
import {
    ShoppingBag,
    Trash2,
    Minus,
    Plus,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Truck,
    ChevronRight,
    Coffee,
    Heart,
    TrendingUp
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
    const navigate = useNavigate();

    const freeShippingThreshold = 500000;
    const shippingFee = totalPrice >= freeShippingThreshold ? 0 : 30000;
    const grandTotal = totalPrice + shippingFee;

    if (items.length === 0) {
        return (
            <main className="bg-cream min-h-screen pt-40 pb-32 animate-reveal">
                <div className="container px-4 text-center space-y-12">
                    <div className="relative w-48 h-48 mx-auto bg-white rounded-[4rem] shadow-premium flex items-center justify-center text-secondary border border-secondary/5 group overflow-hidden animate-float">
                        <ShoppingBag size={80} className="opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 flex items-center justify-center text-[5rem]">🛍️</div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full blur-2xl" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-serif font-black text-primary leading-none italic uppercase">Giỏ hàng đang trống</h1>
                        <p className="text-text-secondary text-lg font-medium max-w-sm mx-auto">Có vẻ như bạn chưa chọn được phong vị nào ưng ý. Hãy cùng khám phá thế giới nông sản tinh hoa nhé!</p>
                    </div>
                    <Link to="/san-pham" className="btn btn-primary px-12 py-5 shadow-2xl group">
                        Khám Phá Cửa Hàng
                        <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-cream min-h-screen pt-40 pb-32">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-reveal">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">
                            <Link to="/" className="hover:text-secondary opacity-50 transition-colors">Trang chủ</Link>
                            <ChevronRight size={10} strokeWidth={4} className="opacity-30" />
                            <span className="text-primary truncate">Chi tiết giỏ hàng</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-primary leading-none uppercase italic tracking-tighter">
                            Giỏ Hàng <span className="text-secondary italic font-light lowercase font-serif">({totalItems})</span>
                        </h1>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-secondary transition-colors underline underline-offset-4 decoration-secondary/30"
                    >
                        Xóa toàn bộ giỏ hàng
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
                    {/* Items List */}
                    <div className="xl:col-span-8 space-y-10 animate-reveal">
                        <div className="bg-white rounded-[3.5rem] shadow-premium-lg border border-secondary/5 overflow-hidden">
                            <div className="hidden lg:grid grid-cols-12 gap-8 p-10 bg-cream/30 text-xs font-black uppercase tracking-widest text-text-muted border-b border-cream">
                                <div className="col-span-6">Sản phẩm nông sản</div>
                                <div className="col-span-2 text-center">Đơn giá</div>
                                <div className="col-span-2 text-center">Số lượng</div>
                                <div className="col-span-2 text-right">Tổng cộng</div>
                            </div>

                            <div className="divide-y divide-cream">
                                {items.map((item) => (
                                    <div
                                        key={`${item.id}-${item.variantLabel}`}
                                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-10 items-center group relative animate-in fade-in transition-colors hover:bg-cream/20"
                                    >
                                        <div className="col-span-1 lg:col-span-6 flex items-center gap-6">
                                            <Link to={`/san-pham/${item.slug}`} className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] overflow-hidden bg-cream flex-shrink-0 shadow-premium group-hover:shadow-premium-lg group-hover:scale-105 transition-all">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            </Link>
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block leading-none">{item.categoryLabel}</span>
                                                <h3 className="text-xl lg:text-2xl font-serif font-black text-primary hover:text-secondary transition-colors leading-tight italic uppercase tracking-tight">
                                                    <Link to={`/san-pham/${item.slug}`}>{item.name}</Link>
                                                </h3>
                                                <span className="inline-block bg-cream text-text-muted px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/5">
                                                    {item.variantLabel}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-center lg:block hidden font-serif font-black text-primary text-lg">
                                            {formatPrice(item.price)}
                                        </div>

                                        <div className="col-span-2 flex items-center justify-center">
                                            <div className="flex items-center bg-white rounded-full p-2 shadow-premium border border-secondary/5">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.variantLabel, item.quantity - 1)}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-primary border border-cream hover:bg-secondary active:scale-75 transition-all"
                                                >
                                                    <Minus size={14} strokeWidth={3} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-sm text-primary">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.variantLabel, item.quantity + 1)}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-primary border border-cream hover:bg-secondary active:scale-75 transition-all"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-right flex flex-col items-end gap-1">
                                            <div className="font-serif font-black text-primary text-2xl tracking-tighter italic">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id, item.variantLabel)}
                                                className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-secondary flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                                            >
                                                <Trash2 size={12} strokeWidth={3} /> Gỡ bỏ
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-10 bg-cream/30 border-t border-cream flex items-center justify-between">
                                <Link to="/san-pham" className="btn btn-outline py-3 px-8 text-xs font-black uppercase tracking-widest border-secondary/30 group">
                                    <ArrowLeft size={16} className="mr-3 group-hover:-translate-x-2 transition-transform" strokeWidth={3} />
                                    Thêm sản phẩm khác
                                </Link>
                                <div className="flex gap-4 items-center opacity-30 grayscale saturate-0">
                                    <ShieldCheck size={28} />
                                    <Truck size={28} />
                                    <Coffee size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Panel */}
                    <div className="xl:col-span-4 sticky top-32 space-y-12 shrink-0 animate-reveal [animation-delay:200ms]">
                        <div className="bg-primary rounded-[3.5rem] p-12 text-cream shadow-[0_30px_80px_rgba(44,24,16,0.3)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 space-y-12">
                                <h2 className="text-3xl font-serif font-black italic tracking-tight leading-none uppercase">Tổng Thanh Toán</h2>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-center px-2 font-bold text-sm">
                                        <span className="opacity-40 uppercase tracking-widest leading-none">Tạm tính (Net)</span>
                                        <span className="text-xl font-serif font-black tracking-tight">{formatPrice(totalPrice)}</span>
                                    </div>

                                    <div className="flex justify-between items-center px-2 font-bold text-sm">
                                        <span className="opacity-40 uppercase tracking-widest leading-none">Phí vận chuyển</span>
                                        <span className={`text-sm ${shippingFee === 0 ? 'text-secondary font-black animate-reveal' : 'font-serif font-black'}`}>
                                            {shippingFee === 0 ? 'MIỄN PHÍ' : formatPrice(shippingFee)}
                                        </span>
                                    </div>

                                    {shippingFee > 0 && (
                                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-3">
                                            <div className="flex justify-between font-black text-[10px] uppercase tracking-widest">
                                                <span className="text-secondary">Sắp được Freeship</span>
                                                <span className="text-cream">{Math.round((totalPrice / freeShippingThreshold) * 100)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-secondary transition-all duration-1000 ease-out"
                                                    style={{ width: `${(totalPrice / freeShippingThreshold) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-cream/30 uppercase tracking-widest text-center leading-relaxed">Mua thêm {formatPrice(freeShippingThreshold - totalPrice)} để miễn phí vận chuyển trên toàn quốc.</p>
                                        </div>
                                    )}

                                    <div className="w-full h-px bg-white/5" />

                                    <div className="flex justify-between items-end px-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Tổng cộng</span>
                                        <div className="text-5xl font-serif font-black italic tracking-tighter flex flex-col items-end">
                                            {formatPrice(grandTotal)}
                                            <span className="text-[9px] font-bold text-cream/20 mt-1 uppercase tracking-widest">Đã bao gồm VAT</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/thanh-toan')}
                                    className="btn btn-secondary w-full py-6 text-base flex items-center justify-center gap-4 shadow-xl hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
                                >
                                    <span className="relative z-10 font-black uppercase tracking-[0.2em]">Tiến hành thanh toán</span>
                                    <ArrowRight className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" size={24} strokeWidth={3} />
                                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                                </button>

                                <div className="flex flex-col items-center gap-6 pt-4 text-center">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cream/20 italic">Đảm bảo thanh toán an toàn 100% qua cổng VNPay/MoMo/Chuyển khoản</p>
                                </div>
                            </div>
                        </div>

                        {/* Related/Cross-sell History */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic border-b-2 border-primary/5 pb-2">Ưu đãi hôm nay</h4>
                            <div className="bg-white rounded-3xl p-6 shadow-premium border border-secondary/5 flex items-center gap-4 group cursor-pointer hover:bg-cream transition-colors">
                                <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">🔥</div>
                                <div className="flex-1">
                                    <div className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Combo quà tặng</div>
                                    <div className="text-sm font-serif font-black text-primary leading-tight">Nông Sản Sạch cho ngày Tết Sum Vầy</div>
                                </div>
                                <ChevronRight size={18} className="text-secondary opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* You May Also Like Section */}
                <section className="mt-40 pt-24 border-t-2 border-cream">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 px-4">
                        <div className="space-y-4">
                            <span className="text-secondary font-black text-xs uppercase tracking-widest leading-none">Nông sản gợi ý</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-primary uppercase italic">Có Thể Bạn <span className="text-secondary italic font-light lowercase">Quan Tâm</span></h2>
                        </div>
                        <Link to="/san-pham" className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors border-b border-primary/10 pb-1">Xem tất cả</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {PRODUCTS.slice(3, 7).map((p, idx) => (
                            <div key={p.id} className="animate-reveal" style={{ animationDelay: `${idx * 150}ms` }}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
