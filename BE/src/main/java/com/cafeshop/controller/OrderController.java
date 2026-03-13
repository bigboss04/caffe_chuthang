package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.dto.OrderRequest;
import com.cafeshop.dto.OrderResponse;
import com.cafeshop.model.Order;
import com.cafeshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/orders
     * Tạo đơn hàng mới
     * Tương ứng với CheckoutPage FE handlePlaceOrder
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đặt hàng thành công! Cảm ơn bạn đã tin chọn Nông Sản Phú Yên.", response));
    }

    /**
     * GET /api/orders/{orderId}
     * Tra cứu đơn hàng theo mã
     * Tương ứng với OrderSuccessPage FE
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByOrderId(orderId)));
    }

    /**
     * PUT /api/orders/{orderId}/status
     * Cập nhật trạng thái đơn hàng (admin)
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status
    ) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", updatedOrder));
    }
}
