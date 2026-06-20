// src/main/java/com/environment/backend/service/ContactMessageService.java
package com.environment.backend.service;

import com.environment.backend.dto.ContactMessageRequest;
import com.environment.backend.dto.ContactMessageResponse;
import com.environment.backend.entity.ContactMessage;
import com.environment.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactMessageService {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    public ContactMessageResponse submitMessage(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        
        ContactMessage savedMessage = contactMessageRepository.save(message);
        return convertToResponse(savedMessage);
    }
    
    public List<ContactMessageResponse> getAllMessages() {
        List<ContactMessage> messages = contactMessageRepository.findByOrderByCreatedAtDesc();
        return messages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteMessage(Long messageId) {
        contactMessageRepository.deleteById(messageId);
    }
    
    private ContactMessageResponse convertToResponse(ContactMessage message) {
        return new ContactMessageResponse(
            message.getMessageId(),
            message.getName(),
            message.getEmail(),
            message.getSubject(),
            message.getMessage(),
            message.getCreatedAt()
        );
    }
}