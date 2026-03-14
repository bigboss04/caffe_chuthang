package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Percent discount (e.g. 10 = 10%)
    @Column(nullable = false)
    private Integer discountPercent;

    // Max discount amount
    private BigDecimal maxDiscount;

    // Min order value to apply
    private BigDecimal minOrderValue;

    @Builder.Default
    private Integer maxUses = 100;

    @Builder.Default
    private Integer usedCount = 0;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
