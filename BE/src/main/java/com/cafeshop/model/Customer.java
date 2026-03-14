package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    private String email;

    @Column(nullable = false)
    private String phone;

    private String address;
    private String city;
    private String district;

    @Builder.Default
    private Boolean locked = false;

    @Builder.Default
    private Integer totalOrders = 0;

    @Builder.Default
    private java.math.BigDecimal totalSpent = java.math.BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime lastOrderAt;
}
