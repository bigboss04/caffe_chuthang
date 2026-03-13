package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.dto.PagedResponse;
import com.cafeshop.model.BlogPost;
import com.cafeshop.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    /**
     * GET /api/blog
     * Lấy tất cả bài viết
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogPost>>> getAllPosts() {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getAllPosts()));
    }

    /**
     * GET /api/blog/search?category=...&search=...&page=0&size=10
     * Lọc, tìm kiếm, phân trang bài viết
     * Tương ứng với BlogPage FE
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<BlogPost>>> searchPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<BlogPost> result = blogService.getFilteredPosts(category, search, page, size);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /**
     * GET /api/blog/{slug}
     * Lấy bài viết theo slug
     * Tương ứng với BlogDetailPage FE
     */
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<BlogPost>> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getPostBySlug(slug)));
    }
}
