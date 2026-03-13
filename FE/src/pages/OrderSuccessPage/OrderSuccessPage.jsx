import { Link } from 'react-router-dom';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
    return (
        <main className="success-page">
            <div className="container">
                <div className="success-card">
                    <div className="success-animation">
                        <div className="success-circle">
                            <span className="success-check">✓</span>
                        </div>
                    </div>
                    <h1 className="success-title">Đặt Hàng Thành Công!</h1>
                    <p className="success-subtitle">
                        Cảm ơn bạn đã tin tưởng Nông Sản Phú Yên 🌿<br />
                        Chúng tôi sẽ liên hệ xác nhận và giao hàng trong thời gian sớm nhất!
                    </p>
                    <div className="success-info">
                        <div className="success-info-item">
                            <span className="success-info-icon">📦</span>
                            <div>
                                <strong>Thời gian giao hàng</strong>
                                <small>2-5 ngày làm việc</small>
                            </div>
                        </div>
                        <div className="success-info-item">
                            <span className="success-info-icon">📞</span>
                            <div>
                                <strong>Hotline hỗ trợ</strong>
                                <small>0826 487 948</small>
                            </div>
                        </div>
                    </div>
                    <div className="success-actions">
                        <Link to="/" className="btn btn-primary btn-lg" id="back-home-btn">
                            Về trang chủ
                        </Link>
                        <Link to="/san-pham" className="btn btn-outline btn-lg" id="continue-shopping-success-btn">
                            Tiếp tục mua hàng
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
