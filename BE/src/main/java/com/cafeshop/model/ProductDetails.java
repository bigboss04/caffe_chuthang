package com.cafeshop.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductDetails {

    private String origin;
    private String roastLevel;
    private String process;
    private String altitude;
    private String tasteNotes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_brew_methods", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "method")
    @Builder.Default
    private List<String> brewMethods = new ArrayList<>();

    private String weight;
    private String shelf;

    // For Mứt gừng
    private String ingredients;
    private Boolean noPreservatives;
    private String packaging;

    // For Hồ tiêu
    private String type;
    private String doiGCI;
    private Boolean noAdditives;

    // For Cà phê nhân xanh
    private String certification;
    private String moisture;
    private String screen;
}
