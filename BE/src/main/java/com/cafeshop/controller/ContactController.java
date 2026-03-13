package com.cafeshop.controller;

import com.cafeshop.dto.ApiResponse;
import com.cafeshop.dto.ContactRequest;
import com.cafeshop.model.ContactMessage;
import com.cafeshop.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /**
     * POST /api/contact
     * Gửi tin nhắn liên hệ
     * Tương ứng với ContactPage FE handleSubmit
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> submitContact(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = contactService.submitContact(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi trong 24 giờ.", saved));
    }
}
