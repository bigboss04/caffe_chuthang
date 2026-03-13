package com.cafeshop.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderResponse {
    private String orderId;
    private String fullName;
    private String phone;
    private String status;
    private BigDecimal grandTotal;
    private Integer totalItems;
    private LocalDateTime createdAt;
}
