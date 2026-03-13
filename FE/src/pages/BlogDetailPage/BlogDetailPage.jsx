import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Clock,
    ChevronRight,
    ArrowLeft,
    Share2,
    Facebook,
    Twitter as TikTok,
    MessageCircle,
    Copy,
    Calendar,
    User,
    Coffee,
    Heart,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { BLOG_POSTS } from '../../data/products';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
    const { slug } = useParams();

    const post = useMemo(() => BLOG_POSTS.find(p => p.slug === slug), [slug]);
    const relatedPosts = useMemo(() =>
        BLOG_POSTS.filter(p => p.id !== post?.id && p.category === post?.category).slice(0, 3),
        [post]
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) return (
        <div className="py-40 text-center animate-reveal">
            <h1 className="text-4xl font-serif font-black mb-6 italic italic uppercase">Bài viết không tồn tại</h1>
            <Link to="/blog" className="btn btn-primary px-12 italic">Về trang tin tức</Link>
        </div>
    );

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép liên kết!', {
            style: { background: '#2C1810', color: '#FDF8F0', borderRadius: '16px', fontWeight: 'bold' },
        });
    };

    return (
        <main className="bg-cream min-h-screen pb-32">
            {/* ======= ARTICLE HERO ======= */}
            <section className="relative pt-40 pb-20 bg-primary text-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(212,163,115,0.1),transparent_50%)] op-50" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

                <div className="container px-4 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto animate-reveal">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-secondary mb-4 opacity-50">
                            <Link to="/blog" className="hover:text-cream transition-colors">Tất cả bài viết</Link>
                            <ChevronRight size={10} strokeWidth={4} />
                            <span className="text-cream">{post.category}</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight leading-none uppercase italic italic tracking-tighter">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-10 pt-10 border-t border-white/5 w-full max-w-3xl">
                            <div className="flex items-center gap-3 text-cream/40 text-[10px] font-black uppercase tracking-widest font-sans italic">
                                <User size={16} className="text-secondary" /> {post.author || 'Mộc Phú Yên'}
                            </div>
                            <div className="flex items-center gap-3 text-cream/40 text-[10px] font-black uppercase tracking-widest font-sans italic">
                                <Clock size={16} className="text-secondary" /> {post.readTime}
                            </div>
                            <div className="flex items-center gap-3 text-cream/40 text-[10px] font-black uppercase tracking-widest font-sans italic">
                                <Calendar size={16} className="text-secondary" /> {formatDate(post.date)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======= ARTICLE CONTENT ======= */}
            <div className="container px-4 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Main Content Side */}
                    <article className="lg:col-span-8 group animate-reveal">
                        <div className="rounded-[4rem] overflow-hidden shadow-premium-lg border-8 border-white bg-white mb-20 aspect-video relative group">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-50" />
                        </div>

                        {/* Post Body (Simulated Content) */}
                        <div className="space-y-12 bg-white rounded-[4rem] p-10 md:p-20 shadow-premium-lg border border-secondary/5 mb-20 prose prose-cream max-w-none text-lg text-text-secondary font-medium leading-[1.8] animate-reveal [animation-delay:200ms]">
                            <p className="text-2xl font-serif font-black italic text-primary border-l-4 border-secondary/30 pl-8 leading-relaxed mb-16 first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:uppercase first-letter:font-black">
                                {post.excerpt}
                            </p>

                            <h3 className="text-4xl font-serif font-black italic text-primary leading-tight lowercase first-letter:uppercase pt-10">Bản sắc trong từng hạt mầm cao nguyên</h3>
                            <p>
                                Câu chuyện bắt đầu từ những cánh đồng cà phê bền bỉ dưới nắng gió miền Trung. Tại Phú Yên, chúng tôi chọn lọc những vùng nguyên liệu có độ cao tối ưu như Sông Hinh, nơi thổ nhưỡng đỏ bazan kiến tạo nên hương vị Robusta nồng nàn. Bên cạnh đó, vùng Cầu Đất (Lâm Đồng) mang đến những hạt Arabica thanh tao nhất.
                            </p>

                            <div className="grid grid-cols-2 gap-8 my-16">
                                <div className="rounded-3xl overflow-hidden aspect-square shadow-premium border-4 border-cream rotate-2 group-hover:rotate-0 transition-transform">
                                    <img src="https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200" alt="process 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-3xl overflow-hidden aspect-square shadow-premium border-4 border-cream -rotate-2 group-hover:rotate-0 transition-transform -translate-y-8">
                                    <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1200" alt="process 2" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <h3 className="text-4xl font-serif font-black italic text-primary leading-tight lowercase first-letter:uppercase pt-10">Quy trình rang xay chuẩn nghệ nhân</h3>
                            <p>
                                Chúng tôi không tẩm ướp. Đó là tôn chỉ lớn nhất. Việc giữ nguyên hương vị mộc mọc đòi hỏi sự am hiểu sâu sắc về thời gian và nhiệt độ rang. Nghệ nhân rang xay của Nông Sản Phú Yên phải thức cùng lửa, thức cùng hương để nắm bắt đúng thời điểm "crack" đầu tiên - khi tinh hoa thực sự được giải phóng.
                            </p>

                            <div className="p-12 bg-cream rounded-[3.5rem] border border-secondary/10 relative overflow-hidden group/quote my-16 shadow-inner">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <Coffee className="text-secondary/20 group-hover/quote:rotate-12 transition-transform scale-[2.5] mb-4" size={48} />
                                <p className="text-xl font-serif font-black text-primary italic leading-relaxed opacity-80 uppercase tracking-tight text-center">
                                    "Hãy để tách cà phê nói lên sự tử tế của người sản xuất và niềm tin của người sử dụng."
                                </p>
                            </div>

                            <p>
                                Kết thúc bài viết, chúng tôi mong muốn mỗi người tiêu dùng không chỉ nhận về một sản phẩm chất lượng, mà còn là một phần di sản nông nghiệp Việt Nam được gìn giữ trọn vẹn nhất.
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-8 pt-12 border-t border-cream">
                                <div className="flex flex-wrap gap-3">
                                    {['Cà phê sạch', 'Nông sản Việt', 'Organic'].map(tag => (
                                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-text-muted bg-cream px-4 py-2 rounded-xl group-hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-secondary/20">#{tag}</span>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={copyLink} className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-primary border border-secondary/5 hover:bg-secondary hover:shadow-lg transition-all active:scale-90" title="Copy link">
                                        <Copy size={18} />
                                    </button>
                                    <button className="w-12 h-12 rounded-2xl bg-primary text-cream flex items-center justify-center border border-white/5 hover:bg-primary-light hover:shadow-lg transition-all active:scale-90 shadow-2xl">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Author Card */}
                        <div className="p-12 bg-white rounded-[4rem] shadow-premium-lg border border-secondary/5 flex flex-col md:flex-row items-center gap-10 animate-reveal [animation-delay:400ms]">
                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-primary shadow-xl shrink-0 group hover:rotate-6 transition-transform">
                                <img src="https://i.pravatar.cc/100?u=author" alt="author" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-serif font-black text-primary italic lowercase first-letter:uppercase">{post.author || 'Mộc Phú Yên'}</h4>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-secondary">Expert Editor & Agri Researcher</div>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed font-bold opacity-60">Với hơn 10 năm nghiên cứu vùng nguyên liệu nông sản miền Trung, Mộc tin rằng sự thật luôn nằm ở chất lượng nguyên bản của từng hạt mầm.</p>
                            </div>
                            <button className="btn btn-outline py-3 px-8 text-xs font-black uppercase tracking-widest border-secondary/30">Theo dõi tác giả</button>
                        </div>
                    </article>

                    {/* Sidebar Side */}
                    <aside className="lg:col-span-4 space-y-16 animate-reveal [animation-delay:300ms]">

                        {/* Categories list */}
                        <div className="p-10 bg-white rounded-[3.5rem] shadow-premium border border-secondary/5 space-y-8 min-h-[400px]">
                            <h3 className="text-xl font-serif font-black text-primary italic uppercase tracking-tight border-b border-cream pb-4">Danh Mục</h3>
                            <div className="space-y-3">
                                {['Cà phê sạch', 'Hành trình nông trại', 'Kỹ thuật pha chế', 'Sống xanh organic', 'Đặc sản Phú Yên'].map(cat => (
                                    <Link key={cat} to="/blog" className="flex items-center justify-between p-4 rounded-2xl bg-cream/50 text-text-muted hover:bg-primary hover:text-cream hover:shadow-xl transition-all font-bold text-xs uppercase tracking-widest group">
                                        <span>{cat}</span>
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-6">
                                <div className="p-8 bg-secondary rounded-[2.5rem] text-primary space-y-4 group overflow-hidden relative shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                    <TrendingUp size={32} className="group-hover:rotate-12 transition-transform" />
                                    <h4 className="text-lg font-serif font-black italic lowercase first-letter:uppercase leading-tight">Dành cho cộng đồng yêu cà phê mộc</h4>
                                    <button className="btn btn-primary w-full py-3 text-[10px] uppercase italic">Gia nhập hội</button>
                                </div>
                            </div>
                        </div>

                        {/* Trending posts */}
                        <div className="space-y-10">
                            <h3 className="text-xl font-serif font-black text-primary italic uppercase tracking-tight border-b-2 border-primary/5 pb-2 ml-4">Tin tức thịnh hành</h3>
                            <div className="space-y-8">
                                {relatedPosts.map((rp, i) => (
                                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="flex gap-5 group items-center animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-premium flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <img src={rp.image} alt={rp.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-opacity" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-xs font-serif font-black text-primary group-hover:text-secondary italic uppercase tracking-tighter leading-tight transition-colors line-clamp-2">{rp.title}</h4>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40">{formatDate(rp.date)}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Tags cloud */}
                        <div className="p-10 bg-white rounded-[3.5rem] shadow-premium border border-secondary/5 space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary italic border-b border-cream pb-4">Thẻ tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {['#caphephuyen', '#songxanh', '#organic', '#nongsanphuyen', '#arabica', '#robusta'].map(t => (
                                    <span key={t} className="text-[9px] font-black uppercase text-text-muted bg-cream px-3 py-1.5 rounded-lg border border-transparent hover:border-secondary/20 hover:text-primary transition-all cursor-pointer">{t}</span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ======= RELATED POSTS FOOTER ======= */}
                <section className="mt-40 bg-white overflow-hidden py-32 rounded-[5rem] shadow-2xl border border-secondary/5 relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cream/50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                    <div className="container relative z-10 px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 text-center md:text-left">
                            <div className="space-y-4">
                                <span className="text-secondary font-black text-xs uppercase tracking-[0.3em] italic animate-float">Tiếp tục khám phá</span>
                                <h2 className="text-4xl md:text-6xl font-serif font-black text-primary italic italic uppercase italic tracking-tighter leading-none">Cùng <span className="text-secondary italic font-light lowercase">Chủ Đề</span> Liên Quan</h2>
                            </div>
                            <Link to="/blog" className="btn btn-outline px-12 italic">Khám phá tất cả bài viết</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                            {relatedPosts.map((rp, idx) => (
                                <article
                                    key={rp.id}
                                    className="group flex flex-col animate-reveal shadow-premium rounded-[3rem] bg-cream overflow-hidden"
                                    style={{ animationDelay: `${idx * 150}ms` }}
                                >
                                    <Link to={`/blog/${rp.slug}`} className="relative h-64 overflow-hidden">
                                        <img src={rp.image} alt={rp.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    </Link>
                                    <div className="p-10 flex flex-col flex-1 space-y-6">
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                            <span className="flex items-center gap-2 italic uppercase"><Clock size={12} className="text-secondary" /> {rp.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-serif font-black text-primary leading-tight group-hover:text-secondary italic uppercase tracking-tighter truncate leading-none transition-colors">
                                            <Link to={`/blog/${rp.slug}`}>{rp.title}</Link>
                                        </h3>
                                        <div className="pt-6 border-t border-secondary/10">
                                            <Link to={`/blog/${rp.slug}`} className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group/link italic">
                                                Đọc chi tiết <ArrowRight className="group-hover/link:translate-x-3 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Floating Reading Progress */}
            <div className="fixed bottom-0 left-0 right-0 h-1 z-[100] bg-cream">
                <div className="h-full bg-secondary shadow-[0_0_10px_rgba(212,163,115,0.8)]" style={{ width: '45%' }} />
            </div>
        </main>
    );
}
