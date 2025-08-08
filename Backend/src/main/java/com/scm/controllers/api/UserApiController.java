package com.scm.controllers.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scm.dto.UpdateUserRequest;
import com.scm.entities.User;
import com.scm.helpers.Helper;
import com.scm.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserApiController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserApiController.class);
    
    @Autowired
    private UserService userService;
    
    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile(Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            logger.info("👤 Fetching profile for user: {}", username);
            
            User user = userService.getUserByEmail(username);
            if (user == null) {
                logger.warn("❌ User not found: {}", username);
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching user profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update user profile
    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(@Valid @RequestBody UpdateUserRequest updateRequest, 
                                                  Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            logger.info("✏️ Updating profile for user: {}", username);
            
            User existingUser = userService.getUserByEmail(username);
            if (existingUser == null) {
                logger.warn("❌ User not found: {}", username);
                return ResponseEntity.notFound().build();
            }
            
            // Update user fields
            existingUser.setName(updateRequest.getName());
            existingUser.setAbout(updateRequest.getAbout());
            existingUser.setPhoneNumber(updateRequest.getPhoneNumber());
            
            // Only update profile picture if provided
            if (updateRequest.getProfilePic() != null && !updateRequest.getProfilePic().trim().isEmpty()) {
                existingUser.setProfilePic(updateRequest.getProfilePic());
            }
            
            // Update user in database
            var updatedUserOpt = userService.updateUser(existingUser);
            
            if (updatedUserOpt.isPresent()) {
                User updatedUser = updatedUserOpt.get();
                logger.info("✅ Profile updated successfully for user: {}", username);
                return ResponseEntity.ok(updatedUser);
            } else {
                logger.error("❌ Failed to update user profile: {}", username);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            
        } catch (Exception e) {
            logger.error("❌ Error updating user profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
