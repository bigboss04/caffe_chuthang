package com.cafeshop.service;

import com.cafeshop.dto.PagedResponse;
import com.cafeshop.exception.ResourceNotFoundException;
import com.cafeshop.model.Product;
import com.cafeshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "slug", slug));
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    public List<Product> getProductsByCategory(String categorySlug) {
        return productRepository.findByCategorySlug(categorySlug);
    }

    public PagedResponse<Product> getFilteredProducts(String category, String search, String sortBy, int page, int size) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        String categoryParam = (category != null && !category.isBlank() && !category.equals("all")) ? category : null;
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        Page<Product> productPage = productRepository.findByFilters(categoryParam, searchParam, pageable);

        return PagedResponse.<Product>builder()
                .content(productPage.getContent())
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    public List<Product> getRelatedProducts(String categorySlug, Long productId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findRelatedProducts(categorySlug, productId, pageable);
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) return Sort.unsorted();
        return switch (sortBy) {
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "newest" -> Sort.by(Sort.Direction.DESC, "id");
            case "popular" -> Sort.by(Sort.Direction.DESC, "rating");
            default -> Sort.unsorted();
        };
    }
}
