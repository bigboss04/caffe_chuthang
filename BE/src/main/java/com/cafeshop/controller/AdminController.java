package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.model.*;
import com.cafeshop.repository.*;
import com.cafeshop.service.OrderService;
import com.cafeshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final ContactMessageRepository contactRepo;
        private final CategoryRepository categoryRepository;
        private final CustomerRepository customerRepository;
        private final CouponRepository couponRepository;
        private final ReviewRepository reviewRepository;
        private final ShippingZoneRepository shippingZoneRepository;
        private final SystemSettingRepository systemSettingRepository;
        private final BannerRepository bannerRepository;
        private final OrderService orderService;
        private final ProductService productService;

        // ==================== 1. DASHBOARD ====================

        @GetMapping("/dashboard")
        public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
                Map<String, Object> stats = new LinkedHashMap<>();

                List<Order> allOrders = orderRepository.findAll();
                long totalOrders = allOrders.size();
                long pendingOrders = allOrders.stream().filter(o -> "PENDING".equals(o.getStatus())).count();
                long confirmedOrders = allOrders.stream().filter(o -> "CONFIRMED".equals(o.getStatus())).count();
                long shippingOrders = allOrders.stream().filter(o -> "SHIPPING".equals(o.getStatus())).count();
                long deliveredOrders = allOrders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();
                long cancelledOrders = allOrders.stream().filter(o -> "CANCELLED".equals(o.getStatus())).count();

                BigDecimal totalRevenue = allOrders.stream()
                                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                                .map(Order::getGrandTotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
                long todayOrders = allOrders.stream().filter(o -> o.getCreatedAt().isAfter(startOfDay)).count();
                BigDecimal todayRevenue = allOrders.stream()
                                .filter(o -> o.getCreatedAt().isAfter(startOfDay) && !"CANCELLED".equals(o.getStatus()))
                                .map(Order::getGrandTotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                long totalProducts = productRepository.count();
                long totalCustomers = customerRepository.count();
                long totalContacts = contactRepo.count();
                long unreadContacts = contactRepo.findAll().stream()
                                .filter(c -> !Boolean.TRUE.equals(c.getRead())).count();

                // Best selling products (top 5 by reviews count as proxy)
                List<Map<String, Object>> bestSellers = productRepository.findAll().stream()
                                .sorted(Comparator.comparing(Product::getReviews).reversed())
                                .limit(5)
                                .map(p -> {
                                        Map<String, Object> m = new LinkedHashMap<>();
                                        m.put("id", p.getId());
                                        m.put("name", p.getName());
                                        m.put("image", p.getImage());
                                        m.put("price", p.getPrice());
                                        m.put("sold", p.getReviews());
                                        m.put("stock", p.getStock());
                                        return m;
                                }).collect(Collectors.toList());

                // Revenue last 7 days
                List<Map<String, Object>> revenueChart = new ArrayList<>();
                for (int i = 6; i >= 0; i--) {
                        LocalDate date = LocalDate.now().minusDays(i);
                        LocalDateTime dayStart = date.atStartOfDay();
                        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
                        BigDecimal dayRevenue = allOrders.stream()
                                        .filter(o -> o.getCreatedAt().isAfter(dayStart)
                                                        && o.getCreatedAt().isBefore(dayEnd)
                                                        && !"CANCELLED".equals(o.getStatus()))
                                        .map(Order::getGrandTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                        long dayCount = allOrders.stream()
                                        .filter(o -> o.getCreatedAt().isAfter(dayStart)
                                                        && o.getCreatedAt().isBefore(dayEnd))
                                        .count();
                        Map<String, Object> day = new LinkedHashMap<>();
                        day.put("date", date.toString());
                        day.put("revenue", dayRevenue);
                        day.put("orders", dayCount);
                        revenueChart.add(day);
                }

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
                stats.put("totalCustomers", totalCustomers);
                stats.put("totalContacts", totalContacts);
                stats.put("unreadContacts", unreadContacts);
                stats.put("bestSellers", bestSellers);
                stats.put("revenueChart", revenueChart);

                return ResponseEntity.ok(ApiResponse.ok(stats));
        }

        // ==================== 2. PRODUCTS CRUD ====================

        @GetMapping("/products")
        public ResponseEntity<ApiResponse<List<Product>>> getProducts() {
                List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
                return ResponseEntity.ok(ApiResponse.ok(products));
        }

        @PostMapping("/products")
        public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
                if (product.getCategory() != null && product.getCategory().getId() != null) {
                        Category cat = categoryRepository.findById(product.getCategory().getId())
                                        .orElseThrow(() -> new RuntimeException("Category not found"));
                        product.setCategory(cat);
                }
                if (product.getVariants() != null) {
                        product.getVariants().forEach(v -> v.setProduct(product));
                }
                Product saved = productRepository.save(product);
                return ResponseEntity.ok(ApiResponse.ok("Thêm sản phẩm thành công", saved));
        }

        @PutMapping("/products/{id}")
        public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id, @RequestBody Product updated) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));

                product.setName(updated.getName());
                product.setSlug(updated.getSlug());
                product.setImage(updated.getImage());
                product.setPrice(updated.getPrice());
                product.setOriginalPrice(updated.getOriginalPrice());
                product.setUnit(updated.getUnit());
                product.setBadge(updated.getBadge());
                product.setBadgeType(updated.getBadgeType());
                product.setDescription(updated.getDescription());
                product.setStock(updated.getStock());
                product.setFeatured(updated.getFeatured());
                product.setIsNew(updated.getIsNew());
                product.setDetails(updated.getDetails());

                if (updated.getGallery() != null) {
                        product.getGallery().clear();
                        product.getGallery().addAll(updated.getGallery());
                }

                if (updated.getCategory() != null && updated.getCategory().getId() != null) {
                        Category cat = categoryRepository.findById(updated.getCategory().getId())
                                        .orElseThrow(() -> new RuntimeException("Category not found"));
                        product.setCategory(cat);
                }

                // Update variants
                if (updated.getVariants() != null) {
                        product.getVariants().clear();
                        updated.getVariants().forEach(v -> {
                                v.setProduct(product);
                                product.getVariants().add(v);
                        });
                }

                Product saved = productRepository.save(product);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật sản phẩm thành công", saved));
        }

        @DeleteMapping("/products/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
                productRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa sản phẩm", null));
        }

        @PutMapping("/products/{id}/toggle")
        public ResponseEntity<ApiResponse<Product>> toggleProduct(@PathVariable Long id) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));
                product.setActive(!Boolean.TRUE.equals(product.getActive()));
                Product saved = productRepository.save(product);
                String msg = saved.getActive() ? "Đã bật sản phẩm" : "Đã tắt sản phẩm";
                return ResponseEntity.ok(ApiResponse.ok(msg, saved));
        }

        @PutMapping("/products/{id}/stock")
        public ResponseEntity<ApiResponse<Product>> updateStock(@PathVariable Long id, @RequestParam Integer stock) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));
                product.setStock(stock);
                Product saved = productRepository.save(product);
                return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật tồn kho", saved));
        }

        // ==================== 3. CATEGORIES CRUD ====================

        @GetMapping("/categories")
        public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
                List<Category> categories = categoryRepository.findAll();
                return ResponseEntity.ok(ApiResponse.ok(categories));
        }

        @PostMapping("/categories")
        public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
                Category saved = categoryRepository.save(category);
                return ResponseEntity.ok(ApiResponse.ok("Thêm danh mục thành công", saved));
        }

        @PutMapping("/categories/{id}")
        public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id,
                        @RequestBody Category updated) {
                Category category = categoryRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Category not found"));
                category.setName(updated.getName());
                category.setSlug(updated.getSlug());
                category.setIcon(updated.getIcon());
                category.setDescription(updated.getDescription());
                category.setImage(updated.getImage());
                if (updated.getActive() != null)
                        category.setActive(updated.getActive());
                Category saved = categoryRepository.save(category);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật danh mục thành công", saved));
        }

        @DeleteMapping("/categories/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
                Category category = categoryRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
                // Check if category has products
                long productCount = productRepository.findAll().stream()
                                .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(id))
                                .count();
                if (productCount > 0) {
                        throw new RuntimeException("Không thể xóa danh mục '" + category.getName()
                                        + "' vì còn " + productCount
                                        + " sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.");
                }
                // Check if category has children
                if (category.getChildren() != null && !category.getChildren().isEmpty()) {
                        throw new RuntimeException("Không thể xóa danh mục '" + category.getName()
                                        + "' vì còn danh mục con.");
                }
                categoryRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa danh mục", null));
        }

        // ==================== 4. ORDERS ====================

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

        @GetMapping("/orders/{orderId}")
        public ResponseEntity<ApiResponse<Order>> getOrderDetail(@PathVariable String orderId) {
                Order order = orderService.getOrderByOrderId(orderId);
                return ResponseEntity.ok(ApiResponse.ok(order));
        }

        @PutMapping("/orders/{orderId}/status")
        public ResponseEntity<ApiResponse<Order>> updateStatus(
                        @PathVariable String orderId,
                        @RequestParam String status) {
                Order updated = orderService.updateOrderStatus(orderId, status);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", updated));
        }

        @DeleteMapping("/orders/{orderId}")
        public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable String orderId) {
                Order order = orderService.getOrderByOrderId(orderId);
                order.setStatus("CANCELLED");
                orderRepository.save(order);
                return ResponseEntity.ok(ApiResponse.ok("Đã hủy đơn hàng", null));
        }

        // ==================== 5. CUSTOMERS ====================

        @GetMapping("/customers")
        public ResponseEntity<ApiResponse<Page<Customer>>> getCustomers(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(required = false) String search) {
                PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
                Page<Customer> customers;
                if (search != null && !search.isEmpty()) {
                        customers = customerRepository.findByFullNameContainingIgnoreCase(search, pageRequest);
                } else {
                        customers = customerRepository.findAll(pageRequest);
                }
                return ResponseEntity.ok(ApiResponse.ok(customers));
        }

        @GetMapping("/customers/{id}")
        public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerDetail(@PathVariable Long id) {
                Customer customer = customerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));

                // Get customer's orders by matching phone
                List<Order> orders = orderRepository.findAll().stream()
                                .filter(o -> customer.getPhone().equals(o.getPhone()))
                                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                                .collect(Collectors.toList());

                Map<String, Object> result = new LinkedHashMap<>();
                result.put("customer", customer);
                result.put("orders", orders);
                return ResponseEntity.ok(ApiResponse.ok(result));
        }

        @PutMapping("/customers/{id}/lock")
        public ResponseEntity<ApiResponse<Customer>> toggleLockCustomer(@PathVariable Long id) {
                Customer customer = customerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Customer not found"));
                customer.setLocked(!customer.getLocked());
                Customer saved = customerRepository.save(customer);
                String msg = saved.getLocked() ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản";
                return ResponseEntity.ok(ApiResponse.ok(msg, saved));
        }

        // ==================== 6. COUPONS ====================

        @GetMapping("/coupons")
        public ResponseEntity<ApiResponse<List<Coupon>>> getCoupons() {
                List<Coupon> coupons = couponRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
                return ResponseEntity.ok(ApiResponse.ok(coupons));
        }

        @PostMapping("/coupons")
        public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
                if (couponRepository.existsByCode(coupon.getCode())) {
                        throw new RuntimeException("Mã giảm giá đã tồn tại");
                }
                Coupon saved = couponRepository.save(coupon);
                return ResponseEntity.ok(ApiResponse.ok("Tạo mã giảm giá thành công", saved));
        }

        @PutMapping("/coupons/{id}")
        public ResponseEntity<ApiResponse<Coupon>> updateCoupon(@PathVariable Long id, @RequestBody Coupon updated) {
                Coupon coupon = couponRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Coupon not found"));
                coupon.setCode(updated.getCode());
                coupon.setDescription(updated.getDescription());
                coupon.setDiscountPercent(updated.getDiscountPercent());
                coupon.setMaxDiscount(updated.getMaxDiscount());
                coupon.setMinOrderValue(updated.getMinOrderValue());
                coupon.setMaxUses(updated.getMaxUses());
                coupon.setStartDate(updated.getStartDate());
                coupon.setEndDate(updated.getEndDate());
                coupon.setActive(updated.getActive());
                Coupon saved = couponRepository.save(coupon);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật mã giảm giá thành công", saved));
        }

        @DeleteMapping("/coupons/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
                couponRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa mã giảm giá", null));
        }

        // ==================== 7. REVIEWS ====================

        @GetMapping("/reviews")
        public ResponseEntity<ApiResponse<Page<Review>>> getReviews(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
                Page<Review> reviews = reviewRepository.findAll(pageRequest);
                return ResponseEntity.ok(ApiResponse.ok(reviews));
        }

        @PutMapping("/reviews/{id}/toggle")
        public ResponseEntity<ApiResponse<Review>> toggleReviewVisibility(@PathVariable Long id) {
                Review review = reviewRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Review not found"));
                review.setVisible(!review.getVisible());
                Review saved = reviewRepository.save(review);
                return ResponseEntity.ok(ApiResponse.ok(saved.getVisible() ? "Đã hiện review" : "Đã ẩn review", saved));
        }

        @DeleteMapping("/reviews/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
                reviewRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa review", null));
        }

        // ==================== 8. INVENTORY ====================

        @GetMapping("/inventory")
        public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getInventory() {
                List<Map<String, Object>> inventory = productRepository.findAll(Sort.by(Sort.Direction.ASC, "stock"))
                                .stream()
                                .map(p -> {
                                        Map<String, Object> m = new LinkedHashMap<>();
                                        m.put("id", p.getId());
                                        m.put("name", p.getName());
                                        m.put("image", p.getImage());
                                        m.put("category", p.getCategory().getName());
                                        m.put("price", p.getPrice());
                                        m.put("stock", p.getStock());
                                        m.put("status", p.getStock() <= 0 ? "OUT_OF_STOCK"
                                                        : p.getStock() < 10 ? "LOW_STOCK" : "IN_STOCK");
                                        return m;
                                }).collect(Collectors.toList());
                return ResponseEntity.ok(ApiResponse.ok(inventory));
        }

        @PutMapping("/inventory/{id}")
        public ResponseEntity<ApiResponse<Product>> updateInventory(@PathVariable Long id,
                        @RequestParam Integer stock) {
                Product product = productRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Product not found"));
                product.setStock(stock);
                Product saved = productRepository.save(product);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật tồn kho thành công", saved));
        }

        // ==================== 9. SHIPPING ====================

        @GetMapping("/shipping")
        public ResponseEntity<ApiResponse<List<ShippingZone>>> getShippingZones() {
                List<ShippingZone> zones = shippingZoneRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder"));
                return ResponseEntity.ok(ApiResponse.ok(zones));
        }

        @PostMapping("/shipping")
        public ResponseEntity<ApiResponse<ShippingZone>> createShippingZone(@RequestBody ShippingZone zone) {
                ShippingZone saved = shippingZoneRepository.save(zone);
                return ResponseEntity.ok(ApiResponse.ok("Thêm khu vực thành công", saved));
        }

        @PutMapping("/shipping/{id}")
        public ResponseEntity<ApiResponse<ShippingZone>> updateShippingZone(@PathVariable Long id,
                        @RequestBody ShippingZone updated) {
                ShippingZone zone = shippingZoneRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("ShippingZone not found"));
                zone.setName(updated.getName());
                zone.setFee(updated.getFee());
                zone.setMinFreeShip(updated.getMinFreeShip());
                zone.setActive(updated.getActive());
                zone.setSortOrder(updated.getSortOrder());
                ShippingZone saved = shippingZoneRepository.save(zone);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật khu vực thành công", saved));
        }

        @DeleteMapping("/shipping/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteShippingZone(@PathVariable Long id) {
                shippingZoneRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa khu vực", null));
        }

        // ==================== 10. ANALYTICS ====================

        @GetMapping("/analytics")
        public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics(
                        @RequestParam(defaultValue = "30") int days) {
                Map<String, Object> analytics = new LinkedHashMap<>();
                List<Order> allOrders = orderRepository.findAll();

                // Revenue by day
                List<Map<String, Object>> revenueByDay = new ArrayList<>();
                for (int i = days - 1; i >= 0; i--) {
                        LocalDate date = LocalDate.now().minusDays(i);
                        LocalDateTime dayStart = date.atStartOfDay();
                        LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
                        BigDecimal dayRevenue = allOrders.stream()
                                        .filter(o -> o.getCreatedAt().isAfter(dayStart)
                                                        && o.getCreatedAt().isBefore(dayEnd)
                                                        && !"CANCELLED".equals(o.getStatus()))
                                        .map(Order::getGrandTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                        long dayOrders = allOrders.stream()
                                        .filter(o -> o.getCreatedAt().isAfter(dayStart)
                                                        && o.getCreatedAt().isBefore(dayEnd))
                                        .count();
                        Map<String, Object> entry = new LinkedHashMap<>();
                        entry.put("date", date.toString());
                        entry.put("revenue", dayRevenue);
                        entry.put("orders", dayOrders);
                        revenueByDay.add(entry);
                }

                // Revenue by month (last 12 months)
                List<Map<String, Object>> revenueByMonth = new ArrayList<>();
                for (int i = 11; i >= 0; i--) {
                        LocalDate month = LocalDate.now().minusMonths(i).withDayOfMonth(1);
                        LocalDate nextMonth = month.plusMonths(1);
                        BigDecimal monthRevenue = allOrders.stream()
                                        .filter(o -> {
                                                LocalDate orderDate = o.getCreatedAt().toLocalDate();
                                                return !orderDate.isBefore(month) && orderDate.isBefore(nextMonth)
                                                                && !"CANCELLED".equals(o.getStatus());
                                        })
                                        .map(Order::getGrandTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                        Map<String, Object> entry = new LinkedHashMap<>();
                        entry.put("month", month.getYear() + "-" + String.format("%02d", month.getMonthValue()));
                        entry.put("revenue", monthRevenue);
                        revenueByMonth.add(entry);
                }

                // Top selling products
                List<Map<String, Object>> topProducts = productRepository.findAll().stream()
                                .sorted(Comparator.comparing(Product::getReviews).reversed())
                                .limit(10)
                                .map(p -> {
                                        Map<String, Object> m = new LinkedHashMap<>();
                                        m.put("id", p.getId());
                                        m.put("name", p.getName());
                                        m.put("image", p.getImage());
                                        m.put("sold", p.getReviews());
                                        m.put("revenue", p.getPrice().multiply(BigDecimal.valueOf(p.getReviews())));
                                        return m;
                                }).collect(Collectors.toList());

                // Top customers
                List<Map<String, Object>> topCustomers = customerRepository.findAll().stream()
                                .sorted(Comparator.comparing(Customer::getTotalSpent).reversed())
                                .limit(10)
                                .map(c -> {
                                        Map<String, Object> m = new LinkedHashMap<>();
                                        m.put("id", c.getId());
                                        m.put("name", c.getFullName());
                                        m.put("phone", c.getPhone());
                                        m.put("totalOrders", c.getTotalOrders());
                                        m.put("totalSpent", c.getTotalSpent());
                                        return m;
                                }).collect(Collectors.toList());

                analytics.put("revenueByDay", revenueByDay);
                analytics.put("revenueByMonth", revenueByMonth);
                analytics.put("topProducts", topProducts);
                analytics.put("topCustomers", topCustomers);

                return ResponseEntity.ok(ApiResponse.ok(analytics));
        }

        // ==================== 11. CMS ====================

        @GetMapping("/banners")
        public ResponseEntity<ApiResponse<List<Banner>>> getBanners() {
                List<Banner> banners = bannerRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder"));
                return ResponseEntity.ok(ApiResponse.ok(banners));
        }

        @PostMapping("/banners")
        public ResponseEntity<ApiResponse<Banner>> createBanner(@RequestBody Banner banner) {
                Banner saved = bannerRepository.save(banner);
                return ResponseEntity.ok(ApiResponse.ok("Thêm banner thành công", saved));
        }

        @PutMapping("/banners/{id}")
        public ResponseEntity<ApiResponse<Banner>> updateBanner(@PathVariable Long id, @RequestBody Banner updated) {
                Banner banner = bannerRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Banner not found"));
                banner.setTitle(updated.getTitle());
                banner.setSubtitle(updated.getSubtitle());
                banner.setImageUrl(updated.getImageUrl());
                banner.setLink(updated.getLink());
                banner.setPosition(updated.getPosition());
                banner.setSortOrder(updated.getSortOrder());
                banner.setActive(updated.getActive());
                Banner saved = bannerRepository.save(banner);
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật banner thành công", saved));
        }

        @DeleteMapping("/banners/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Long id) {
                bannerRepository.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa banner", null));
        }

        // ==================== 12. SETTINGS ====================

        @GetMapping("/settings")
        public ResponseEntity<ApiResponse<List<SystemSetting>>> getSettings() {
                List<SystemSetting> settings = systemSettingRepository.findAll();
                return ResponseEntity.ok(ApiResponse.ok(settings));
        }

        @PutMapping("/settings")
        public ResponseEntity<ApiResponse<List<SystemSetting>>> updateSettings(
                        @RequestBody List<SystemSetting> settings) {
                List<SystemSetting> saved = new ArrayList<>();
                for (SystemSetting s : settings) {
                        SystemSetting existing = systemSettingRepository.findBySettingKey(s.getSettingKey())
                                        .orElse(SystemSetting.builder().settingKey(s.getSettingKey()).build());
                        existing.setSettingValue(s.getSettingValue());
                        existing.setLabel(s.getLabel());
                        existing.setType(s.getType());
                        saved.add(systemSettingRepository.save(existing));
                }
                return ResponseEntity.ok(ApiResponse.ok("Cập nhật cài đặt thành công", saved));
        }

        // ==================== CONTACTS ====================

        @GetMapping("/contacts")
        public ResponseEntity<ApiResponse<Page<ContactMessage>>> getContacts(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "20") int size) {
                PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
                Page<ContactMessage> contacts = contactRepo.findAll(pageRequest);
                return ResponseEntity.ok(ApiResponse.ok(contacts));
        }

        @PutMapping("/contacts/{id}/read")
        public ResponseEntity<ApiResponse<ContactMessage>> markAsRead(@PathVariable Long id) {
                ContactMessage msg = contactRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Contact not found"));
                msg.setRead(true);
                ContactMessage saved = contactRepo.save(msg);
                return ResponseEntity.ok(ApiResponse.ok("Đã đánh dấu đã đọc", saved));
        }

        @DeleteMapping("/contacts/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long id) {
                contactRepo.deleteById(id);
                return ResponseEntity.ok(ApiResponse.ok("Đã xóa tin nhắn", null));
        }
}
