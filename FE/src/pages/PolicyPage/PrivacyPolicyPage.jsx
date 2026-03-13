import { Link } from 'react-router-dom';
import './PolicyPage.css';

export default function PrivacyPolicyPage() {
    return (
        <main className="policy-page">
            <div className="policy-hero">
                <div className="container">
                    <span className="section-label">Pháp lý</span>
                    <h1 className="policy-title">Chính Sách Bảo Mật</h1>
                    <p className="policy-updated">Cập nhật lần cuối: 01/01/2026</p>
                </div>
            </div>

            <div className="container policy-container">
                <div className="policy-layout">
                    {/* TOC */}
                    <aside className="policy-toc">
                        <h3>Mục lục</h3>
                        <nav>
                            <a href="#section-1">1. Thông tin chúng tôi thu thập</a>
                            <a href="#section-2">2. Cách sử dụng thông tin</a>
                            <a href="#section-3">3. Bảo vệ thông tin</a>
                            <a href="#section-4">4. Chia sẻ thông tin với bên thứ ba</a>
                            <a href="#section-5">5. Cookie</a>
                            <a href="#section-6">6. Quyền của bạn</a>
                            <a href="#section-7">7. Liên hệ</a>
                        </nav>
                    </aside>

                    {/* Content */}
                    <article className="policy-content">
                        <p className="policy-intro">
                            Chúng tôi – <strong>Nông Sản Phú Yên</strong> – cam kết bảo vệ quyền riêng tư của bạn.
                            Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn
                            khi bạn sử dụng website và dịch vụ của chúng tôi.
                        </p>

                        <section id="section-1">
                            <h2>1. Thông tin chúng tôi thu thập</h2>
                            <p>Chúng tôi chỉ thu thập những thông tin cần thiết để xử lý đơn hàng và cải thiện dịch vụ:</p>
                            <ul>
                                <li><strong>Thông tin liên hệ:</strong> Họ tên, số điện thoại, địa chỉ email</li>
                                <li><strong>Địa chỉ giao hàng:</strong> Địa chỉ cụ thể để vận chuyển đơn hàng</li>
                                <li><strong>Thông tin đặt hàng:</strong> Sản phẩm đã mua, lịch sử đơn hàng</li>
                                <li><strong>Dữ liệu sử dụng:</strong> Thông tin duyệt web được thu thập tự động (cookie, IP)</li>
                            </ul>
                        </section>

                        <section id="section-2">
                            <h2>2. Cách sử dụng thông tin</h2>
                            <p>Thông tin bạn cung cấp được sử dụng để:</p>
                            <ul>
                                <li>Xử lý và giao đơn hàng của bạn</li>
                                <li>Xác nhận đặt hàng qua điện thoại hoặc email</li>
                                <li>Giải quyết khiếu nại và hỗ trợ khách hàng</li>
                                <li>Gửi thông tin về sản phẩm mới và ưu đãi (nếu bạn đã đồng ý nhận)</li>
                                <li>Cải thiện trải nghiệm người dùng trên website</li>
                            </ul>
                            <p className="policy-note">
                                ⚠️ Chúng tôi <strong>không</strong> bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại.
                            </p>
                        </section>

                        <section id="section-3">
                            <h2>3. Bảo vệ thông tin</h2>
                            <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức thích hợp để bảo vệ thông tin của bạn:</p>
                            <ul>
                                <li>Truyền dữ liệu qua kết nối HTTPS được mã hóa SSL/TLS</li>
                                <li>Lưu trữ mật khẩu được mã hóa bằng bcrypt</li>
                                <li>Giới hạn quyền truy cập nội bộ theo nguyên tắc tối thiểu quyền</li>
                                <li>Kiểm tra bảo mật định kỳ</li>
                            </ul>
                        </section>

                        <section id="section-4">
                            <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
                            <p>Chúng tôi có thể chia sẻ thông tin cần thiết với:</p>
                            <ul>
                                <li><strong>Đơn vị vận chuyển:</strong> Tên, số điện thoại, địa chỉ để giao hàng</li>
                                <li><strong>Cổng thanh toán:</strong> Thông tin giao dịch (xử lý bởi bên thứ ba như MoMo, ngân hàng)</li>
                                <li><strong>Cơ quan pháp lý:</strong> Khi có yêu cầu hợp pháp từ cơ quan nhà nước</li>
                            </ul>
                        </section>

                        <section id="section-5">
                            <h2>5. Cookie</h2>
                            <p>
                                Website sử dụng cookie để cải thiện trải nghiệm. Cookie là các tệp nhỏ được lưu trên
                                thiết bị của bạn. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số
                                tính năng của website có thể không hoạt động đúng.
                            </p>
                            <p>Chúng tôi sử dụng cookie cho:</p>
                            <ul>
                                <li>Lưu trữ giỏ hàng của bạn giữa các phiên</li>
                                <li>Ghi nhớ tùy chọn ngôn ngữ và hiển thị</li>
                                <li>Phân tích lưu lượng (Google Analytics ẩn danh)</li>
                            </ul>
                        </section>

                        <section id="section-6">
                            <h2>6. Quyền của bạn</h2>
                            <p>Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
                            <ul>
                                <li><strong>Quyền truy cập:</strong> Yêu cầu bản sao thông tin chúng tôi lưu về bạn</li>
                                <li><strong>Quyền chỉnh sửa:</strong> Cập nhật thông tin không chính xác</li>
                                <li><strong>Quyền xóa:</strong> Yêu cầu xóa dữ liệu cá nhân (trong phạm vi pháp lý cho phép)</li>
                                <li><strong>Quyền phản đối:</strong> Từ chối nhận email marketing bất kỳ lúc nào</li>
                            </ul>
                        </section>

                        <section id="section-7">
                            <h2>7. Liên hệ về Bảo mật</h2>
                            <p>Nếu bạn có câu hỏi hoặc lo ngại về chính sách bảo mật, vui lòng liên hệ:</p>
                            <div className="policy-contact-info">
                                <p>📧 Email: <a href="mailto:chaobuoi@nongsan.vn">chaobuoi@nongsan.vn</a></p>
                                <p>📞 Điện thoại: <a href="tel:0912345678">0912 345 678</a></p>
                                <p>📍 Địa chỉ: 123 Nguyễn Văn Linh, TP. Tuy Hòa, Phú Yên</p>
                            </div>
                        </section>

                        <div className="policy-footer-nav">
                            <Link to="/chinh-sach-doi-tra" className="btn btn-outline">
                                Xem Chính sách Đổi trả →
                            </Link>
                            <Link to="/lien-he" className="btn btn-primary">
                                Liên hệ chúng tôi
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
