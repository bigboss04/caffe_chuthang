package com.cafeshop.service;

import com.cafeshop.dto.PagedResponse;
import com.cafeshop.exception.ResourceNotFoundException;
import com.cafeshop.model.BlogPost;
import com.cafeshop.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogPostRepository blogPostRepository;

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll(Sort.by(Sort.Direction.DESC, "date"));
    }

    public BlogPost getPostBySlug(String slug) {
        return blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Bài viết", "slug", slug));
    }

    public PagedResponse<BlogPost> getFilteredPosts(String category, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));

        String categoryParam = (category != null && !category.isBlank() && !category.equals("Tất cả")) ? category : null;
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        Page<BlogPost> blogPage = blogPostRepository.findByFilters(categoryParam, searchParam, pageable);

        return PagedResponse.<BlogPost>builder()
                .content(blogPage.getContent())
                .page(blogPage.getNumber())
                .size(blogPage.getSize())
                .totalElements(blogPage.getTotalElements())
                .totalPages(blogPage.getTotalPages())
                .last(blogPage.isLast())
                .build();
    }
}
