import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Coffee,
    Leaf,
    ShieldCheck,
    Truck,
    Star,
    Clock,
    ChevronRight,
    TrendingUp,
    Heart,
    Play
} from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES, BLOG_POSTS, TESTIMONIALS } from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import { formatDate } from '../../utils/helpers';
import productService from '../../services/productService';
import { useSEO } from '../../hooks/useSEO';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState(PRODUCTS.slice(0, 4));
    const recentPosts = BLOG_POSTS.slice(0, 3);

    // SEO
    useSEO({
        title: null, // Use default title for homepage
        description: 'Nông Sản Phú Yên - Chuyên cà phê rang xay Arabica, Robusta nguyên chất. Mứt gừng đặc sản, hồ tiêu Phú Quốc. 100% tự nhiên. Giao toàn quốc.',
        path: '/',
    });

    // Fetch featured products from API
    useEffect(() => {
        productService.getFeaturedProducts()
            .then((data) => {
                if (data && data.length > 0) setFeaturedProducts(data);
            })
            .catch(() => {
                // Keep mock data as fallback
            });
    }, []);

    return (
        <main className="bg-cream selection:bg-secondary selection:text-primary">
            {/* ======= HERO SECTION: High Production Value ======= */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-primary pt-24 pb-12">
                {/* Background elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(212,163,115,0.1),transparent_50%)]" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent shadow-[0_0_20px_white/10]" />
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
                </div>

                <div className="container relative z-10 px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <div className="flex-1 space-y-8 animate-reveal">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-secondary font-black text-[10px] uppercase tracking-widest shadow-2xl backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                            Chuyên Gia Nông Sản Cao Nguyên
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.9] font-serif font-black">
                            Đánh Thức <br />
                            <span className="text-secondary italic">Bản Sắc</span> <br />
                            Cà Phê Việt
                        </h1>

                        <p className="max-w-xl text-lg text-cream/60 font-medium leading-relaxed">
                            Trải nghiệm hương vị nguyên bản từ những hạt cà phê Arabica Cầu Đất tinh tuyển và đặc sản Phú Yên 100% tự nhiên.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/san-pham" className="btn btn-secondary px-10 text-base shadow-[0_10px_40px_rgba(212,163,115,0.3)]">
                                Khám Phá Ngay
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/ve-chung-toi" className="btn bg-white/5 text-cream border border-white/10 hover:bg-white/10 px-10">
                                Câu Chuyện
                            </Link>
                        </div>

                        <div className="flex items-center gap-8 pt-10 border-t border-white/5">
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif text-secondary font-black tracking-tight">2.5k+</span>
                                <span className="text-[10px] uppercase font-bold text-cream/40 tracking-widest">Khách hàng tin dùng</span>
                            </div>
                            <div className="w-px h-10 bg-white/5" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif text-secondary font-black tracking-tight">100%</span>
                                <span className="text-[10px] uppercase font-bold text-cream/40 tracking-widest">Sản phẩm tự nhiên</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="flex-1 relative animate-reveal [animation-delay:200ms]">
                        <div className="relative group perspective-1000">
                            <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-700 aspect-[4/5] max-w-[480px] mx-auto bg-primary-light">
                                <img
                                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=75&w=600"
                                    alt="Cà phê rang xay nguyên chất Phú Yên - Premium Coffee"
                                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                                    width={600}
                                    height={750}
                                    fetchpriority="high"
                                    decoding="sync"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Suspended Badges */}
                            <div
                                className="absolute -top-8 -left-8 bg-white p-6 rounded-3xl shadow-premium-lg border border-secondary/10 flex items-center gap-4 animate-float z-20"
                            >
                                <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-secondary">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-text-muted uppercase tracking-widest mb-0.5">Xu hướng</div>
                                    <div className="text-lg font-serif font-black text-primary">Cà Phê Moka</div>
                                </div>
                            </div>

                            <div
                                className="absolute bottom-12 -right-8 bg-primary-light p-5 rounded-3xl shadow-2xl border border-white/5 flex flex-col gap-2 z-20 glass-dark"
                            >
                                <div className="flex items-center gap-3">
                                    <Star className="text-secondary fill-secondary" size={16} />
                                    <span className="text-cream font-bold text-sm leading-none">4.9/5 Đánh giá</span>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-secondary/50 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-[10px] font-black">+2k</div>
                                </div>
                            </div>

                            {/* Geometric accents */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full rotate-45" />
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/5 rounded-full -rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cream">Sản phẩm</span>
                    <div className="w-px h-12 bg-gradient-to-b from-secondary to-transparent" />
                </div>
            </section>

            {/* ======= CATEGORIES SECTION ======= */}
            <section className="py-32 bg-cream">
                <div className="container px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-reveal">
                        <div className="space-y-4">
                            <span className="text-secondary font-black text-xs uppercase tracking-widest">Danh Mục Sản Phẩm</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-black">Khám Phá <br /> <span className="text-secondary/50 italic font-medium">Phong Vị</span> Việt</h2>
                        </div>
                        <p className="max-w-md text-text-secondary font-medium leading-relaxed">
                            Tuyển tập những tinh hoa nông sản chất lượng cao nhất từ vùng nắng gió Phú Yên và cao nguyên Lâm Đồng.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {PRODUCT_CATEGORIES.filter(c => c.id !== 'all').map((cat, idx) => (
                            <Link
                                key={cat.id}
                                to={`/san-pham?category=${cat.id}`}
                                className="group relative h-[420px] rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-700 animate-reveal"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <img
                                    src={cat.image || `https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=60&w=400`}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                    loading="lazy"
                                    decoding="async"
                                    width={400}
                                    height={420}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent p-10 flex flex-col justify-end">
                                    <div className="w-14 h-14 bg-secondary/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-2xl text-cream mb-2 font-serif font-black">{cat.name}</h3>
                                    <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                        Xem thêm <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======= FEATURED PRODUCTS: Refined Section ======= */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-cream/50 -skew-x-12 translate-x-1/2 -z-0" />

                <div className="container relative z-10 px-4">
                    <div className="text-center mb-20 space-y-6">
                        <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest inline-block leading-none">Sản Phẩm Tinh Hoa</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-black text-primary">Lựa Chọn <span className="text-secondary italic font-medium">Bán Chạy</span></h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
                        {featuredProducts.map((product, idx) => (
                            <div key={product.id} className="animate-reveal" style={{ animationDelay: `${idx * 100}ms` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link to="/san-pham" className="btn btn-outline px-12 py-4">
                            Xem tất cả sản phẩm
                        </Link>
                    </div>
                </div>
            </section>

            {/* ======= TRUST & FEATURES ======= */}
            <section className="py-24 bg-primary overflow-hidden relative">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center flex-shrink-0 animate-float shadow-[0_10px_30px_rgba(212,163,115,0.2)]">
                                <Coffee className="text-primary" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl text-cream font-serif font-black">Nông Sản Sạch</h4>
                                <p className="text-sm text-cream/40 leading-relaxed font-medium">Quy trình sản xuất khép kín, không hóa chất độc hại, bảo vệ sức khỏe.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-secondary/10 border border-secondary/10 hover:bg-secondary/20 transition-colors">
                            <div className="w-20 h-20 bg-cream rounded-[2rem] flex items-center justify-center flex-shrink-0 animate-float [animation-delay:1s] shadow-2xl">
                                <Truck className="text-primary" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl text-cream font-serif font-black">Giao Hàng Nhanh</h4>
                                <p className="text-sm text-cream/40 leading-relaxed font-medium">Hỏa tốc nội thành và giao hàng toàn quốc chỉ từ 2-4 ngày làm việc.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center flex-shrink-0 animate-float [animation-delay:2s] shadow-[0_10px_30px_rgba(212,163,115,0.2)]">
                                <ShieldCheck className="text-primary" size={40} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl text-cream font-serif font-black">Bảo Đảm 100%</h4>
                                <p className="text-sm text-cream/40 leading-relaxed font-medium">Cam kết đổi trả trong vòng 7 ngày nếu khách hàng không hài lòng chất lượng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======= STORY BANNER: Modern Minimalist ======= */}
            <section className="py-40 bg-cream relative overflow-hidden">
                <div className="container px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="flex-1 relative order-2 lg:order-1 max-w-[560px]">
                            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-premium-lg border-8 border-white aspect-square group">
                                <img
                                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=60&w=600"
                                    alt="Câu chuyện Nông Sản Phú Yên - Từ vườn đến ly cà phê"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                    decoding="async"
                                    width={600}
                                    height={600}
                                />
                                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/30 backdrop-blur-xl border border-white/50 rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-white transition-all group/play">
                                    <Play className="fill-white group-hover/play:fill-primary text-white group-hover/play:text-primary transition-colors ml-1" size={32} />
                                </button>
                            </div>
                            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary rounded-full -z-10 blur-[80px] opacity-30" />
                            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary rounded-full -z-10 blur-[80px] opacity-10" />
                        </div>

                        <div className="flex-1 space-y-10 order-1 lg:order-2">
                            <div className="space-y-6">
                                <span className="text-secondary font-black text-xs uppercase tracking-[0.3em]">Hành Trình Của Chúng Tôi</span>
                                <h2 className="text-5xl md:text-6xl font-serif font-black text-primary leading-[1.1]">Từ Vườn Nhỏ Đến <br /> <span className="text-secondary italic font-medium">Tách Cà Phê</span> Tinh Túy</h2>
                                <p className="text-lg text-text-secondary leading-relaxed font-medium">
                                    Nông Sản Phú Yên khởi nguồn từ đam mê mãnh liệt với nông sản miền Trung. Chúng tôi trực tiếp hợp tác cùng bà con nông dân, kiểm soát từ khâu chăm bón đến chế biến thành phẩm.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-white rounded-3xl shadow-premium border border-secondary/5 space-y-3">
                                    <div className="text-4xl font-serif font-black text-primary">15+</div>
                                    <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Năm Kinh Nghiệm</div>
                                </div>
                                <div className="p-8 bg-white rounded-3xl shadow-premium border border-secondary/5 space-y-3">
                                    <div className="text-4xl font-serif font-black text-primary">50+</div>
                                    <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Đại Lý Hợp Tác</div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link to="/ve-chung-toi" className="inline-flex items-center gap-4 text-primary font-black uppercase text-sm tracking-widest group">
                                    Xem toàn bộ hành trình
                                    <div className="w-12 h-12 bg-cream group-hover:bg-secondary rounded-full flex items-center justify-center transition-colors">
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======= BLOGS: Grid Layout ======= */}
            <section className="py-32 bg-white">
                <div className="container px-4">
                    <div className="text-center mb-24 space-y-6">
                        <span className="text-secondary font-black text-xs uppercase tracking-widest leading-none">Cẩm Nang Sống Sạch</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-black text-primary">Góc Chia Sẻ <span className="text-secondary/30 italic font-medium">&</span> Kinh Nghiệm</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {recentPosts.map((post, idx) => (
                            <article
                                key={post.id}
                                className="group flex flex-col animate-reveal shadow-premium rounded-[2.5rem] bg-cream overflow-hidden"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <Link to={`/blog/${post.slug}`} className="relative h-72 overflow-hidden flex-shrink-0">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 drop-shadow-lg">
                                        <span className="bg-secondary text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>
                                <div className="p-10 flex flex-col flex-1 space-y-6">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        <span className="flex items-center gap-2"><Clock size={12} className="text-secondary" /> {post.readTime}</span>
                                        <span className="w-1 h-1 bg-secondary rounded-full" />
                                        <span>{formatDate(post.date)}</span>
                                    </div>
                                    <h3 className="text-2xl font-serif font-black text-primary line-clamp-2 leading-tight group-hover:text-secondary transition-colors italic">
                                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 font-medium flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4 border-t border-secondary/10">
                                        <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group/link">
                                            Đọc chi tiết <ArrowRight className="group-hover/link:translate-x-2 transition-transform" size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======= NEWSLETTER: Ultra-Clean ======= */}
            <section className="py-24 px-4">
                <div className="container bg-primary rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h2 className="text-4xl md:text-6xl text-cream font-serif font-black leading-tight">Gia Nhập Cộng Đồng <br /> <span className="text-secondary italic">Nông Sản Sạch</span></h2>
                            <p className="text-cream/50 text-lg font-medium max-w-sm">Đăng ký nhận ưu đãi độc quyền 15% cho đơn hàng đầu tiên và cẩm nang sống xanh.</p>
                        </div>
                        <div className="flex-1 w-full max-w-md">
                            <form className="relative group">
                                <input
                                    type="email"
                                    placeholder="Email của bạn..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-6 px-10 text-cream focus:bg-white/10 focus:border-secondary transition-all outline-none pr-40 placeholder:text-cream/20 font-bold"
                                />
                                <button className="absolute right-2 top-2 bottom-2 bg-secondary text-primary px-8 rounded-full font-black text-sm uppercase tracking-widest hover:bg-cream hover:scale-105 transition-all shadow-xl">
                                    Đăng ký
                                </button>
                            </form>
                            <p className="mt-4 text-[10px] text-center md:text-left text-cream/20 tracking-widest uppercase font-bold">Cam kết không spam. Hủy đăng ký bất cứ lúc nào.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
