package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subtitle;

    @Column(nullable = false)
    private String imageUrl;

    private String link;

    @Column(nullable = false)
    private String position; // hero, promo, sidebar

    @Builder.Default
    private Integer sortOrder = 0;

    @Builder.Default
    private Boolean active = true;
}
