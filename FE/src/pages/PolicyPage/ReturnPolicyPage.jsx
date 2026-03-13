import { Link } from 'react-router-dom';
import './PolicyPage.css';

export default function ReturnPolicyPage() {
    return (
        <main className="policy-page">
            <div className="policy-hero">
                <div className="container">
                    <span className="section-label">Pháp lý</span>
                    <h1 className="policy-title">Chính Sách Đổi Trả</h1>
                    <p className="policy-updated">Cập nhật lần cuối: 01/01/2026</p>
                </div>
            </div>

            <div className="container policy-container">
                <div className="policy-layout">
                    {/* TOC */}
                    <aside className="policy-toc">
                        <h3>Mục lục</h3>
                        <nav>
                            <a href="#commit">Cam kết của chúng tôi</a>
                            <a href="#return-conditions">Điều kiện đổi trả</a>
                            <a href="#non-return">Trường hợp không được đổi trả</a>
                            <a href="#process">Quy trình đổi trả</a>
                            <a href="#refund">Hoàn tiền</a>
                            <a href="#shipping-damaged">Hàng thất lạc / Hư hỏng</a>
                            <a href="#contact">Liên hệ hỗ trợ</a>
                        </nav>
                    </aside>

                    <article className="policy-content">
                        <div className="policy-highlight-box">
                            <span className="policy-highlight-icon">🛡️</span>
                            <div>
                                <strong>Cam kết 7 ngày đổi trả dễ dàng</strong>
                                <p>Chúng tôi cam kết đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm không đúng mô tả hoặc có lỗi từ nhà sản xuất.</p>
                            </div>
                        </div>

                        <section id="commit">
                            <h2>Cam Kết Của Chúng Tôi</h2>
                            <p>Tại Nông Sản Phú Yên, chúng tôi cam kết cung cấp sản phẩm chất lượng cao, đúng mô tả. Nếu vì bất kỳ lý do nào bạn không hài lòng, chúng tôi sẵn sàng hỗ trợ:</p>
                            <div className="policy-cards-row">
                                <div className="policy-mini-card">
                                    <span>📦</span>
                                    <strong>7 ngày</strong>
                                    <small>Đổi trả</small>
                                </div>
                                <div className="policy-mini-card">
                                    <span>💸</span>
                                    <strong>Hoàn tiền</strong>
                                    <small>3-5 ngày làm việc</small>
                                </div>
                                <div className="policy-mini-card">
                                    <span>🚚</span>
                                    <strong>Miễn phí</strong>
                                    <small>Phí đổi trả (lỗi của chúng tôi)</small>
                                </div>
                            </div>
                        </section>

                        <section id="return-conditions">
                            <h2>Điều Kiện Được Đổi Trả</h2>
                            <p>Sản phẩm được chấp nhận đổi trả khi đáp ứng đủ các điều kiện sau:</p>
                            <ul>
                                <li>✅ Còn trong thời hạn 7 ngày kể từ ngày nhận hàng</li>
                                <li>✅ Sản phẩm còn nguyên vẹn, chưa mở niêm phong</li>
                                <li>✅ Còn đầy đủ bao bì gốc và nhãn dán</li>
                                <li>✅ Có ảnh chụp rõ ràng về tình trạng sản phẩm</li>
                                <li>✅ Có mã đơn hàng hoặc hóa đơn mua hàng</li>
                            </ul>

                            <h3>Lý do được chấp nhận đổi trả:</h3>
                            <ul>
                                <li>Sản phẩm không đúng với mô tả trên website</li>
                                <li>Sản phẩm bị lỗi hoặc hư hỏng trong quá trình vận chuyển</li>
                                <li>Giao sai sản phẩm (màu, kích cỡ, quy cách)</li>
                                <li>Sản phẩm đã hết hạn sử dụng tại thời điểm nhận hàng</li>
                                <li>Bao bì bị hư hỏng nặng ảnh hưởng đến chất lượng sản phẩm</li>
                            </ul>
                        </section>

                        <section id="non-return">
                            <h2>Trường Hợp Không Được Đổi Trả</h2>
                            <ul>
                                <li>❌ Quá 7 ngày kể từ ngày nhận hàng</li>
                                <li>❌ Sản phẩm đã được mở niêm phong và sử dụng một phần</li>
                                <li>❌ Sản phẩm bị hư hỏng do lỗi của người dùng (bảo quản sai, rơi vỡ)</li>
                                <li>❌ Không có bằng chứng hình ảnh về tình trạng sản phẩm</li>
                                <li>❌ Sản phẩm mua theo chương trình khuyến mãi đặc biệt (có ghi rõ trong điều kiện ưu đãi)</li>
                            </ul>
                        </section>

                        <section id="process">
                            <h2>Quy Trình Đổi Trả</h2>
                            <div className="policy-steps">
                                <div className="policy-step">
                                    <div className="policy-step-num">1</div>
                                    <div>
                                        <strong>Liên hệ chúng tôi</strong>
                                        <p>Gọi điện hoặc nhắn tin Zalo 0912 345 678 (hoặc email) trong vòng 7 ngày. Cung cấp mã đơn hàng và mô tả vấn đề.</p>
                                    </div>
                                </div>
                                <div className="policy-step">
                                    <div className="policy-step-num">2</div>
                                    <div>
                                        <strong>Gửi hình ảnh</strong>
                                        <p>Chụp ảnh rõ ràng về sản phẩm và tình trạng hư hỏng/sai sót, gửi qua Zalo hoặc email.</p>
                                    </div>
                                </div>
                                <div className="policy-step">
                                    <div className="policy-step-num">3</div>
                                    <div>
                                        <strong>Xác nhận & hướng dẫn</strong>
                                        <p>Trong 24 giờ làm việc, chúng tôi xác nhận và hướng dẫn bạn gửi hàng về hoặc giữ lại (tùy trường hợp).</p>
                                    </div>
                                </div>
                                <div className="policy-step">
                                    <div className="policy-step-num">4</div>
                                    <div>
                                        <strong>Xử lý đổi/hoàn tiền</strong>
                                        <p>Sau khi nhận và kiểm tra hàng hoàn, chúng tôi gửi hàng đổi mới hoặc hoàn tiền trong 3-5 ngày làm việc.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="refund">
                            <h2>Chính Sách Hoàn Tiền</h2>
                            <p>Trong trường hợp sản phẩm hết hàng hoặc khách không muốn đổi hàng mới:</p>
                            <ul>
                                <li><strong>Chuyển khoản / MoMo / Ví điện tử:</strong> Hoàn tiền trong 3-5 ngày làm việc</li>
                                <li><strong>COD (tiền mặt):</strong> Chuyển khoản lại trong 3-5 ngày làm việc sau khi xử lý</li>
                                <li>Phí vận chuyển chỉ được hoàn nếu lỗi do phía chúng tôi</li>
                            </ul>
                        </section>

                        <section id="shipping-damaged">
                            <h2>Hàng Thất Lạc / Hư Hỏng Trong Vận Chuyển</h2>
                            <p>
                                Nếu hàng bị thất lạc hoặc hư hỏng trong quá trình vận chuyển, chúng tôi chịu hoàn toàn trách nhiệm
                                và sẽ gửi hàng thay thế hoặc hoàn tiền 100% bao gồm phí vận chuyển.
                            </p>
                            <p className="policy-note">
                                ⚠️ Vui lòng <strong>quay video</strong> khi mở kiện hàng để có bằng chứng trong trường hợp cần thiết.
                            </p>
                        </section>

                        <section id="contact">
                            <h2>Liên Hệ Hỗ Trợ Đổi Trả</h2>
                            <div className="policy-contact-info">
                                <p>📞 Hotline / Zalo: <a href="tel:0912345678">0912 345 678</a> (8:00 – 18:00, Thứ 2 – Thứ 7)</p>
                                <p>📧 Email: <a href="mailto:chaobuoi@nongsan.vn">chaobuoi@nongsan.vn</a></p>
                            </div>
                            <p>Chúng tôi cam kết phản hồi trong vòng <strong>24 giờ làm việc</strong> và xử lý mọi yêu cầu một cách nhanh chóng và công bằng.</p>
                        </section>

                        <div className="policy-footer-nav">
                            <Link to="/chinh-sach-bao-mat" className="btn btn-outline">
                                Xem Chính sách Bảo mật →
                            </Link>
                            <Link to="/lien-he" className="btn btn-primary">
                                Liên hệ hỗ trợ
                            </Link>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
