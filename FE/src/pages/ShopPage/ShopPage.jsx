import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Filter,
    Search,
    Grid2X2,
    LayoutList,
    ChevronDown,
    Coffee,
    History,
    X,
    SlidersHorizontal,
    ChevronRight,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import productService from '../../services/productService';
import { useSEO } from '../../hooks/useSEO';

const SORT_OPTIONS = [
    { id: 'default', name: 'Mặc định' },
    { id: 'price-asc', name: 'Giá thấp đến cao' },
    { id: 'price-desc', name: 'Giá cao đến thấp' },
    { id: 'newest', name: 'Mới nhất' },
    { id: 'popular', name: 'Phổ biến nhất' },
];

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // API state
    const [apiProducts, setApiProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const activeCategory = searchParams.get('category') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'default';
    const currentPage = parseInt(searchParams.get('page') || '0');

    const categoryName = PRODUCT_CATEGORIES.find(c => c.id === activeCategory)?.name || 'Tất Cả';
    useSEO({
        title: `${categoryName} Sản Phẩm`,
        description: `Mua ${categoryName.toLowerCase()} chất lượng cao tại Nông Sản Phú Yên. Cà phê rang xay, mứt gừng, hồ tiêu - 100% tự nhiên, giao hàng toàn quốc.`,
        path: '/san-pham',
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch products from API
    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        productService.getProducts({
            category: activeCategory,
            search: searchQuery,
            sort: sortBy,
            page: currentPage,
            size: 12,
        })
            .then((result) => {
                if (!cancelled) {
                    setApiProducts(result.content);
                    setTotalPages(result.totalPages);
                    setLoading(false);
                }
            })
            .catch(() => {
                // Fallback to local data if API fails
                if (!cancelled) {
                    setApiProducts(null);
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [activeCategory, searchQuery, sortBy, currentPage]);

    // If API data available, use it. Otherwise fallback to local mock data with client-side filtering
    const filteredProducts = useMemo(() => {
        if (apiProducts !== null) return apiProducts;

        let result = [...PRODUCTS];
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            );
        }
        switch (sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'newest': result.sort((a, b) => b.id - a.id); break;
            case 'popular': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
            default: break;
        }
        return result;
    }, [apiProducts, activeCategory, searchQuery, sortBy]);

    const updateParams = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'all' || !value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <main className="bg-cream min-h-screen pb-32">
            {/* ======= SHOP HERO ======= */}
            <section className="relative pt-40 pb-20 bg-primary text-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(212,163,115,0.1),transparent_50%)] op-50" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

                <div className="container px-4 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto animate-reveal">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-secondary mb-2">
                            <Link to="/" className="hover:text-cream transition-colors opacity-50">Trang chủ</Link>
                            <ChevronRight size={10} strokeWidth={4} className="opacity-30" />
                            <span className="text-cream">Cửa hàng</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight leading-none italic uppercase">
                            Cửa Hàng <span className="text-secondary italic font-light lowercase">Nông Sản</span>
                        </h1>
                        <p className="text-cream/50 text-lg font-medium leading-relaxed max-w-2xl px-4">
                            Tuyển tập trọn vẹn tinh hoa nông sản từ vùng cao nguyên Phú Yên, phục vụ trực tiếp từ nông trại đến tách cà phê của bạn.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-cream/40">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                    {filteredProducts.length} Sản phẩm chất lượng
                </div>
            </section>

            {/* ======= SHOP CONTENT ======= */}
            <div className="container px-4 mt-16 flex flex-col lg:flex-row gap-12 relative items-start">

                {/* Sidebar: Desktop */}
                <aside className="hidden lg:block w-[300px] sticky top-32 space-y-12 shrink-0 animate-reveal">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between group cursor-pointer border-b border-secondary/10 pb-4">
                            <h2 className="text-xl font-serif font-black text-primary italic uppercase tracking-tight">Danh Mục</h2>
                            <Filter size={18} className="text-secondary group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
                        </div>
                        <nav className="space-y-3">
                            {PRODUCT_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateParams('category', cat.id)}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all group ${activeCategory === cat.id
                                        ? 'bg-primary text-cream shadow-xl'
                                        : 'bg-white text-text-muted hover:bg-cream hover:text-secondary shadow-premium'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                                        <span>{cat.name}</span>
                                    </div>
                                    <span className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center border-2 transition-colors ${activeCategory === cat.id ? 'bg-secondary text-primary border-primary' : 'bg-cream text-text-muted border-white'
                                        }`}>
                                        {cat.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.id).length}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-8 bg-primary rounded-[2.5rem] text-cream space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <History className="text-secondary group-hover:rotate-12 transition-transform" size={40} />
                        <div>
                            <h4 className="text-xl font-serif font-black leading-tight italic mb-3">Ưu Đãi Đặc Biệt</h4>
                            <p className="text-xs text-cream/40 font-medium leading-relaxed">Đơn hàng từ 500k được tặng kèm 1 phin cà phê cao cấp.</p>
                        </div>
                        <button className="btn btn-secondary w-full py-3 text-sm">Xem chi tiết</button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-10 w-full animate-reveal [animation-delay:200ms]">

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between p-6 bg-white rounded-3xl shadow-premium border border-secondary/5 sticky lg:relative top-24 lg:top-0 z-40">
                        <div className="flex items-center gap-3">
                            <div className="relative group flex-1 md:w-64">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="w-full bg-cream rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => updateParams('search', e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" size={18} />
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-3.5 bg-cream text-primary rounded-2xl hover:bg-secondary/20 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest shrink-0"
                            >
                                <SlidersHorizontal size={18} />
                                Lọc
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center bg-cream p-1.5 rounded-2xl border border-secondary/5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-cream shadow-lg' : 'text-text-muted hover:text-primary'}`}
                                >
                                    <Grid2X2 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-cream shadow-lg' : 'text-text-muted hover:text-primary'}`}
                                >
                                    <LayoutList size={20} />
                                </button>
                            </div>

                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => updateParams('sort', e.target.value)}
                                    className="appearance-none bg-cream border border-secondary/5 px-6 pr-12 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 cursor-pointer min-width-[200px]"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none group-hover:rotate-180 transition-transform" size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(activeCategory !== 'all' || searchQuery || sortBy !== 'default') && (
                        <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted py-2">Đang lọc theo:</span>
                            {activeCategory !== 'all' && (
                                <span className="bg-primary text-cream px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group cursor-pointer" onClick={() => updateParams('category', 'all')}>
                                    {activeCategory} <X size={12} className="group-hover:rotate-90 transition-transform text-secondary" />
                                </span>
                            )}
                            {searchQuery && (
                                <span className="bg-primary text-cream px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group cursor-pointer" onClick={() => updateParams('search', '')}>
                                    "{searchQuery}" <X size={12} className="group-hover:rotate-90 transition-transform text-secondary" />
                                </span>
                            )}
                            <button onClick={clearFilters} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors underline underline-offset-4 decoration-secondary/30">Xóa tất cả bộ lọc</button>
                        </div>
                    )}

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 animate-reveal">
                            <div className="w-32 h-32 bg-cream rounded-[3.5rem] flex items-center justify-center text-secondary relative group overflow-hidden">
                                <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[4rem] group-hover:scale-110 transition-transform duration-500">☕</div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-serif font-black text-primary italic leading-none">Úi, không tìm thấy sản phẩm</h3>
                                <p className="text-text-secondary text-sm font-medium">Bạn hãy thử thay đổi tiêu chí tìm kiếm hoặc xem các danh mục khác nhé.</p>
                            </div>
                            <button onClick={clearFilters} className="btn btn-primary px-10">Tất cả sản phẩm</button>
                        </div>
                    ) : (
                        <div className={`grid gap-8 xl:gap-10 transition-all duration-500 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'}`}>
                            {filteredProducts.map((p, idx) => (
                                <div key={p.id} className="animate-reveal" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination placeholder */}
                    {filteredProducts.length > 0 && (
                        <div className="py-20 flex justify-center gap-3">
                            {[1, 2, 3].map(n => (
                                <button key={n} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-widest transition-all ${n === 1 ? 'bg-primary text-cream shadow-xl' : 'bg-white text-text-muted hover:bg-cream border border-secondary/5'}`}>
                                    {n}
                                </button>
                            ))}
                            <button className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white text-text-muted hover:bg-cream border border-secondary/5 transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Modal */}
            <div
                className={`fixed inset-0 bg-primary/80 backdrop-blur-md z-[100] transition-all duration-500 lg:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            <div
                className={`fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-[101] p-8 lg:hidden transform transition-transform duration-500 ease-out flex flex-col gap-10 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between border-b border-cream pb-6">
                    <span className="font-serif text-2xl font-black italic text-primary uppercase leading-none">Bộ lọc</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-primary active:scale-90 transition-transform">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-12">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary leading-none">Theo danh mục</h4>
                        <div className="grid gap-3">
                            {PRODUCT_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { updateParams('category', cat.id); setIsSidebarOpen(false); }}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${activeCategory === cat.id ? 'bg-primary text-cream border-primary shadow-lg' : 'bg-cream border-transparent text-text-muted hover:text-primary'}`}
                                >
                                    <span className="font-bold text-sm tracking-wide">{cat.name}</span>
                                    <span className="text-xl opacity-80">{cat.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={() => setIsSidebarOpen(false)} className="btn btn-primary w-full py-5 shadow-2xl">Áp dụng bộ lọc</button>
            </div>

            {/* Featured Recommendations Footer */}
            <section className="mt-40 py-32 bg-primary overflow-hidden relative border-t border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
                <div className="container relative z-10 px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 text-center md:text-left">
                        <div className="space-y-4">
                            <span className="text-secondary font-black text-xs uppercase tracking-widest italic animate-float">Bán Chạy Nhất</span>
                            <h2 className="text-4xl md:text-6xl font-serif font-black text-cream leading-[1.1]">Gợi Ý <br /> <span className="text-secondary italic font-medium uppercase italic">Riêng</span> Cho Bạn</h2>
                        </div>
                        <Link to="/ve-chung-toi" className="inline-flex items-center gap-4 text-cream font-black uppercase text-xs tracking-[0.3em] group">
                            Khám phá quy trình
                            <div className="w-14 h-14 bg-white/5 group-hover:bg-secondary rounded-full flex items-center justify-center transition-all group-hover:scale-110 border border-white/10">
                                <ArrowRight size={20} className="group-hover:translate-x-1 group-hover:text-primary transition-all text-secondary" />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {PRODUCTS.slice(0, 4).map((p, idx) => (
                            <div key={p.id} className="animate-reveal" style={{ animationDelay: `${idx * 150}ms` }}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
