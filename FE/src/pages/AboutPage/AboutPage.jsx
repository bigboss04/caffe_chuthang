import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Coffee,
    Leaf,
    ShieldCheck,
    Users,
    Target,
    Award,
    History,
    TrendingUp,
    Heart,
    ChevronRight,
    Globe
} from 'lucide-react';

const MILESTONES = [
    { year: '2010', title: 'Khởi đầu từ nông trại nhỏ', desc: 'Diện tích 2 hecta tại Sông Hinh, Phú Yên.' },
    { year: '2015', title: 'Mở rộng vùng nguyên liệu', desc: 'Hợp tác với bà con Cầu Đất, Đà Lạt cho Arabica.' },
    { year: '2018', title: 'Xưởng rang xay hiện đại', desc: 'Sử dụng công nghệ rang củi kết hợp máy công suất lớn.' },
    { year: '2022', title: 'Thương hiệu vươn xa', desc: 'Có mặt tại hơn 50 đại lý toàn quốc và bắt đầu xuất khẩu.' },
];

const VALUES = [
    {
        title: 'Chất lượng nguyên bản',
        desc: 'Chúng tôi cam kết 100% sản phẩm là nông sản sạch, không tẩm ướp hay pha tạp chất.',
        icon: Coffee,
        color: 'bg-secondary'
    },
    {
        title: 'Phát triển bền vững',
        desc: 'Hỗ trợ bà con nông dân về kỹ thuật và bao tiêu đầu ra ổn định, bảo vệ môi trường.',
        icon: Leaf,
        color: 'bg-primary'
    },
    {
        title: 'Vì sức khỏe cộng đồng',
        desc: 'Sản phẩm được kiểm soát hóa chất nghiêm ngặt từ khâu chăm bón đến đóng gói.',
        icon: ShieldCheck,
        color: 'bg-secondary'
    },
];

