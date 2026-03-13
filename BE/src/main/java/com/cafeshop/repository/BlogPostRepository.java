package com.cafeshop.repository;

import com.cafeshop.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    Page<BlogPost> findByCategory(String category, Pageable pageable);

    @Query("SELECT b FROM BlogPost b WHERE " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.excerpt) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<BlogPost> findByFilters(
            @Param("category") String category,
            @Param("search") String search,
            Pageable pageable
    );
}
