package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.model.AdminUser;
import com.cafeshop.repository.AdminUserRepository;
import com.cafeshop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminUserRepository adminUserRepository;

    /**
     * POST /api/admin/auth/login
     * Body: { "username": "admin", "password": "123456" }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Vui lòng nhập tên đăng nhập và mật khẩu")
                            .build());
        }

        AdminUser admin = adminUserRepository.findByUsername(username).orElse(null);
        if (admin == null || !admin.getActive()) {
            return ResponseEntity.status(401).body(
                    ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Tên đăng nhập hoặc mật khẩu không đúng")
                            .build());
        }

        // Verify password
        String hashedInput = hashPassword(password);
        if (!admin.getPassword().equals(hashedInput)) {
            return ResponseEntity.status(401).body(
                    ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Tên đăng nhập hoặc mật khẩu không đúng")
                            .build());
        }

        // Generate JWT token
        String token = JwtUtil.generateToken(admin.getUsername(), admin.getRole());

        Map<String, Object> data = Map.of(
                "token", token,
                "username", admin.getUsername(),
                "fullName", admin.getFullName(),
                "role", admin.getRole());

        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", data));
    }

    /**
     * GET /api/admin/auth/me
     * Verify token and return admin info (this endpoint is NOT protected by filter)
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentAdmin(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(
                    ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Chưa đăng nhập")
                            .build());
        }

        String token = authHeader.substring(7);
        String username = JwtUtil.validateToken(token);

        if (username == null) {
            return ResponseEntity.status(401).body(
                    ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Phiên đăng nhập hết hạn")
                            .build());
        }

        AdminUser admin = adminUserRepository.findByUsername(username).orElse(null);
        if (admin == null || !admin.getActive()) {
            return ResponseEntity.status(401).body(
                    ApiResponse.<Map<String, Object>>builder()
                            .success(false)
                            .message("Tài khoản không tồn tại hoặc bị khóa")
                            .build());
        }

        Map<String, Object> data = Map.of(
                "username", admin.getUsername(),
                "fullName", admin.getFullName(),
                "role", admin.getRole());

        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    /**
     * Simple SHA-256 password hashing.
     */
    public static String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Hash error", e);
        }
    }
}
