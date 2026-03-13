import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import contactService from '../../services/contactService';
import toast from 'react-hot-toast';
import './ContactPage.css';

const CONTACT_INFO = [
    {
        icon: <Phone size={22} />,
        title: 'Điện thoại / Zalo',
        lines: ['0826 487 948', '(Thứ 2 – Thứ 7: 8:00 – 18:00)'],
        action: { href: 'tel:0826487948', label: 'Gọi ngay' },
    },
    {
        icon: <Mail size={22} />,
        title: 'Email',
        lines: ['chaobuoi@nongsan.vn', 'Phản hồi trong 24 giờ'],
        action: { href: 'mailto:chaobuoi@nongsan.vn', label: 'Gửi email' },
    },
    {
        icon: <MapPin size={22} />,
        title: 'Địa chỉ',
        lines: ['123 Nguyễn Văn Linh,', 'TP. Tuy Hòa, Phú Yên'],
        action: { href: 'https://maps.google.com', label: 'Xem bản đồ', external: true },
    },
    {
        icon: <Clock size={22} />,
        title: 'Giờ làm việc',
        lines: ['Thứ 2 – Thứ 7: 8:00 – 18:00', 'Chủ nhật: 8:00 – 12:00'],
    },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
        if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ';
        if (!form.message.trim()) e.message = 'Vui lòng nhập nội dung';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            await contactService.sendMessage(form);
            setSubmitted(true);
            toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi trong 24 giờ. ✓');
        } catch (error) {
            const errMsg = error.response?.data?.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.';
            toast.error(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <div className="container">
                    <span className="section-label">Liên hệ</span>
                    <h1 className="contact-hero-title">Chúng Tôi Luôn<br />Sẵn Sàng Hỗ Trợ</h1>
                    <p className="contact-hero-subtitle">
                        Có câu hỏi về sản phẩm, đơn hàng hay muốn đặt hàng số lượng lớn?
                        Đừng ngại liên hệ — chúng tôi sẽ phản hồi sớm nhất!
                    </p>
                </div>
            </section>

            <div className="container contact-container">
                {/* Contact cards */}
                <div className="contact-cards">
                    {CONTACT_INFO.map((info, i) => (
                        <div key={i} className="contact-card">
                            <div className="contact-card-icon">{info.icon}</div>
                            <h3 className="contact-card-title">{info.title}</h3>
                            {info.lines.map((line, j) => (
                                <p key={j} className="contact-card-line">{line}</p>
                            ))}
                            {info.action && (
                                <a
                                    href={info.action.href}
                                    className="btn btn-outline btn-sm contact-action-btn"
                                    target={info.action.external ? '_blank' : undefined}
                                    rel={info.action.external ? 'noopener noreferrer' : undefined}
                                >
                                    {info.action.label}
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Main area: form + map */}
                <div className="contact-main">
                    {/* Contact form */}
                    <div className="contact-form-wrap">
                        <h2 className="contact-form-title">Gửi Tin Nhắn</h2>
                        <p className="contact-form-subtitle">Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong 24 giờ.</p>

                        {submitted ? (
                            <div className="contact-success">
                                <CheckCircle size={48} className="contact-success-icon" />
                                <h3>Đã gửi thành công!</h3>
                                <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong 24 giờ làm việc.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }); }}
                                    id="send-another-btn"
                                >
                                    Gửi tin nhắn khác
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contact-name" className="form-label">Họ và tên *</label>
                                        <input
                                            type="text"
                                            id="contact-name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Nguyễn Văn A"
                                            className={`form-input ${errors.name ? 'error' : ''}`}
                                            autoComplete="name"
                                        />
                                        {errors.name && <span className="form-error">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contact-phone" className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            id="contact-phone"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="0912 345 678"
                                            className={`form-input ${errors.phone ? 'error' : ''}`}
                                            autoComplete="tel"
                                        />
                                        {errors.phone && <span className="form-error">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-email" className="form-label">Email (không bắt buộc)</label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        autoComplete="email"
                                    />
                                    {errors.email && <span className="form-error">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-subject" className="form-label">Chủ đề</label>
                                    <select
                                        id="contact-subject"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        className="form-input form-select"
                                    >
                                        <option value="">-- Chọn chủ đề --</option>
                                        <option value="order">Hỏi về đơn hàng</option>
                                        <option value="product">Hỏi về sản phẩm</option>
                                        <option value="wholesale">Đặt hàng số lượng lớn</option>
                                        <option value="complaint">Phản ánh, khiếu nại</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-message" className="form-label">Nội dung *</label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                        className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                                        rows={5}
                                    />
                                    {errors.message && <span className="form-error">{errors.message}</span>}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg contact-submit-btn"
                                    disabled={isSubmitting}
                                    id="contact-submit-btn"
                                >
                                    {isSubmitting ? (
                                        <><span className="spinner" /> Đang gửi...</>
                                    ) : (
                                        <><Send size={16} /> Gửi tin nhắn</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Map */}
                    <div className="contact-map-wrap">
                        <h2 className="contact-form-title">Tìm Chúng Tôi</h2>
                        <p className="contact-form-subtitle">Văn phòng chính tại TP. Tuy Hòa, Phú Yên</p>
                        <div className="contact-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3906.0001820906376!2d109.31753207494003!3d13.095461987204116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3170101dce15dc09%3A0x8bf34c6d18a46d1d!2zVGh1w6IgSMOyYSwgUGjDuiBZw6pu!5e0!3m2!1svi!2svn!4v1706000000000!5m2!1svi!2svn"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Bản đồ Nông Sản Phú Yên"
                            />
                        </div>
                        <div className="contact-map-info">
                            <MapPin size={16} />
                            <span>123 Nguyễn Văn Linh, TP. Tuy Hòa, Phú Yên</span>
                        </div>
                    </div>
                </div>

                {/* Wholesale CTA */}
                <div className="contact-wholesale">
                    <div className="contact-wholesale-content">
                        <span className="contact-wholesale-icon">🏪</span>
                        <div>
                            <h3>Đặt hàng số lượng lớn / Đại lý</h3>
                            <p>Bạn là quán cà phê, nhà hàng hoặc muốn trở thành đại lý phân phối? Liên hệ ngay để được hỗ trợ giá đặc biệt và chương trình đại lý!</p>
                        </div>
                    </div>
                    <a href="tel:0826487948" className="btn btn-primary btn-lg" id="wholesale-call-btn">
                        <Phone size={18} />
                        Gọi ngay tư vấn
                    </a>
                </div>
            </div>
        </main>
    );
}