export default function AboutPage() {
    return (
        <main className="bg-cream min-h-screen pb-32 overflow-hidden">
            {/* ======= HERO SECTION ======= */}
            <section className="relative pt-48 pb-32 bg-primary text-cream overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,rgba(212,163,115,0.1),transparent_50%)]" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

                <div className="container relative z-10 px-4">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto animate-reveal">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-secondary mb-2 opacity-50">
                            <Link to="/" className="hover:text-cream">Trang chủ</Link>
                            <ChevronRight size={10} strokeWidth={4} />
                            <span className="text-secondary">Về chúng tôi</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight leading-[0.8] uppercase italic">
                            Câu Chuyện <br /> <span className="text-secondary italic font-light lowercase">Nông Sản</span>
                        </h1>
                        <p className="text-cream/50 text-xl font-medium leading-relaxed max-w-2xl px-4">
                            Hành trình từ khát vọng mang phong vị cao nguyên đến mọi bàn trà, tách cà phê của gia đình Việt.
                        </p>
                    </div>
                </div>

                {/* Hero Visual decor */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 animate-bounce cursor-pointer opacity-30">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hành trình</span>
                    <div className="w-px h-12 bg-gradient-to-b from-secondary to-transparent" />
                </div>
            </section>

            {/* ======= MISSION & VISION ======= */}
            <section className="py-40 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-cream/30 -skew-x-12 translate-x-1/2 -z-0" />

                <div className="container relative z-10 px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">
                        <div className="flex-1 space-y-12 animate-reveal">
                            <div className="space-y-6">
                                <span className="text-secondary font-black text-xs uppercase tracking-[0.3em]">Sứ mệnh & Tầm nhìn</span>
                                <h2 className="text-4xl md:text-6xl font-serif font-black text-primary leading-tight lowercase first-letter:uppercase italic">Lan tỏa giá trị sạch từ tâm người nông dân</h2>
                                <p className="text-lg text-text-secondary leading-relaxed font-bold opacity-80">
                                    Nông Sản Phú Yên không chỉ là một thương hiệu, đó là lời hứa về sự trung thực trong từng hạt cà phê, từng miếng mứt gừng.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-10 bg-cream/30 rounded-[3.5rem] border border-secondary/10 space-y-4 hover:shadow-premium transition-all group">
                                    <Target className="text-secondary group-hover:rotate-12 transition-transform" size={40} />
                                    <h4 className="text-xl font-serif font-black text-primary italic uppercase leading-tight">Sứ mệnh</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed font-semibold opacity-60">Xây dựng hệ sinh thái nông sản bền vững, giúp nâng cao giá trị nông sản Việt và thu nhập của bà con nông dân.</p>
                                </div>
                                <div className="p-10 bg-primary rounded-[3.5rem] text-cream space-y-4 hover:shadow-premium transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <Globe className="text-secondary group-hover:rotate-12 transition-transform" size={40} />
                                    <h4 className="text-xl font-serif font-black italic uppercase leading-tight">Tầm nhìn</h4>
                                    <p className="text-sm text-cream/40 leading-relaxed font-semibold">Trở thành biểu tượng của nông sản sạch Phú Yên trên bản đồ thế giới, vươn tầm các thị trường khó tính nhất.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative animate-reveal [animation-delay:200ms]">
                            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-premium-lg border-8 border-white aspect-[4/5] group">
                                <img
                                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200"
                                    alt="Farmers work"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-50" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10 animate-float" />
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10 animate-float [animation-delay:1.5s]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ======= CORE VALUES ======= */}
            <section className="py-40 bg-primary overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
                <div className="container relative z-10 px-4">
                    <div className="text-center mb-24 space-y-6 animate-reveal">
                        <span className="text-secondary font-black text-xs uppercase tracking-widest">Giá Trị Cốt Lõi</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-black text-cream leading-tight italic uppercase">Ba Trụ Cột <span className="text-secondary italic font-light lowercase">Vững Chắc</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                        {VALUES.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-8 animate-reveal" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className={`w-24 h-24 ${val.color} rounded-[2.5rem] flex items-center justify-center text-primary shadow-[0_15px_40px_rgba(212,163,115,0.3)] hover:rotate-12 transition-transform duration-500`}>
                                    <val.icon size={44} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-serif font-black text-cream tracking-tight italic">{val.title}</h3>
                                    <p className="text-cream/40 text-sm font-semibold leading-relaxed max-w-xs mx-auto">{val.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======= TIMELINE ======= */}
            <section className="py-40 bg-cream">
                <div className="container px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-32 animate-reveal">
                        <div className="space-y-4">
                            <span className="text-secondary font-black text-xs uppercase tracking-widest leading-none italic animate-float">Bản sắc thời gian</span>
                            <h2 className="text-4xl md:text-6xl font-serif font-black text-primary uppercase italic">Hành Trình <span className="text-secondary italic font-light lowercase">Chinh Phục</span></h2>
                        </div>
                        <p className="max-w-xs text-text-secondary text-sm font-bold opacity-60 leading-relaxed uppercase tracking-widest">Từng bước nhỏ kiến tạo nên di sản nông sản sạch hôm nay.</p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10 hidden md:block" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
                            {MILESTONES.map((stone, idx) => (
                                <div key={idx} className="relative space-y-8 animate-reveal" style={{ animationDelay: `${idx * 150}ms` }}>
                                    <div className="hidden md:block absolute top-[calc(50%-12px)] left-0 w-6 h-6 rounded-full border-4 border-white bg-secondary shadow-lg z-10 group-hover:scale-125 transition-transform" />
                                    <div className="space-y-4 pt-12 text-center md:text-left">
                                        <span className="text-4xl font-serif font-black text-secondary tracking-tighter opacity-80 leading-none">{stone.year}</span>
                                        <h4 className="text-xl font-serif font-black text-primary italic lowercase first-letter:uppercase">{stone.title}</h4>
                                        <p className="text-xs text-text-secondary leading-relaxed font-bold opacity-60">{stone.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ======= THE TEAM ======= */}
            <section className="py-40 bg-white">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                        <div className="space-y-12 animate-reveal">
                            <div className="space-y-6">
                                <span className="text-secondary font-black text-xs uppercase tracking-[0.3em] italic">Người Kế Thừa</span>
                                <h2 className="text-4xl md:text-6xl font-serif font-black text-primary uppercase leading-[1.1]">Những Bàn Tay <br /> <span className="text-secondary italic font-light lowercase">Kiến Tạo</span> Tách Cà Phê</h2>
                                <p className="text-lg text-text-secondary leading-relaxed font-bold opacity-70">
                                    Đội ngũ của chúng tôi tập hợp những nghệ nhân rang xay gạo cội và những chuyên gia nông nghiệp đầy nhiệt huyết, sẵn sàng đồng hành cùng bà con trong từng mùa vụ.
                                </p>
                            </div>
                            <div className="flex items-center gap-12 border-t border-cream pt-10">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-serif font-black text-primary tracking-tighter leading-none italic animate-float">120+</span>
                                    <span className="text-[10px] uppercase font-black text-text-muted tracking-widest mt-2">Nghệ nhân trà & cà phê</span>
                                </div>
                                <div className="w-px h-12 bg-primary/10" />
                                <div className="flex flex-col">
                                    <span className="text-4xl font-serif font-black text-primary tracking-tighter leading-none italic animate-float [animation-delay:0.5s]">100%</span>
                                    <span className="text-[10px] uppercase font-black text-text-muted tracking-widest mt-2">Tâm huyết Việt</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 animate-reveal [animation-delay:200ms]">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`aspect-square rounded-[3rem] overflow-hidden shadow-premium group ${i % 2 !== 0 ? 'translate-y-8' : ''}`}>
                                    <img
                                        src={`https://images.unsplash.com/photo-${1500000000000 + i * 1234567}?q=80&w=600&auto=format&fit=crop`}
                                        alt="Team member"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ======= CTA ======= */}
            <section className="py-24 px-4 overflow-hidden">
                <div className="container bg-primary rounded-[4rem] p-12 md:p-24 relative shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-50" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h2 className="text-4xl md:text-6xl text-cream font-serif font-black italic leading-tight uppercase">Đồng Hành <br /> Cùng <span className="text-secondary italic font-light lowercase">Phong Vị</span> Sạch</h2>
                            <p className="text-cream/40 text-lg font-medium max-w-md">Khám phá dải sản phẩm nông sản sạch truyền thống Phú Yên.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link to="/san-pham" className="btn btn-secondary px-12 py-5 text-sm uppercase tracking-widest font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                                Mua sắm ngay
                            </Link>
                            <Link to="/lien-he" className="hidden sm:flex text-cream font-black uppercase text-xs tracking-widest hover:text-secondary group transition-all">
                                Liên hệ Hợp tác <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
