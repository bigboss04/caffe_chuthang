package com.cafeshop.service;

import com.cafeshop.dto.ContactRequest;
import com.cafeshop.model.ContactMessage;
import com.cafeshop.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage submitContact(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        return contactMessageRepository.save(message);
    }
}
