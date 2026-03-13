package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "testimonials")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String role;
    private String city;
    private String avatar;

    @Builder.Default
    private Integer rating = 5;

    @Column(columnDefinition = "TEXT")
    private String text;
}
