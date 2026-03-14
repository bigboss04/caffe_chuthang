package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "shipping_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal fee;

    // Free shipping above this amount (nullable = no free ship)
    private BigDecimal minFreeShip;

    @Builder.Default
    private Boolean active = true;

    // Sort order for display
    @Builder.Default
    private Integer sortOrder = 0;
}
