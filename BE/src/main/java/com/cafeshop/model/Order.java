package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    private String email;
    private String city;
    private String district;

    @Column(nullable = false)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal shippingFee;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal grandTotal;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    // Helper method
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
