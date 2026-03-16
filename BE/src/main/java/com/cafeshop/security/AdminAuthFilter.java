package com.cafeshop.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Filter that protects /api/admin/** endpoints.
 * Requires a valid JWT token in the Authorization header.
 * Excludes /api/admin/auth/** endpoints (login).
 */
@Component
@Order(1)
public class AdminAuthFilter implements Filter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String path = request.getRequestURI();

        // Only protect /api/admin/** endpoints (exclude auth endpoints)
        if (!path.startsWith("/api/admin") || path.startsWith("/api/admin/auth")) {
            chain.doFilter(req, res);
            return;
        }

        // Allow OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(req, res);
            return;
        }

        // Check Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, 401, "Vui lòng đăng nhập để truy cập");
            return;
        }

        String token = authHeader.substring(7);
        String username = JwtUtil.validateToken(token);

        if (username == null) {
            sendError(response, 401, "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            return;
        }

        // Token valid – set username as attribute for downstream use
        request.setAttribute("adminUsername", username);
        chain.doFilter(req, res);
    }

    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(
                Map.of("success", false, "message", message)));
    }
}
