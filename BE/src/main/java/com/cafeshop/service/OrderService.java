package com.cafeshop.service;

import com.cafeshop.dto.OrderRequest;
import com.cafeshop.dto.OrderResponse;
import com.cafeshop.exception.ResourceNotFoundException;
import com.cafeshop.model.Order;
import com.cafeshop.model.OrderItem;
import com.cafeshop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("500000");
    private static final BigDecimal SHIPPING_FEE = new BigDecimal("30000");

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Calculate subtotal
        BigDecimal subtotal = request.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate shipping fee
        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0
                ? BigDecimal.ZERO : SHIPPING_FEE;

        BigDecimal grandTotal = subtotal.add(shippingFee);

        // Generate order ID
        String orderId = UUID.randomUUID().toString().substring(0, 9).toUpperCase();

        // Build order
        Order order = Order.builder()
                .orderId(orderId)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .city(request.getCity())
                .district(request.getDistrict())
                .address(request.getAddress())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .status("PENDING")
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .grandTotal(grandTotal)
                .createdAt(LocalDateTime.now())
                .build();

        // Add items
        int totalItems = 0;
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .productId(itemReq.getProductId())
                    .productName(itemReq.getProductName())
                    .productImage(itemReq.getProductImage())
                    .variantLabel(itemReq.getVariantLabel())
                    .price(itemReq.getPrice())
                    .quantity(itemReq.getQuantity())
                    .build();
            order.addItem(item);
            totalItems += itemReq.getQuantity();
        }

        Order savedOrder = orderRepository.save(order);

        return OrderResponse.builder()
                .orderId(savedOrder.getOrderId())
                .fullName(savedOrder.getFullName())
                .phone(savedOrder.getPhone())
                .status(savedOrder.getStatus())
                .grandTotal(savedOrder.getGrandTotal())
                .totalItems(totalItems)
                .createdAt(savedOrder.getCreatedAt())
                .build();
    }

    public Order getOrderByOrderId(String orderId) {
        return orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "orderId", orderId));
    }

    @Transactional
    public Order updateOrderStatus(String orderId, String status) {
        Order order = getOrderByOrderId(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
