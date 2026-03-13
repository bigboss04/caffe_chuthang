package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.model.Testimonial;
import com.cafeshop.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/testimonials")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialRepository testimonialRepository;

    /**
     * GET /api/testimonials
     * Lấy tất cả đánh giá khách hàng
     * Tương ứng với TESTIMONIALS data trong FE HomePage
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Testimonial>>> getAllTestimonials() {
        return ResponseEntity.ok(ApiResponse.ok(testimonialRepository.findAll()));
    }
}
