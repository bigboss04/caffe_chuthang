package com.cafeshop.service;

import com.cafeshop.model.Order;
import com.cafeshop.model.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class OrderEmailService {

    private static final Logger log = LoggerFactory.getLogger(OrderEmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.admin-email}")
    private String adminEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send order notification email to admin asynchronously.
     * This won't block the order creation response.
     */
    @Async
    public void sendOrderNotificationToAdmin(Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("🛒 Đơn hàng mới #" + order.getOrderId() + " - " + order.getFullName());
            helper.setText(buildOrderEmailHtml(order), true);

            mailSender.send(message);
            log.info("✅ Email thông báo đơn hàng #{} đã gửi tới {}", order.getOrderId(), adminEmail);
        } catch (MessagingException e) {
            log.error("❌ Lỗi gửi email thông báo đơn hàng #{}: {}", order.getOrderId(), e.getMessage());
        } catch (Exception e) {
            log.error("❌ Lỗi không xác định khi gửi email: {}", e.getMessage());
        }
    }

    /**
     * Send order confirmation email to customer (if they provided email).
     */
    @Async
    public void sendOrderConfirmationToCustomer(Order order) {
        if (order.getEmail() == null || order.getEmail().isBlank()) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(order.getEmail());
            helper.setSubject("✅ Xác nhận đơn hàng #" + order.getOrderId() + " - Nông Sản Đắk Nông");
            helper.setText(buildCustomerEmailHtml(order), true);

            mailSender.send(message);
            log.info("✅ Email xác nhận đơn hàng #{} đã gửi tới khách {}", order.getOrderId(), order.getEmail());
        } catch (MessagingException e) {
            log.error("❌ Lỗi gửi email xác nhận cho khách: {}", e.getMessage());
        } catch (Exception e) {
            log.error("❌ Lỗi không xác định khi gửi email khách: {}", e.getMessage());
        }
    }

    private String formatCurrency(java.math.BigDecimal amount) {
        NumberFormat nf = NumberFormat.getInstance(new Locale("vi", "VN"));
        return nf.format(amount) + "₫";
    }

    /**
     * Build beautiful HTML email for admin notification.
     */
    private String buildOrderEmailHtml(Order order) {
        StringBuilder itemRows = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            itemRows.append(String.format(
                    """
                            <tr>
                                <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;font-size:14px;color:#2C1810;">
                                    <strong>%s</strong>
                                    %s
                                </td>
                                <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;text-align:center;font-size:14px;color:#6B5744;">%d</td>
                                <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;text-align:right;font-size:14px;color:#2C1810;font-weight:600;">%s</td>
                            </tr>
                            """,
                    item.getProductName(),
                    item.getVariantLabel() != null
                            ? "<br/><span style='font-size:12px;color:#9E8B7A;'>" + item.getVariantLabel() + "</span>"
                            : "",
                    item.getQuantity(),
                    formatCurrency(item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))));
        }

        String orderDate = order.getCreatedAt() != null
                ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "N/A";

        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head><meta charset="UTF-8"></head>
                        <body style="margin:0;padding:0;background:#f5f0e8;font-family:'Segoe UI',Arial,sans-serif;">
                            <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(44,24,16,0.1);margin-top:20px;margin-bottom:20px;">

                                <!-- Header -->
                                <div style="background:linear-gradient(135deg,#2C1810 0%%,#3D2B1F 100%%);padding:32px;text-align:center;">
                                    <div style="font-size:36px;margin-bottom:8px;">☕</div>
                                    <h1 style="color:#D4A373;font-size:24px;margin:0;font-weight:700;">Đơn Hàng Mới!</h1>
                                    <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:8px 0 0;text-transform:uppercase;letter-spacing:2px;">Nông Sản Đắk Nông</p>
                                </div>

                                <!-- Order Info -->
                                <div style="padding:32px;">
                                    <div style="background:#FDF8F0;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #D4A373;">
                                        <table style="width:100%%;border-collapse:collapse;">
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#9E8B7A;">Mã đơn hàng</td>
                                                <td style="padding:4px 0;font-size:15px;color:#2C1810;font-weight:700;text-align:right;">#%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#9E8B7A;">Thời gian</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#9E8B7A;">Thanh toán</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Customer Info -->
                                    <h3 style="font-size:14px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;border-bottom:1px solid #f0ebe3;padding-bottom:8px;">📋 Thông Tin Khách Hàng</h3>
                                    <table style="width:100%%;border-collapse:collapse;margin-bottom:24px;">
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#9E8B7A;width:120px;">Họ tên</td>
                                            <td style="padding:6px 0;font-size:14px;color:#2C1810;font-weight:600;">%s</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#9E8B7A;">Điện thoại</td>
                                            <td style="padding:6px 0;font-size:14px;color:#2C1810;font-weight:600;">%s</td>
                                        </tr>
                                        %s
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#9E8B7A;">Địa chỉ</td>
                                            <td style="padding:6px 0;font-size:14px;color:#2C1810;">%s</td>
                                        </tr>
                                        %s
                                    </table>

                                    <!-- Products -->
                                    <h3 style="font-size:14px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;border-bottom:1px solid #f0ebe3;padding-bottom:8px;">📦 Sản Phẩm</h3>
                                    <table style="width:100%%;border-collapse:collapse;margin-bottom:24px;">
                                        <thead>
                                            <tr style="background:#FDF8F0;">
                                                <th style="padding:10px 16px;text-align:left;font-size:11px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;">Sản phẩm</th>
                                                <th style="padding:10px 16px;text-align:center;font-size:11px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;">SL</th>
                                                <th style="padding:10px 16px;text-align:right;font-size:11px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            %s
                                        </tbody>
                                    </table>

                                    <!-- Totals -->
                                    <div style="background:#FDF8F0;border-radius:12px;padding:16px 20px;">
                                        <table style="width:100%%;border-collapse:collapse;">
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#6B5744;">Tạm tính</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#6B5744;">Phí vận chuyển</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0 0;font-size:16px;color:#2C1810;font-weight:700;border-top:2px solid #D4A373;">💰 TỔNG CỘNG</td>
                                                <td style="padding:8px 0 0;font-size:20px;color:#D4A373;font-weight:700;text-align:right;border-top:2px solid #D4A373;">%s</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>

                                <!-- Footer -->
                                <div style="background:#2C1810;padding:20px;text-align:center;">
                                    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;text-transform:uppercase;letter-spacing:2px;">Nông Sản Đắk Nông — Hương vị cao nguyên</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                order.getOrderId(),
                orderDate,
                order.getPaymentMethod() != null ? order.getPaymentMethod() : "COD",
                order.getFullName(),
                order.getPhone(),
                order.getEmail() != null && !order.getEmail().isBlank()
                        ? "<tr><td style='padding:6px 0;font-size:13px;color:#9E8B7A;'>Email</td><td style='padding:6px 0;font-size:14px;color:#2C1810;'>"
                                + order.getEmail() + "</td></tr>"
                        : "",
                buildAddress(order),
                order.getNote() != null && !order.getNote().isBlank()
                        ? "<tr><td style='padding:6px 0;font-size:13px;color:#9E8B7A;'>Ghi chú</td><td style='padding:6px 0;font-size:14px;color:#D4A373;font-style:italic;'>\""
                                + order.getNote() + "\"</td></tr>"
                        : "",
                itemRows.toString(),
                formatCurrency(order.getSubtotal()),
                order.getShippingFee().compareTo(java.math.BigDecimal.ZERO) == 0 ? "Miễn phí"
                        : formatCurrency(order.getShippingFee()),
                formatCurrency(order.getGrandTotal()));
    }

    /**
     * Build customer confirmation email HTML.
     */
    private String buildCustomerEmailHtml(Order order) {
        StringBuilder itemList = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            itemList.append(String.format(
                    """
                            <tr>
                                <td style="padding:10px 16px;border-bottom:1px solid #f0ebe3;font-size:14px;color:#2C1810;">
                                    %s %s <span style="color:#9E8B7A;">x%d</span>
                                </td>
                                <td style="padding:10px 16px;border-bottom:1px solid #f0ebe3;text-align:right;font-size:14px;color:#2C1810;font-weight:600;">%s</td>
                            </tr>
                            """,
                    item.getProductName(),
                    item.getVariantLabel() != null ? "(" + item.getVariantLabel() + ")" : "",
                    item.getQuantity(),
                    formatCurrency(item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))));
        }

        String orderDate = order.getCreatedAt() != null
                ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "N/A";

        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head><meta charset="UTF-8"></head>
                        <body style="margin:0;padding:0;background:#f5f0e8;font-family:'Segoe UI',Arial,sans-serif;">
                            <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(44,24,16,0.1);margin-top:20px;margin-bottom:20px;">

                                <div style="background:linear-gradient(135deg,#2C1810 0%%,#3D2B1F 100%%);padding:40px 32px;text-align:center;">
                                    <div style="font-size:48px;margin-bottom:12px;">✅</div>
                                    <h1 style="color:#FDF8F0;font-size:22px;margin:0;font-weight:700;">Đặt Hàng Thành Công!</h1>
                                    <p style="color:#D4A373;font-size:14px;margin:12px 0 0;">Cảm ơn bạn đã tin chọn Nông Sản Đắk Nông</p>
                                </div>

                                <div style="padding:32px;">
                                    <p style="font-size:15px;color:#2C1810;line-height:1.6;margin:0 0 20px;">
                                        Xin chào <strong>%s</strong>,<br/>
                                        Đơn hàng <strong style="color:#D4A373;">#%s</strong> của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ xác nhận sớm nhất nhé!
                                    </p>

                                    <!-- Order Info Box -->
                                    <div style="background:#FDF8F0;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #D4A373;">
                                        <table style="width:100%%;border-collapse:collapse;">
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#9E8B7A;">Mã đơn hàng</td>
                                                <td style="padding:4px 0;font-size:15px;color:#2C1810;font-weight:700;text-align:right;">#%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#9E8B7A;">Ngày đặt</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#9E8B7A;">Thanh toán</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Delivery Info -->
                                    <h3 style="font-size:14px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;border-bottom:1px solid #f0ebe3;padding-bottom:8px;">🚚 Thông Tin Giao Hàng</h3>
                                    <table style="width:100%%;border-collapse:collapse;margin-bottom:24px;">
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#9E8B7A;width:120px;">Người nhận</td>
                                            <td style="padding:6px 0;font-size:14px;color:#2C1810;font-weight:600;">%s</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#9E8B7A;">Điện thoại</td>
                                            <td style="padding:6px 0;font-size:14px;color:#2C1810;font-weight:600;">📞 %s</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#9E8B7A;">Địa chỉ</td>
                                            <td style="padding:6px 0;font-size:14px;color:#2C1810;">📍 %s</td>
                                        </tr>
                                        %s
                                    </table>

                                    <!-- Products -->
                                    <h3 style="font-size:14px;color:#9E8B7A;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;border-bottom:1px solid #f0ebe3;padding-bottom:8px;">📦 Chi Tiết Đơn Hàng</h3>
                                    <table style="width:100%%;border-collapse:collapse;margin-bottom:20px;">
                                        %s
                                    </table>

                                    <!-- Totals -->
                                    <div style="background:#FDF8F0;border-radius:12px;padding:16px 20px;">
                                        <table style="width:100%%;border-collapse:collapse;">
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#6B5744;">Tạm tính</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:4px 0;font-size:13px;color:#6B5744;">Phí vận chuyển</td>
                                                <td style="padding:4px 0;font-size:13px;color:#2C1810;text-align:right;">%s</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0 0;font-size:16px;color:#2C1810;font-weight:700;border-top:2px solid #D4A373;">💰 TỔNG CỘNG</td>
                                                <td style="padding:8px 0 0;font-size:20px;color:#D4A373;font-weight:700;text-align:right;border-top:2px solid #D4A373;">%s</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div style="margin-top:24px;padding:16px;border:1px dashed #D4A373;border-radius:12px;text-align:center;">
                                        <p style="font-size:13px;color:#6B5744;margin:0;">Mọi thắc mắc vui lòng liên hệ:<br/>
                                        <strong style="color:#2C1810;">📞 0826 487 948</strong></p>
                                    </div>
                                </div>

                                <div style="background:#2C1810;padding:20px;text-align:center;">
                                    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;text-transform:uppercase;letter-spacing:2px;">Nông Sản Đắk Nông — Hương vị cao nguyên</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                order.getFullName(),
                order.getOrderId(),
                order.getOrderId(),
                orderDate,
                order.getPaymentMethod() != null ? order.getPaymentMethod() : "COD",
                order.getFullName(),
                order.getPhone(),
                buildAddress(order),
                order.getNote() != null && !order.getNote().isBlank()
                        ? "<tr><td style='padding:6px 0;font-size:13px;color:#9E8B7A;'>Ghi chú</td><td style='padding:6px 0;font-size:14px;color:#D4A373;font-style:italic;'>\""
                                + order.getNote() + "\"</td></tr>"
                        : "",
                itemList.toString(),
                formatCurrency(order.getSubtotal()),
                order.getShippingFee().compareTo(java.math.BigDecimal.ZERO) == 0 ? "Miễn phí"
                        : formatCurrency(order.getShippingFee()),
                formatCurrency(order.getGrandTotal()));
    }

    private String buildAddress(Order order) {
        StringBuilder sb = new StringBuilder();
        if (order.getAddress() != null)
            sb.append(order.getAddress());
        if (order.getDistrict() != null && !order.getDistrict().isBlank()) {
            if (sb.length() > 0)
                sb.append(", ");
            sb.append(order.getDistrict());
        }
        if (order.getCity() != null && !order.getCity().isBlank()) {
            if (sb.length() > 0)
                sb.append(", ");
            sb.append(order.getCity());
        }
        return sb.toString();
    }
}
