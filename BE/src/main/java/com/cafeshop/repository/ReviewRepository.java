package com.cafeshop.repository;

import com.cafeshop.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductId(Long productId, Pageable pageable);

    List<Review> findByProductIdAndVisible(Long productId, Boolean visible);

    Page<Review> findByVisible(Boolean visible, Pageable pageable);

    long countByVisible(Boolean visible);
}
