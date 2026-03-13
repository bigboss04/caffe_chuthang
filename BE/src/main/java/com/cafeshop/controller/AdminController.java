package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.model.ContactMessage;
import com.cafeshop.model.Order;
import com.cafeshop.model.Product;
import com.cafeshop.repository.ContactMessageRepository;
import com.cafeshop.repository.OrderRepository;
import com.cafeshop.repository.ProductRepository;
import com.cafeshop.repository.CategoryRepository;
import com.cafeshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ContactMessageRepository contactRepo;
    private final CategoryRepository categoryRepository;
    private final OrderService orderService;

    // ==================== DASHBOARD ====================

    /**
     * GET /api/admin/dashboard
     * Lấy thống kê tổng quan cho admin dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        Map<String, Object> stats = new LinkedHashMap<>();

        // Orders stats
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.findAll().stream()
                .filter(o -> "PENDING".equals(o.getStatus())).count();
        long confirmedOrders = orderRepository.findAll().stream()
                .filter(o -> "CONFIRMED".equals(o.getStatus())).count();
        long shippingOrders = orderRepository.findAll().stream()
                .filter(o -> "SHIPPING".equals(o.getStatus())).count();
        long deliveredOrders = orderRepository.findAll().stream()
                .filter(o -> "DELIVERED".equals(o.getStatus())).count();
        long cancelledOrders = orderRepository.findAll().stream()
                .filter(o -> "CANCELLED".equals(o.getStatus())).count();

        // Revenue
        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .map(Order::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Today's orders
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long todayOrders = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt().isAfter(startOfDay)).count();

        BigDecimal todayRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt().isAfter(startOfDay) && !"CANCELLED".equals(o.getStatus()))
                .map(Order::getGrandTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Products & contacts
        long totalProducts = productRepository.count();
        long totalContacts = contactRepo.count();
        long unreadContacts = contactRepo.findAll().stream()
                .filter(c -> !Boolean.TRUE.equals(c.getRead())).count();

        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("confirmedOrders", confirmedOrders);
        stats.put("shippingOrders", shippingOrders);
        stats.put("deliveredOrders", deliveredOrders);
        stats.put("cancelledOrders", cancelledOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("todayOrders", todayOrders);
        stats.put("todayRevenue", todayRevenue);
        stats.put("totalProducts", totalProducts);
        stats.put("totalContacts", totalContacts);
        stats.put("unreadContacts", unreadContacts);

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // ==================== ORDERS ====================

    /**
     * GET /api/admin/orders?page=0&size=20&status=PENDING
     * Lấy danh sách đơn hàng (phân trang + filter)
     */
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Page<Order>>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orders;

        if (status != null && !status.isEmpty() && !"ALL".equals(status)) {
            orders = orderRepository.findByStatus(status, pageRequest);
        } else {
            orders = orderRepository.findAll(pageRequest);
        }

        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    /**
     * GET /api/admin/orders/{orderId}
     * Chi tiết đơn hàng
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderDetail(@PathVariable String orderId) {
        Order order = orderService.getOrderByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    /**
     * PUT /api/admin/orders/{orderId}/status?status=CONFIRMED
     * Cập nhật trạng thái đơn hàng
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        Order updated = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", updated));
    }

    // ==================== CONTACTS ====================

    /**
     * GET /api/admin/contacts?page=0&size=20
     * Lấy danh sách tin nhắn liên hệ
     */
    @GetMapping("/contacts")
    public ResponseEntity<ApiResponse<Page<ContactMessage>>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ContactMessage> contacts = contactRepo.findAll(pageRequest);
        return ResponseEntity.ok(ApiResponse.ok(contacts));
    }

    /**
     * PUT /api/admin/contacts/{id}/read
     * Đánh dấu tin nhắn đã đọc
     */
    @PutMapping("/contacts/{id}/read")
    public ResponseEntity<ApiResponse<ContactMessage>> markAsRead(@PathVariable Long id) {
        ContactMessage msg = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        msg.setRead(true);
        ContactMessage saved = contactRepo.save(msg);
        return ResponseEntity.ok(ApiResponse.ok("Đã đánh dấu đã đọc", saved));
    }

    /**
     * DELETE /api/admin/contacts/{id}
     * Xóa tin nhắn liên hệ
     */
    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long id) {
        contactRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa tin nhắn", null));
    }

    // ==================== PRODUCTS ====================

    /**
     * GET /api/admin/products
     * Lấy danh sách sản phẩm cho admin
     */
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(products));
    }
}
