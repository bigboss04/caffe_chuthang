package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.dto.PagedResponse;
import com.cafeshop.model.Product;
import com.cafeshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products
     * Lấy tất cả sản phẩm (không phân trang)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllProducts()));
    }

    /**
     * GET /api/products/search?category=...&search=...&sort=...&page=0&size=12
     * Lọc, tìm kiếm, sắp xếp và phân trang sản phẩm
     * Tương ứng với ShopPage FE
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<Product>>> searchProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "default") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        PagedResponse<Product> result = productService.getFilteredProducts(category, search, sort, page, size);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /**
     * GET /api/products/featured
     * Lấy sản phẩm nổi bật cho HomePage
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts()));
    }

    /**
     * GET /api/products/category/{slug}
     * Lấy sản phẩm theo danh mục
     */
    @GetMapping("/category/{slug}")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByCategory(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductsByCategory(slug)));
    }

    /**
     * GET /api/products/{id}
     * Lấy chi tiết sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductById(id)));
    }

    /**
     * GET /api/products/slug/{slug}
     * Lấy chi tiết sản phẩm theo slug
     * Tương ứng với ProductDetailPage FE (useParams: slug)
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Product>> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductBySlug(slug)));
    }

    /**
     * GET /api/products/{id}/related?limit=4
     * Lấy sản phẩm liên quan
     * Tương ứng với phần "Sản Phẩm Liên Quan" trong ProductDetailPage FE
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<List<Product>>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit
    ) {
        Product product = productService.getProductById(id);
        List<Product> related = productService.getRelatedProducts(product.getCategory().getSlug(), id, limit);
        return ResponseEntity.ok(ApiResponse.ok(related));
    }
}
