import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Heart,
    Share2,
    Star,
    ShieldCheck,
    Truck,
    History,
    Check,
    ChevronRight,
    Minus,
    Plus,
    Coffee,
    Info,
    Clock,
    ArrowLeft,
    ArrowRight,
    TrendingUp,
    Award,
    Loader2
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import ProductCard from '../../components/ProductCard/ProductCard';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addItem, toggleCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [activeImage, setActiveImage] = useState(null);

    // Fetch product from API
    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        productService.getProductBySlug(slug)
            .then((data) => {
                if (!cancelled) {
                    setProduct(data);
                    setSelectedVariant(data.variants?.[0] || null);
                    setActiveImage(data.image);
                    setLoading(false);
                    window.scrollTo(0, 0);

                    // Fetch related products
                    if (data.id) {
                        productService.getRelatedProducts(data.id, 4)
                            .then(related => {
                                if (!cancelled) setRelatedProducts(related);
                            })
                            .catch(() => { });
                    }
                }
            })
            .catch(() => {
                // Fallback to mock data
                if (!cancelled) {
                    const mockProduct = PRODUCTS.find(p => p.slug === slug);
                    if (mockProduct) {
                        setProduct(mockProduct);
                        setSelectedVariant(mockProduct.variants?.[0] || null);
                        setActiveImage(mockProduct.image);
                        const mockRelated = PRODUCTS.filter(p => p.category === mockProduct.category && p.id !== mockProduct.id).slice(0, 4);
                        setRelatedProducts(mockRelated);
                    }
                    setLoading(false);
                    window.scrollTo(0, 0);
                }
            });

        return () => { cancelled = true; };
    }, [slug]);

    if (loading) return (
        <div className="py-40 text-center animate-reveal">
            <Loader2 className="mx-auto animate-spin text-secondary mb-6" size={48} />
            <p className="text-text-muted font-bold text-sm uppercase tracking-widest">Đang tải sản phẩm...</p>
        </div>
    );

    if (!product) return (
        <div className="py-40 text-center animate-reveal">
            <h1 className="text-4xl font-serif font-black mb-6">Sản phẩm không tồn tại</h1>
            <Link to="/san-pham" className="btn btn-primary px-10">Về cửa hàng</Link>
        </div>
    );

    const handleAddToCart = () => {
        addItem(product, selectedVariant, quantity);
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
            icon: '🛍️',
            style: { background: '#2C1810', color: '#FDF8F0', borderRadius: '16px', fontWeight: 'bold' },
        });
        setTimeout(toggleCart, 800);
    };

    const handleBuyNow = () => {
        addItem(product, selectedVariant, quantity);
        navigate('/thanh-toan');
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    return (
        <main className="bg-cream min-h-screen pb-32">
            {/* Breadcrumb Area */}
            <section className="pt-32 pb-8">
                <div className="container px-4">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted mb-6 animate-reveal">
                        <Link to="/" className="hover:text-secondary transition-colors">Trang chủ</Link>
                        <ChevronRight size={10} strokeWidth={4} className="opacity-30" />
                        <Link to="/san-pham" className="hover:text-secondary transition-colors">Cửa hàng</Link>
                        <ChevronRight size={10} strokeWidth={4} className="opacity-30" />
                        <span className="text-primary truncate">{product.name}</span>
                    </div>
                </div>
            </section>

            {/* Main Product Section */}
            <section className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Images Gallery */}
                    <div className="lg:col-span-7 space-y-8 animate-reveal">
                        <div className="relative group perspective-1000">
                            <div className="relative aspect-square overflow-hidden rounded-[3.5rem] bg-white shadow-premium-lg border-4 border-white transform transition-transform duration-700 hover:rotate-1">
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-8 left-8 flex flex-col gap-3">
                                    {product.badge === 'bestseller' && (
                                        <span className="bg-primary text-cream px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                            <TrendingUp size={12} strokeWidth={3} /> Bán chạy nhất
                                        </span>
                                    )}
                                    <span className="bg-secondary text-primary px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                        <ShieldCheck size={12} strokeWidth={3} /> Kiểm định 4C
                                    </span>
                                </div>
                            </div>

                            {/* Floating decor */}
                            <div className="absolute -z-10 -bottom-12 -right-12 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
                            <div className="absolute -z-10 -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {[product.image, ...(product.gallery || product.images || [])].filter((v, i, a) => a.indexOf(v) === i).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-28 h-28 rounded-3xl overflow-hidden border-4 transition-all flex-shrink-0 ${activeImage === img ? 'border-secondary shadow-lg scale-105' : 'border-white hover:border-cream shadow-premium opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} alt={`${product.name} view ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 space-y-10 animate-reveal [animation-delay:200ms] flex flex-col h-full">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] inline-block border-b-2 border-secondary/20 pb-1">{product.categoryLabel || (typeof product.category === 'object' ? product.category?.name : product.category)}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-[#F59E0B] gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-[#F59E0B]" />)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted mt-0.5">(1.2k Đánh giá)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-black text-primary leading-tight italic">{product.name}</h1>
                            <p className="text-text-secondary text-sm leading-relaxed font-medium line-clamp-3">
                                {product.description || "Nông sản sạch Đắk Nông với tiêu chuẩn quốc tế, mang đậm phong vị cao nguyên nắng gió. Sản phẩm nguyên chất 100%, không phụ gia bảo quản."}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] shadow-premium border border-secondary/5 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="space-y-1 relative z-10">
                                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Giá bán hiện tại</div>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-serif font-black text-primary tracking-tight italic">{formatPrice(currentPrice)}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg font-bold text-text-muted line-through opacity-40">{formatPrice(product.originalPrice)}</span>
                                    )}
                                </div>
                            </div>
                            {product.originalPrice && (
                                <div className="ml-auto relative z-10">
                                    <span className="bg-primary text-secondary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl animate-float">
                                        Bản giới hạn
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Chọn quy cách đóng gói</h4>
                                    <span className="text-[10px] font-black text-secondary flex items-center gap-2"><Award size={14} /> Tiết kiệm 15%</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.label}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`group p-4 rounded-3xl border-2 transition-all flex flex-col gap-2 relative overflow-hidden ${selectedVariant?.label === v.label ? 'border-secondary bg-cream shadow-lg scale-105' : 'border-white bg-white hover:border-cream shadow-premium'}`}
                                        >
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedVariant?.label === v.label ? 'text-primary' : 'text-text-muted'}`}>{v.label}</span>
                                            <span className="font-serif font-black text-primary italic leading-none">{formatPrice(v.price)}</span>
                                            {selectedVariant?.label === v.label && <div className="absolute -bottom-1 -right-1 bg-secondary p-1 rounded-tl-xl text-primary"><Check size={12} strokeWidth={4} /></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-6 pt-6 mt-auto">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-white rounded-full p-2 shadow-premium border border-secondary/5">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-primary border border-cream hover:bg-secondary transition-all active:scale-75"
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="w-14 text-center font-black text-lg text-primary">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-primary border border-cream hover:bg-secondary transition-all active:scale-75"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-outline flex-1 py-4 uppercase text-xs tracking-widest font-black flex items-center justify-center gap-3 border-secondary/30 group/cart"
                                >
                                    <ShoppingBag size={18} className="group-hover/cart:rotate-12 transition-transform" />
                                    Thêm vào giỏ
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="btn btn-primary w-full py-5 text-base flex items-center justify-center gap-4 bg-gradient-to-r from-primary to-primary-light shadow-[0_20px_50px_rgba(44,24,16,0.3)] group relative overflow-hidden active:scale-95"
                            >
                                <span className="relative z-10 font-bold uppercase tracking-[0.2em] italic">Đặt hỏa tốc ngay</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" size={20} strokeWidth={3} />
                                <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                        </div>

                        {/* Trust highlights */}
                        <div className="grid grid-cols-2 gap-10 pt-10 border-t border-secondary/5">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors flex-shrink-0 animate-float">
                                    <Truck size={20} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Giao hỏa tốc</div>
                                    <div className="text-[9px] font-bold text-text-muted uppercase leading-none">Miễn phí đ/v đơn 500k+</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors flex-shrink-0 animate-float [animation-delay:1s]">
                                    <ShieldCheck size={20} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Cam kết sạch</div>
                                    <div className="text-[9px] font-bold text-text-muted uppercase leading-none">Hoàn 200% nếu phát hiện giả</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs / Detailed Content */}
            <section className="mt-32 border-t border-secondary/5 pt-20">
                <div className="container px-4">
                    <div className="flex flex-wrap gap-8 md:gap-12 border-b-2 border-cream pb-6 items-center justify-center md:justify-start">
                        {[
                            { id: 'description', label: 'Mô tả chi tiết', icon: Info },
                            { id: 'specifications', label: 'Thông số kỹ thuật', icon: Coffee },
                            { id: 'reviews', label: 'Đánh giá (120)', icon: Star }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 pb-6 -mb-6.5 transition-all text-xs font-black uppercase tracking-widest group ${activeTab === tab.id ? 'text-primary border-b-4 border-secondary translate-y-px animate-in fade-in' : 'text-text-muted hover:text-primary'}`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-secondary' : 'opacity-40'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-20 animate-in fade-in slide-in-from-top-4 duration-500">
                        {activeTab === 'description' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                                <div className="space-y-10 order-2 lg:order-1">
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-serif font-black text-primary leading-tight lowercase first-letter:uppercase italic">Tinh hoa được kết tinh từ đôi bàn tay nghệ nhân cao nguyên</h3>
                                        <p className="text-lg text-text-secondary leading-relaxed font-medium">
                                            Mỗi sản phẩm đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt (4C Standard). Hạt cà phê được thu hái thủ công khi chín mọng nhất, sơ chế ướt hoặc sơ chế khô theo phương pháp thủ công, giữ trọn vẹn hương vị đặc thừng của vùng đất Cầu Đất, Đà Lạt cao 1.500m.
                                        </p>
                                    </div>
                                    <ul className="grid gap-6">
                                        <li className="flex gap-4 group">
                                            <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-secondary border border-secondary/10 group-hover:bg-secondary group-hover:text-primary transition-all flex-shrink-0 font-black">01</div>
                                            <div className="space-y-1">
                                                <div className="text-sm font-black text-primary uppercase">Nguyên liệu organic</div>
                                                <p className="text-xs text-text-muted font-medium">Hạt cà phê 100% chín mọng, không tạp chất, không tẩm ướp.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4 group">
                                            <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-secondary border border-secondary/10 group-hover:bg-secondary group-hover:text-primary transition-all flex-shrink-0 font-black">02</div>
                                            <div className="space-y-1">
                                                <div className="text-sm font-black text-primary uppercase">Rang củi truyền thống</div>
                                                <p className="text-xs text-text-muted font-medium">Rang bằng máy công nghệ Đức kết hợp bí quyết ủ củi nồng nàn.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="relative rounded-[3rem] overflow-hidden shadow-premium-lg border-8 border-white group">
                                        <img src="https://images.unsplash.com/photo-1497933321027-94622fb2a442?q=80&w=1200" alt="process" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-50" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-premium overflow-hidden border border-secondary/5">
                                <table className="w-full text-sm font-medium">
                                    <tbody>
                                        {[
                                            ['Vùng trồng', 'Cầu Đất, Đà Lạt & Buôn Ma Thuột'],
                                            ['Độ cao', '1.500m - 1.650m'],
                                            ['Giống hạt', 'Moka, Typica, Catimor (Arabica) & Robusta Honey'],
                                            ['Phương pháp sơ chế', 'Honey Process / Full Washed'],
                                            ['Độ rang', 'Light/Medium-Deep (Tùy phiên bản)'],
                                            ['Hương vị chủ đạo', 'Socola, caramel, cam chanh, hậu ngọt sâu'],
                                            ['Hạn sử dụng', '12 tháng kể từ ngày sản xuất'],
                                        ].map(([label, value], i) => (
                                            <tr key={i} className={`border-b border-cream last:border-0 hover:bg-cream/50 transition-colors`}>
                                                <td className="p-8 text-primary font-black uppercase tracking-widest text-[10px] bg-cream/30 w-1/3 italic">{label}</td>
                                                <td className="p-8 text-text-secondary">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-20 bg-white rounded-[4rem] shadow-premium border border-secondary/5">
                                <History size={64} className="mx-auto text-secondary/30 mb-8 animate-float" />
                                <h4 className="text-2xl font-serif font-black text-primary italic leading-none mb-4">Mô đun đánh giá chưa kích hoạt</h4>
                                <p className="text-text-secondary text-sm font-medium max-w-sm mx-auto">Chúng tôi sắp tích hợp hệ thống đánh giá bằng video trực tiếp từ khách hàng. Hãy quay lại sớm nhé!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Recommended Section History */}
            {relatedProducts.length > 0 && (
                <section className="mt-40 bg-primary relative overflow-hidden py-32 rounded-[5rem] mx-4 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                    <div className="container relative z-10 px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20 text-center md:text-left">
                            <div className="space-y-2">
                                <span className="text-secondary font-black text-xs uppercase tracking-[0.3em]">Cùng danh mục</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-black text-cream">Sản Phẩm <span className="text-secondary italic font-medium uppercase italic">Liên Quan</span></h2>
                            </div>
                            <Link to="/san-pham" className="btn bg-white/5 text-cream border border-white/10 hover:bg-white/10 px-10">Xem tất cả</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p, idx) => (
                                <div key={p.id} className="animate-reveal" style={{ animationDelay: `${idx * 150}ms` }}>
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
