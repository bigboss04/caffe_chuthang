package com.cafeshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_gallery", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> gallery = new ArrayList<>();

    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal price;

    @Column(precision = 12, scale = 0)
    private BigDecimal originalPrice;

    private String unit;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    private String badge;
    private String badgeType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Embedded
    private ProductDetails details;

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer reviews = 0;

    @Builder.Default
    private Boolean featured = false;

    @Column(name = "is_new")
    @Builder.Default
    private Boolean isNew = false;

    @Builder.Default
    private Boolean active = true;

    private String sku;

    // Helper method to add variants
    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }
}
