package com.scm.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scm.dto.AdminUserResponse;
import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.services.ContactService;
import com.scm.services.UserService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ContactService contactService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> adminDashboard(Authentication authentication) {
        logger.info("Admin dashboard accessed by: {}", authentication.getName());
        return ResponseEntity.ok().body("Admin Dashboard");
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(Authentication authentication) {
        logger.info("Admin users list accessed by: {}", authentication.getName());
        
        try {
            List<User> users = userService.getAllUsers();
            
            List<AdminUserResponse> userResponses = users.stream()
                .map(user -> {
                    Long contactCount = userService.getContactCountByUserId(user.getUserId());
                    return AdminUserResponse.builder()
                        .userId(user.getUserId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phoneNumber(user.getPhoneNumber())
                        .enabled(user.isEnabled())
                        .emailVerified(user.isEmailVerified())
                        .phoneVerified(user.isPhoneVerified())
                        .provider(user.getProvider().toString())
                        .contactCount(contactCount)
                        .roles(user.getRoleList())
                        .build();
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(userResponses);
        } catch (Exception e) {
            logger.error("Error fetching users for admin: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/users/{userId}/contacts")
    public ResponseEntity<List<Contact>> getUserContacts(@PathVariable String userId, Authentication authentication) {
        logger.info("Admin accessing contacts for user {} by: {}", userId, authentication.getName());
        
        try {
            List<Contact> contacts = contactService.getByUserId(userId);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            logger.error("Error fetching contacts for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
