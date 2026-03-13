package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.model.Testimonial;
import com.cafeshop.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatsController {

    private final TestimonialRepository testimonialRepository;

    /**
     * GET /api/stats
     * Lấy thống kê cho HomePage
     * Tương ứng với STATS data trong FE
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getStats() {
        List<Map<String, String>> stats = List.of(
                Map.of("value", "500+", "label", "Khách hàng tin tưởng", "icon", "👥"),
                Map.of("value", "15+", "label", "Năm kinh nghiệm", "icon", "🏆"),
                Map.of("value", "100%", "label", "Nguyên liệu tự nhiên", "icon", "🌿"),
                Map.of("value", "4.9/5", "label", "Đánh giá trung bình", "icon", "⭐")
        );
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
