import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    ShoppingBag,
    Menu,
    X,
    Search,
    Coffee,
    ChevronDown,
    PhoneCall,
    User,
    Heart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { PRODUCT_CATEGORIES } from '../../data/products';

const NAV_LINKS = [
    {
        label: 'Cà Phê Rang Xay',
        href: '/san-pham?category=cafe-rang-xay',
        children: [
            { label: 'Arabica Cầu Đất', href: '/san-pham?category=cafe-rang-xay&type=arabica' },
            { label: 'Robusta Buôn Ma Thuột', href: '/san-pham?category=cafe-rang-xay&type=robusta' },
            { label: 'Cà Phê Phin Cao Cấp', href: '/san-pham?category=cafe-rang-xay&type=blend' },
        ],
    },
    {
        label: 'Đặc Sản Đắk Nông',
        href: '/san-pham?category=dac-san-phu-yen',
        children: [
            { label: 'Mứt Gừng Truyền Thống', href: '/san-pham?category=dac-san-phu-yen&type=mut-gung' },
            { label: 'Hồ Tiêu Sạch', href: '/san-pham?category=dac-san-phu-yen&type=ho-tieu' },
        ],
    },
    { label: 'Về Chúng Tôi', href: '/ve-chung-toi' },
    { label: 'Blog', href: '/blog' },
    { label: 'Liên Hệ', href: '/lien-he' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems, toggleCart } = useCart();
    const location = useLocation();

    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 20);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Close menus on navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    return (
        <>
            {/* Topbar: Hidden on tiny screens, show on md+ */}
            <div className="hidden md:block bg-primary text-cream py-2 text-xs border-b border-white/5">
                <div className="container flex justify-between items-center px-4">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5 opacity-90">
                            <PhoneCall size={12} className="text-secondary" />
                            Hotline: <a href="tel:0826487948" className="hover:text-secondary transition-colors">0826 487 948</a>
                        </span>
                        <span className="opacity-70">Giao hàng cà phê tươi mới mỗi ngày</span>
                    </div>
                    <div className="flex gap-4 items-center font-bold tracking-wide">
                        <Link to="/chinh-sach-doi-tra" className="hover:text-secondary">Chính sách</Link>
                        <span className="w-px h-3 bg-white/10" />
                        <Link to="/lien-he" className="hover:text-secondary">Lẻ / Sỉ</Link>
                    </div>
                </div>
            </div>

            <header
                className={`fixed top-0 md:top-8 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'md:top-0 bg-white/95 backdrop-blur-md shadow-xl py-3' : 'bg-transparent py-5'
                    }`}
            >
                <div className="container flex items-center justify-between px-4">
                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-2.5 flex-shrink-0 z-50">
                        <div className={`w-12 h-12 bg-primary rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-secondary group-hover:rotate-6 ${isScrolled ? 'scale-90 shadow-lg' : 'shadow-2xl'}`}>
                            <Coffee className={`transition-colors duration-500 ${isScrolled ? 'text-cream' : 'text-cream'}`} size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className={`font-serif text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-primary' : 'md:text-cream text-primary'}`}>Nông Sản</span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isScrolled ? 'text-secondary' : 'md:text-secondary/80 text-secondary'}`}>Đắk Nông</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {NAV_LINKS.map((link) => (
                            <div key={link.label} className="relative group px-1">
                                <NavLink
                                    to={link.href}
                                    className={({ isActive }) => `
                    flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm tracking-wide transition-all duration-300
                    ${isActive ? 'bg-secondary text-primary' : `${isScrolled ? 'text-text-primary hover:bg-cream hover:text-secondary' : 'text-cream hover:bg-white/10 hover:text-secondary'}`}
                  `}
                                >
                                    {link.label}
                                    {link.children && <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                                </NavLink>

                                {link.children && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                                        <div className="bg-white rounded-2xl shadow-premium-lg border border-secondary/10 p-2 min-width-[240px] overflow-hidden">
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.label}
                                                    to={child.href}
                                                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-text-primary hover:bg-cream hover:text-secondary transition-colors whitespace-nowrap"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4 z-50">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isScrolled ? 'bg-cream text-primary hover:bg-secondary/20' : 'bg-white/10 text-cream hover:bg-white/20'}`}
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        <button
                            onClick={toggleCart}
                            className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${isScrolled ? 'bg-primary text-cream shadow-lg hover:bg-primary-light' : 'bg-secondary text-primary shadow-2xl hover:bg-secondary-dark'}`}
                            aria-label="Cart"
                        >
                            <ShoppingBag size={20} strokeWidth={2.5} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary animate-reveal">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${isScrolled ? 'text-primary' : 'text-primary md:text-cream'}`}
                            aria-label="Menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 bg-primary/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <div
                className={`fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[101] shadow-2xl lg:hidden transform transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between border-b border-cream">
                        <span className="font-serif text-xl font-black text-primary">Menu</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-muted hover:text-primary transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        {NAV_LINKS.map(link => (
                            <div key={link.label} className="space-y-1">
                                {link.children ? (
                                    <>
                                        <div className="px-4 py-3 font-bold text-primary opacity-50 uppercase text-[10px] tracking-widest mt-4">
                                            {link.label}
                                        </div>
                                        {link.children.map(child => (
                                            <Link key={child.label} to={child.href} className="block px-4 py-3 rounded-xl font-bold text-primary hover:bg-cream transition-colors">
                                                {child.label}
                                            </Link>
                                        ))}
                                    </>
                                ) : (
                                    <Link to={link.href} className="block px-4 py-3 rounded-xl font-bold text-primary hover:bg-cream transition-colors">
                                        {link.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="p-6 bg-cream m-4 rounded-3xl space-y-4">
                        <p className="text-xs font-medium text-text-secondary text-center">Cùng chúng tôi lan tỏa phong vị cao nguyên Đắk Nông</p>
                        <Link to="/lien-he" className="btn btn-primary w-full py-3 text-sm">Hỗ trợ khách hàng</Link>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <div
                className={`fixed inset-0 bg-primary/95 backdrop-blur-md z-[200] transition-all duration-500 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            >
                <button onClick={() => setIsSearchOpen(false)} className="absolute top-8 right-8 text-cream/50 hover:text-cream transition-colors">
                    <X size={48} />
                </button>
                <div className="h-full flex flex-col items-center justify-center px-4 max-w-4xl mx-auto">
                    <h2 className="text-cream/50 font-serif text-3xl mb-8">Bạn đang tìm gì?</h2>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Nhập tên sản phẩm, bài viết..."
                            className="w-full bg-transparent border-b-4 border-secondary/30 focus:border-secondary py-6 px-4 text-4xl text-cream font-serif outline-none placeholder:text-cream/20"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary" size={40} />
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <span className="text-cream/40 text-sm">Gợi ý:</span>
                        {['Arabica Cầu Đất', 'Mứt Gừng', 'Robusta Cao Nguyên'].map(tag => (
                            <button key={tag} className="text-secondary hover:text-cream transition-colors text-sm font-bold underline underline-offset-4 decoration-secondary/30 capitalize">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
