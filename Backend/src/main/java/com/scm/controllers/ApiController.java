package com.scm.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Contact;
import com.scm.entities.Message;
import com.scm.entities.User;
import com.scm.forms.MessageForm;
import com.scm.services.ContactService;
import com.scm.services.MessageService;
import com.scm.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Added CrossOrigin annotation
public class ApiController {

    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);

    @Autowired
    private ContactService contactService;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private UserService userService;

    // get contact
    @GetMapping("/contacts/{contactId}")
    public Contact getContact(@PathVariable String contactId) {
        return contactService.getById(contactId);
    }
    
    // Send message endpoint
    @PostMapping("/messages/send")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageForm messageForm, 
                                       BindingResult result, 
                                       Authentication authentication) {
        
        logger.info("Received request to send message to: {}", messageForm.getRecipientEmail());
        
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("User not authenticated - authentication object is null or not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new com.scm.helpers.Message("User not authenticated. Please login first.", com.scm.helpers.MessageType.red));
        }
        
        // Check for validation errors
        if (result.hasErrors()) {
            logger.warn("Validation errors in message form: {}", result.getAllErrors());
            return ResponseEntity.badRequest().body(
                new com.scm.helpers.Message("Validation failed", com.scm.helpers.MessageType.red));
        }
        
        try {
            // Get current user
            String username = authentication.getName();
            logger.info("Authenticated user: {}", username);
            
            User sender = userService.getUserByEmail(username);
            
            if (sender == null) {
                logger.error("Sender not found for username: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new com.scm.helpers.Message("User not found in database", com.scm.helpers.MessageType.red));
            }
            
            logger.info("Sending message from {} to {}", sender.getEmail(), messageForm.getRecipientEmail());
            
            // Send message
            Message sentMessage = messageService.sendMessage(messageForm, sender);
            
            logger.info("Message sent successfully with ID: {}", sentMessage.getId());
            return ResponseEntity.ok(
                new com.scm.helpers.Message("Message sent successfully!", com.scm.helpers.MessageType.green));
            
        } catch (Exception e) {
            logger.error("Error sending message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new com.scm.helpers.Message("Failed to send message: " + e.getMessage(), com.scm.helpers.MessageType.red));
        }
    }
    
    // Send message with attachments endpoint
    @PostMapping("/messages/send-with-attachments")
    public ResponseEntity<?> sendMessageWithAttachments(
            @RequestParam("recipientEmail") String recipientEmail,
            @RequestParam("subject") String subject,
            @RequestParam("messageBody") String messageBody,
            @RequestParam(value = "attachments", required = false) MultipartFile[] attachments,
            Authentication authentication) {
        
        logger.info("Received request to send message with attachments to: {}", recipientEmail);
        
        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("User not authenticated - authentication object is null or not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new com.scm.helpers.Message("User not authenticated. Please login first.", com.scm.helpers.MessageType.red));
        }
        
        try {
            // Create MessageForm from request parameters
            MessageForm messageForm = new MessageForm();
            messageForm.setRecipientEmail(recipientEmail);
            messageForm.setSubject(subject);
            messageForm.setMessageBody(messageBody);
            messageForm.setAttachments(attachments);
            
            // Get current user
            String username = authentication.getName();
            logger.info("Authenticated user: {}", username);
            
            User sender = userService.getUserByEmail(username);
            
            if (sender == null) {
                logger.error("Sender not found for username: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new com.scm.helpers.Message("User not found in database", com.scm.helpers.MessageType.red));
            }
            
            logger.info("Sending message with attachments from {} to {}", sender.getEmail(), recipientEmail);
            
            // Send message with attachments
            Message sentMessage = messageService.sendMessageWithAttachments(messageForm, sender, attachments);
            
            logger.info("Message with attachments sent successfully with ID: {}", sentMessage.getId());
            return ResponseEntity.ok(
                new com.scm.helpers.Message("Message with attachments sent successfully!", com.scm.helpers.MessageType.green));
            
        } catch (Exception e) {
            logger.error("Error sending message with attachments: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new com.scm.helpers.Message("Failed to send message: " + e.getMessage(), com.scm.helpers.MessageType.red));
        }
    }
    
    // Test email endpoint for debugging
    @PostMapping("/messages/test")
    public ResponseEntity<?> testEmail(Authentication authentication) {
        try {
            // Check if user is authenticated
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.error("User not authenticated for test email");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new com.scm.helpers.Message("User not authenticated. Please login first.", com.scm.helpers.MessageType.red));
            }
            
            String username = authentication.getName();
            User sender = userService.getUserByEmail(username);
            
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new com.scm.helpers.Message("User not found in database", com.scm.helpers.MessageType.red));
            }
            
            // Send test email
            MessageForm testForm = new MessageForm();
            testForm.setRecipientEmail(sender.getEmail()); // Send to self
            testForm.setSubject("Test Email from Smart Contact Manager");
            testForm.setMessageBody("This is a test email to verify email configuration is working properly.");
            
            messageService.sendMessage(testForm, sender);
            
            return ResponseEntity.ok(
                new com.scm.helpers.Message("Test email sent successfully to " + sender.getEmail(), com.scm.helpers.MessageType.green));
            
        } catch (Exception e) {
            logger.error("Error sending test email: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new com.scm.helpers.Message("Test email failed: " + e.getMessage(), com.scm.helpers.MessageType.red));
        }
    }
    
    // Get messages sent by current user
    @GetMapping("/messages/sent")
    public ResponseEntity<List<Message>> getSentMessages(Authentication authentication) {
        try {
            String username = authentication.getName();
            User sender = userService.getUserByEmail(username);
            
            if (sender == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<Message> messages = messageService.getMessagesBySender(sender);
            return ResponseEntity.ok(messages);
            
        } catch (Exception e) {
            logger.error("Error fetching sent messages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get message by ID (only if user is sender)
    @GetMapping("/messages/{messageId}")
    public ResponseEntity<Message> getMessage(@PathVariable String messageId, 
                                            Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.getUserByEmail(username);
            
            Message message = messageService.getMessageById(messageId);
            
            // Check if current user is the sender
            if (!message.getSender().getUserId().equals(currentUser.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(message);
            
        } catch (Exception e) {
            logger.error("Error fetching message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
