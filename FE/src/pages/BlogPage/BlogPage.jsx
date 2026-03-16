import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Search,
    Clock,
    ChevronRight,
    ArrowRight,
    TrendingUp,
    Coffee,
    Mail,
    X,
    Calendar,
    User,
    ExternalLink,
    ChevronDown
} from 'lucide-react';
import { BLOG_POSTS } from '../../data/products';
import { formatDate } from '../../utils/helpers';
import { useSEO } from '../../hooks/useSEO';

const CATEGORIES = ['Tất cả', 'Cà phê', 'Nông sản', 'Sống sạch', 'Công thức', 'Tin tức'];

export default function BlogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    const activeCategory = searchParams.get('category') || 'Tất cả';

    useSEO({
        title: 'Blog - Cẩm Nang Sống Sạch',
        description: 'Chia sẻ câu chuyện về cà phê, nông sản sạch, mẹo sống xanh và bí quyết chọn đặc sản chất lượng từ Phú Yên.',
        path: '/blog',
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredPosts = useMemo(() => {
        let result = [...BLOG_POSTS];
        if (activeCategory !== 'Tất cả') {
            result = result.filter(post => post.category === activeCategory);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(q) ||
                post.excerpt.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCategory, searchQuery]);

    const featuredPost = filteredPosts[0];
    const regularPosts = filteredPosts.slice(1);

    const updateCategory = (cat) => {
        const params = new URLSearchParams(searchParams);
        if (cat === 'Tất cả') params.delete('category');
        else params.set('category', cat);
        setSearchParams(params);
    };

    return (
        <main className="bg-cream min-h-screen pb-32">
            {/* ======= BLOG HERO ======= */}
            <section className="relative pt-40 pb-20 bg-primary text-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(212,163,115,0.1),transparent_50%)] op-50" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

                <div className="container px-4 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto animate-reveal">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-secondary mb-2 opacity-50">
                            <Link to="/" className="hover:text-cream transition-colors">Trang chủ</Link>
                            <ChevronRight size={10} strokeWidth={4} />
                            <span className="text-secondary uppercase">Cẩm nang sống sạch</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight leading-[0.8] italic uppercase">
                            Tạp Chí <br /> <span className="text-secondary italic font-light lowercase">Nông Sản</span>
                        </h1>
                        <p className="text-cream/50 text-xl font-medium leading-relaxed max-w-2xl px-4">
                            Chia sẻ những câu chuyện về nguồn cội cà phê, mẹo sống xanh và bí quyết chọn nông sản tinh túy.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-cream/40">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                    {filteredPosts.length} Bài viết tâm huyết
                </div>
            </section>

            {/* ======= FILTERS & SEARCH ======= */}
            <section className="sticky top-24 z-40 bg-white/5 backdrop-blur-md border-b border-cream py-6">
                <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 custom-scrollbar whitespace-nowrap scroll-smooth">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => updateCategory(cat)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-cream shadow-xl' : 'bg-cream text-text-muted hover:bg-white hover:text-secondary border border-secondary/5'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative group w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Tìm bài viết..."
                            className="w-full bg-cream border border-secondary/5 px-12 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all placeholder:text-text-muted/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-50" size={16} />
                    </div>
                </div>
            </section>

            {/* ======= FEATURED POST ======= */}
            {featuredPost && (
                <section className="container px-4 mt-20 animate-reveal">
                    <Link to={`/blog/${featuredPost.slug}`} className="group relative block rounded-[4rem] overflow-hidden shadow-premium-lg border-8 border-white bg-white min-h-[500px]">
                        <div className="absolute inset-0">
                            <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-80" />
                        </div>
                        <div className="absolute inset-0 p-12 lg:p-24 flex flex-col justify-end max-w-4xl space-y-8">
                            <div className="flex flex-wrap gap-4">
                                <span className="bg-secondary text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2">
                                    <TrendingUp size={12} strokeWidth={3} /> Đọc nhiều nhất
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm text-cream font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-white/10">
                                    {featuredPost.category}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-cream italic leading-none group-hover:text-secondary transition-colors uppercase italic tracking-tighter">
                                {featuredPost.title}
                            </h2>
                            <p className="text-cream/50 text-base md:text-lg font-medium leading-relaxed line-clamp-2 max-w-2xl px-2">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-10 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3 text-cream/40 text-[10px] font-black uppercase tracking-widest font-sans">
                                    <Clock size={16} className="text-secondary" /> {featuredPost.readTime}
                                </div>
                                <div className="flex items-center gap-3 text-cream/40 text-[10px] font-black uppercase tracking-widest font-sans">
                                    <Calendar size={16} className="text-secondary" /> {formatDate(featuredPost.date)}
                                </div>
                                <div className="ml-auto inline-flex items-center gap-4 text-cream font-black text-[10px] uppercase tracking-[0.2em] group/link">
                                    Xem chi tiết <ArrowRight className="group-hover/link:translate-x-3 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* ======= ARTICLE GRID ======= */}
            <section className="container px-4 mt-32 space-y-12">
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        {regularPosts.map((post, idx) => (
                            <article
                                key={post.id}
                                className="group flex flex-col animate-reveal shadow-premium rounded-[3rem] bg-white overflow-hidden border border-secondary/5 relative min-h-[500px]"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <Link to={`/blog/${post.slug}`} className="relative h-64 overflow-hidden flex-shrink-0">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute top-6 right-6">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/50 rounded-2xl flex items-center justify-center text-cream opacity-0 group-hover:opacity-100 transition-all rotate-12 group-hover:rotate-0 translate-y-4 group-hover:translate-y-0">
                                            <ExternalLink size={20} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="bg-primary text-secondary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl">
                                            {post.category}
                                        </span>
                                    </div>
                                </Link>
                                <div className="p-10 flex flex-col flex-1 space-y-8">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                        <span className="flex items-center gap-2 font-black italic"><Clock size={14} className="text-secondary" /> {post.readTime}</span>
                                        <span className="w-1 h-1 bg-secondary rounded-full" />
                                        <span className="italic">{formatDate(post.date)}</span>
                                    </div>
                                    <h3 className="text-2xl font-serif font-black text-primary line-clamp-2 leading-none group-hover:text-secondary transition-colors italic uppercase tracking-tighter">
                                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-3 font-semibold opacity-60 uppercase tracking-widest italic flex-1 border-l-2 border-secondary/20 pl-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-8 border-t border-cream">
                                        <Link to={`/blog/${post.slug}`} className="inline-flex items-center justify-between w-full text-primary font-black text-[10px] uppercase tracking-widest group/link italic">
                                            Khám phá ngay <div className="w-10 h-10 bg-cream group-hover:bg-secondary rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"><ArrowRight className="group-hover/link:translate-x-2 transition-transform opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all text-secondary" size={16} strokeWidth={3} /></div>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-32 h-32 bg-cream rounded-[4rem] flex items-center justify-center text-secondary relative animate-float">
                            <Search size={64} className="opacity-10" />
                            <div className="absolute inset-0 flex items-center justify-center text-[4rem]">📖</div>
                        </div>
                        <h3 className="text-3xl font-serif font-black italic text-primary">Không tìm thấy bài viết</h3>
                        <p className="text-text-secondary text-sm font-medium">Bạn hãy thử từ khóa khác hoặc danh mục khác nhé.</p>
                        <button onClick={() => updateCategory('Tất cả')} className="btn btn-primary px-12 uppercase italic">Về danh mục gốc</button>
                    </div>
                )}
            </section>

            {/* Pagination placeholder */}
            <section className="py-20 flex justify-center gap-3">
                <button className="w-14 h-14 rounded-2xl bg-primary text-cream flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl">1</button>
                <button className="w-14 h-14 rounded-2xl bg-white border border-secondary/5 text-text-muted hover:bg-cream flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all">2</button>
                <button className="w-14 h-14 rounded-2xl bg-white border border-secondary/5 text-text-muted hover:bg-cream flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all">3</button>
            </section>

            {/* Newsletter Section Re-used/Refined */}
            <section className="container mt-20 px-4">
                <div className="bg-primary rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 opacity-30" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-6 text-center lg:text-left">
                            <h2 className="text-4xl md:text-7xl text-cream font-serif font-black italic uppercase leading-none tracking-tighter">Đừng Bỏ Lỡ <br /> Câu Chuyện <span className="text-secondary italic font-light lowercase">Mới Nhất</span></h2>
                            <p className="text-cream/50 text-xl font-medium max-w-sm px-2">Nhận những mẹo chọn nông sản sạch và công thức pha chế độc quyền mỗi tuần.</p>
                        </div>
                        <div className="w-full max-w-md space-y-6">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email nhận tin..."
                                    className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-10 text-cream focus:bg-white/10 focus:border-secondary transition-all outline-none font-bold uppercase tracking-widest text-xs placeholder:opacity-20"
                                />
                                <button className="absolute right-3 top-3 bottom-3 bg-secondary text-primary px-10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cream transition-all shadow-xl active:scale-95">Tham gia</button>
                            </div>
                            <p className="text-[9px] font-black uppercase text-cream/20 tracking-[0.3em] text-center italic">Lan tỏa phong vị sạch - Vì cộng đồng hưng thịnh</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
