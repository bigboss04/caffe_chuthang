import { Link } from 'react-router-dom';
import {
    Facebook,
    Instagram,
    Twitter as TikTok,
    Youtube,
    Mail,
    PhoneCall,
    MapPin,
    Coffee,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    Truck
} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-primary text-cream pt-32 pb-12 overflow-hidden border-t border-white/5">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 -z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 -z-0" />

            <div className="container relative z-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">

                    {/* Brand Info */}
                    <div className="lg:col-span-4 space-y-10">
                        <Link to="/" className="group flex items-center gap-3">
                            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:rotate-6 transition-transform shadow-2xl">
                                <Coffee size={32} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-serif text-2xl font-black tracking-tight">Nông Sản</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary opacity-80">Đắk Nông - Premium</span>
                            </div>
                        </Link>

                        <p className="text-cream/50 text-base leading-relaxed font-medium">
                            Sứ mệnh của chúng tôi là mang những tinh hoa nông sản sạch từ vùng cao nguyên Đắk Nông đến tay người tiêu dùng Việt với chất lượng cao nhất và quy trình minh bạch.
                        </p>

                        <div className="flex gap-4">
                            {[Facebook, Instagram, Youtube, TikTok].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cream hover:bg-secondary hover:text-primary transition-all duration-300 active:scale-90 border border-white/10"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-4">Khám Phá</h4>
                        <ul className="space-y-4 font-bold text-sm">
                            {['Sản Phẩm', 'Ưu Đãi', 'Combo Quà Tặng', 'Cẩm Nang Blog', 'Tuyển Dụng'].map(link => (
                                <li key={link}>
                                    <Link to="/" className="text-cream/50 hover:text-secondary transition-colors inline-flex items-center group">
                                        <ArrowRight size={14} className="mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <h5 className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-4">Chính Sách</h5>
                        <ul className="space-y-4 font-bold text-sm">
                            {['Bảo Mật Thông Tin', 'Đổi Trả & Hoàn Tiền', 'Vận Chuyển', 'Thanh Toán', 'Khiếu Nại'].map(link => (
                                <li key={link}>
                                    <Link to="/" className="text-cream/50 hover:text-secondary transition-colors inline-flex items-center group">
                                        <ArrowRight size={14} className="mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <h5 className="text-secondary font-black text-xs uppercase tracking-[0.3em] mb-4">Hỗ Trợ Khách Hàng</h5>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary border border-secondary/20 flex-shrink-0">
                                    <PhoneCall size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-cream/30 tracking-widest mb-1">Hotline toàn quốc</div>
                                    <div className="text-xl font-serif font-black text-cream tracking-tight underline underline-offset-4 decoration-secondary/30">0826 487 948</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary border border-secondary/20 flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase text-cream/30 tracking-widest mb-1">Email liên hệ</div>
                                    <div className="text-lg font-serif font-black text-cream tracking-tight italic">vandaiit2004@gmail.com</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group cursor-pointer">
                                <MapPin size={24} className="text-secondary flex-shrink-0 mt-1" />
                                <p className="text-cream/40 text-sm font-medium leading-relaxed group-hover:text-cream transition-colors">
                                    Xã Kiến Đức Tỉnh Lâm Đồng
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start space-y-2">
                        <div className="flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                            <ShieldCheck size={28} />
                            <CreditCard size={28} />
                            <Truck size={28} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cream/20 pt-2">
                            © {currentYear} Nông Sản Đắk Nông Premium. Bản quyền được bảo lưu.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <Link to="/lien-he" className="btn bg-white/5 text-cream border border-white/10 text-xs px-8 py-3 rounded-full hover:bg-secondary hover:text-primary transition-all font-bold">Tư vấn miễn phí</Link>
                        <div className="hidden lg:flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-cream/30 italic">Hệ thống đang trực tuyến</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
