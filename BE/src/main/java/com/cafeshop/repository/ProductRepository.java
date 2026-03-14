package com.cafeshop.repository;

import com.cafeshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrue();

    List<Product> findByCategorySlug(String categorySlug);

    @Query("SELECT p FROM Product p WHERE " +
            "(:categorySlug IS NULL OR p.category.slug = :categorySlug) AND " +
            "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(CAST(p.description AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findByFilters(
            @Param("categorySlug") String categorySlug,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.slug = :categorySlug AND p.id <> :productId")
    List<Product> findRelatedProducts(@Param("categorySlug") String categorySlug, @Param("productId") Long productId,
            Pageable pageable);
}
