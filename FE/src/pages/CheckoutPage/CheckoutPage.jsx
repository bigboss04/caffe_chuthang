import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    CreditCard,
    Truck,
    ShieldCheck,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    Lock,
    MapPin,
    PhoneCall,
    Mail,
    Info,
    Gift,
    Coffee,
    ShoppingBag,
    Clock,
    ArrowRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
    { id: 'cod', name: 'Thanh toán COD', desc: 'Thanh toán trực tiếp khi nhận hàng (An tâm 100%)', icon: '🚚' },
    { id: 'vnpay', name: 'VNPAY (Quét mã QR)', desc: 'Thanh toán qua cổng VNPAY nhanh chóng, bảo mật', icon: '🏦' },
    { id: 'momo', name: 'Ví MoMo / ShopeePay', desc: 'Thanh toán siêu tốc qua ví điện tử', icon: '📱' },
    { id: 'bank', name: 'Chuyển khoản ngân hàng', desc: 'Ưu đãi tặng thêm voucher 20k cho đơn sau', icon: '💸' },
];

export default function CheckoutPage() {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        district: '',
        address: '',
        note: '',
        paymentMethod: 'cod',
        saveInfo: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Payment

    useEffect(() => {
        if (items.length === 0) {
            navigate('/gio-hang');
        }
        window.scrollTo(0, 0);
    }, [items, navigate]);

    const freeShippingThreshold = 500000;
    const shippingFee = totalPrice >= freeShippingThreshold ? 0 : 30000;
    const grandTotal = totalPrice + shippingFee;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.address) {
            toast.error('Vui lòng điền đầy đủ thông tin giao hàng!');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await orderService.createOrder({
                ...formData,
                items,
            });

            clearCart();
            toast.success(response.message || 'Đặt hàng thành công!', {
                duration: 5000,
                icon: '☕',
            });
            navigate('/dat-hang-thanh-cong', {
                state: {
                    orderId: response.data?.orderId,
                    total: grandTotal,
                    customer: formData.fullName
                }
            });
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            toast.error(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-cream min-h-screen pt-40 pb-32">
            <div className="container px-4">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-reveal">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">
                            <Link to="/" className="hover:text-secondary opacity-50 transition-colors">Cửa hàng</Link>
                            <ChevronRight size={10} strokeWidth={4} className="opacity-30" />
                            <Link to="/gio-hang" className="hover:text-secondary opacity-50 transition-colors">Giỏ hàng</Link>
                            <ChevronRight size={10} strokeWidth={4} className="opacity-30" />
                            <span className="text-primary truncate">Thanh toán hỏa tốc</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-primary leading-none uppercase italic tracking-tighter">
                            Thanh Toán <span className="text-secondary italic font-light lowercase font-serif">Checkout</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-10 opacity-30 grayscale blur-[0.5px]">
                        <ShieldCheck size={32} />
                        <Lock size={32} />
                        <CreditCard size={32} />
                    </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Main Checkout Form */}
                    <div className="lg:col-span-7 space-y-12 animate-reveal">

                        {/* Step 1: Info */}
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-premium-lg border border-secondary/5 space-y-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="flex items-center gap-6 border-b border-cream pb-8">
                                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-secondary shadow-lg">
                                    <MapPin size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif font-black text-primary uppercase leading-tight italic">Thông tin người nhận</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted leading-none">Chưa có tài khoản? <Link to="/auth" className="text-secondary underline decoration-secondary/30">Đăng nhập</Link> để nhận ưu đãi sỉ</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        placeholder="Trần Văn A..."
                                        className="input-field py-4"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="09xx xxx xxx"
                                        className="input-field py-4"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Địa chỉ Email (Nhận hóa đơn)</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@gmail.com..."
                                    className="input-field py-4"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Thành phố / Tỉnh</label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Gõ tên Tỉnh/Thành..."
                                            className="input-field py-4"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Quận / Huyện</label>
                                        <input
                                            type="text"
                                            name="district"
                                            placeholder="Gõ tên Quận/Huyện..."
                                            className="input-field py-4"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Địa chỉ chi tiết *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        placeholder="Số nhà, tên đường, phường/xã..."
                                        className="input-field py-4"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-4">Ghi chú giao hàng (Tùy chọn)</label>
                                    <textarea
                                        name="note"
                                        placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                                        rows="3"
                                        className="input-field py-4 px-6 rounded-3xl"
                                        value={formData.note}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <label className="flex items-center gap-4 group cursor-pointer select-none">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="saveInfo"
                                            className="sr-only"
                                            checked={formData.saveInfo}
                                            onChange={handleInputChange}
                                        />
                                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${formData.saveInfo ? 'bg-secondary border-secondary rotate-6' : 'bg-cream border-secondary/10'}`}>
                                            <CheckCircle2 size={16} className={`text-primary transition-opacity ${formData.saveInfo ? 'opacity-100' : 'opacity-0'}`} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors mt-1 italic">Sử dụng thông tin này cho đơn hàng sau</span>
                                </label>
                            </div>
                        </div>

                        {/* Step 2: Payment */}
                        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-premium-lg border border-secondary/5 space-y-12">
                            <div className="flex items-center gap-6 border-b border-cream pb-8">
                                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-lg">
                                    <CreditCard size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif font-black text-primary uppercase leading-tight italic">Phương thức thanh toán</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted leading-none">An toàn - Bảo mật - Đa dạng hình thức</p>
                                </div>
                            </div>

                            <div className="grid gap-6">
                                {PAYMENT_METHODS.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:bg-cream/50 ${formData.paymentMethod === method.id ? 'border-secondary bg-cream shadow-lg scale-[1.02]' : 'border-cream bg-white grayscale hover:grayscale-0'}`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                className="sr-only"
                                                checked={formData.paymentMethod === method.id}
                                                onChange={handleInputChange}
                                            />
                                            <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${formData.paymentMethod === method.id ? 'bg-secondary border-secondary' : 'bg-white border-secondary/10'}`}>
                                                <div className={`w-2 h-2 rounded-full bg-primary transition-all ${formData.paymentMethod === method.id ? 'scale-100' : 'scale-0'}`} />
                                            </div>
                                        </div>
                                        <div className="text-[2.5rem] leading-none mb-1 group-hover:rotate-12 transition-transform">{method.icon}</div>
                                        <div className="flex-1 space-y-1">
                                            <div className={`text-sm font-serif font-black uppercase tracking-tight italic ${formData.paymentMethod === method.id ? 'text-primary' : 'text-text-muted opacity-50'}`}>
                                                {method.name}
                                            </div>
                                            <div className="text-[10px] font-medium text-text-secondary leading-relaxed opacity-60">
                                                {method.desc}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-cream/50 rounded-3xl border border-secondary/10 flex items-start gap-4">
                                <Info size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted leading-relaxed italic">
                                    Lưu ý: Bạn chỉ cần trả đúng số tiền trên hóa đơn (đã bao gồm phí vận chuyển nếu có). Không cần trả thêm bất kỳ khoản phí nào khác cho đơn hàng.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-5 sticky top-32 space-y-12 shrink-0 animate-reveal [animation-delay:200ms]">
                        <div className="bg-primary rounded-[3.5rem] p-12 text-cream shadow-[0_30px_80px_rgba(44,24,16,0.3)] relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 flex flex-col h-full space-y-10">
                                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                    <h2 className="text-3xl font-serif font-black italic tracking-tight leading-none uppercase">Đơn Hàng <Link to="/gio-hang" className="text-sm font-black text-secondary lowercase font-sans opacity-50 hover:opacity-100 transition-opacity ml-2">Sửa</Link></h2>
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                        <ShoppingBag size={14} className="text-secondary" />
                                        <span className="text-sm font-black">{totalItems} món</span>
                                    </div>
                                </div>

                                {/* Items Preview */}
                                <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar-light pr-4">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.variantLabel}`} className="flex gap-5 group animate-in slide-in-from-right-4 duration-500">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <h4 className="text-xs font-serif font-black text-cream opacity-80 line-clamp-1 italic uppercase tracking-tight group-hover:text-secondary transition-colors leading-tight">
                                                    {item.name}
                                                </h4>
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-[10px] font-black uppercase text-cream/30 tracking-widest">{item.variantLabel} x{item.quantity}</span>
                                                    <span className="text-sm font-serif font-black tracking-tight">{formatPrice(item.price * item.quantity)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6 pt-10 border-t border-white/5">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Tạm tính:</span>
                                        <span className="text-lg font-black tracking-tight">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Vận chuyển:</span>
                                        <span className={`text-sm font-black tracking-tight ${shippingFee === 0 ? 'text-secondary animate-reveal' : ''}`}>
                                            {shippingFee === 0 ? 'MIỄN PHÍ' : formatPrice(shippingFee)}
                                        </span>
                                    </div>

                                    <div className="w-full h-px bg-white/5" />

                                    <div className="flex justify-between items-end px-2">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Tổng thanh toán</span>
                                            <p className="text-[8px] font-bold text-cream/20 uppercase tracking-widest leading-none">Chuyển sang bước tiếp theo</p>
                                        </div>
                                        <div className="text-5xl font-serif font-black italic tracking-tighter text-right">
                                            {formatPrice(grandTotal)}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-secondary w-full py-6 text-base flex items-center justify-center gap-4 shadow-[0_20px_60px_rgba(212,163,115,0.4)] hover:scale-105 active:scale-95 transition-all group overflow-hidden relative disabled:opacity-50 disabled:scale-100 disabled:group-hover:translate-x-0"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-4">
                                                <div className="w-5 h-5 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                <span className="font-black uppercase tracking-widest">Đang xử lý...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="relative z-10 font-black uppercase tracking-[0.2em]">Hoàn tất đặt hàng</span>
                                                <ArrowRight className="relative z-10 group-hover:translate-x-3 transition-transform duration-500" size={24} strokeWidth={3} />
                                            </>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 translate-x-full group-hover:translate-x-0 transition-transform duration-[2000ms] linear" />
                                    </button>

                                    <Link
                                        to="/gio-hang"
                                        className="w-full flex items-center justify-center py-4 text-[9px] font-black uppercase tracking-widest text-cream/30 hover:text-secondary transition-colors group"
                                    >
                                        <ArrowLeft size={10} className="mr-2 opacity-50 group-hover:mr-4 transition-all" strokeWidth={4} />
                                        Quay lại giỏ hàng
                                    </Link>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-8 py-6 border-t border-white/5">
                                    <div className="flex flex-col items-center gap-2 group cursor-help text-center">
                                        <Truck size={24} className="text-secondary group-hover:scale-120 transition-transform" />
                                        <span className="text-[8px] font-black uppercase opacity-30 tracking-widest leading-none">Vận chuyển <br /> toàn quốc</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col items-center gap-2 group cursor-help text-center">
                                        <ShieldCheck size={24} className="text-secondary group-hover:scale-120 transition-transform" />
                                        <span className="text-[8px] font-black uppercase opacity-30 tracking-widest leading-none">Bảo mật <br /> thanh toán</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col items-center gap-2 group cursor-help text-center">
                                        <Coffee size={24} className="text-secondary group-hover:scale-120 transition-transform" />
                                        <span className="text-[8px] font-black uppercase opacity-30 tracking-widest leading-none">Nông sản <br /> sạch 100%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-white/50 rounded-[3rem] border border-secondary/5 space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Clock size={24} className="text-secondary" />
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Thời gian giao hàng dự kiến</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white rounded-3xl border border-cream space-y-2">
                                    <div className="text-[10px] font-black uppercase text-secondary tracking-widest">Phú Yên / Nội tỉnh</div>
                                    <div className="text-2xl font-serif font-black text-primary italic leading-none">24 Giờ</div>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border border-cream space-y-2">
                                    <div className="text-[10px] font-black uppercase text-secondary tracking-widest">Toàn quốc</div>
                                    <div className="text-2xl font-serif font-black text-primary italic leading-none">2-4 Ngày</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Security Banner */}
            <section className="mt-40 border-t border-secondary/5 pt-20 pb-10">
                <div className="container px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-16 opacity-30 grayscale blur-[0.2px]">
                        <div className="flex items-center gap-4">
                            <Lock size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">SSL SECURE PAYMENT</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ShieldCheck size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">PCIDSS COMPLIANT</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Clock size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">24/7 SUPPORT AVAILABLE</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
