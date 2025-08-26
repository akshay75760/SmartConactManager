package com.scm.controllers;

import com.scm.dto.ApiResponse;
import com.scm.dto.UserProfileRequest;
import com.scm.dto.UserProfileResponse;
import com.scm.services.ProfileServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserProfileController {

    private final ProfileServiceClient profileServiceClient;

    @PostMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createProfile(
            @PathVariable String userId,
            @RequestBody UserProfileRequest request,
            Authentication authentication) {
        
        log.info("Creating profile for user: {}", userId);
        
        try {
            // Set the userId in the request to ensure consistency
            request.setUserId(userId);
            
            UserProfileResponse profile = profileServiceClient.createProfile(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Profile created successfully", profile));
                    
        } catch (Exception e) {
            log.error("Error creating profile for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create profile: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@PathVariable String userId) {
        log.info("Fetching profile for user: {}", userId);
        
        try {
            UserProfileResponse profile = profileServiceClient.getProfile(userId);
            
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Profile not found for user: " + userId));
            }
            
            return ResponseEntity.ok(ApiResponse.success(profile));
            
        } catch (Exception e) {
            log.error("Error fetching profile for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch profile: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @PathVariable String userId,
            @RequestBody UserProfileRequest request,
            Authentication authentication) {
        
        log.info("Updating profile for user: {}", userId);
        
        try {
            // Set the userId in the request to ensure consistency
            request.setUserId(userId);
            
            UserProfileResponse profile = profileServiceClient.updateProfile(userId, request);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
            
        } catch (Exception e) {
            log.error("Error updating profile for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update profile: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/profile")
    public ResponseEntity<ApiResponse<Object>> deleteProfile(
            @PathVariable String userId,
            Authentication authentication) {
        
        log.info("Deleting profile for user: {}", userId);
        
        try {
            profileServiceClient.deleteProfile(userId);
            return ResponseEntity.ok(ApiResponse.success("Profile deleted successfully", null));
            
        } catch (Exception e) {
            log.error("Error deleting profile for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete profile: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/health")
    public ResponseEntity<ApiResponse<String>> checkProfileServiceHealth() {
        boolean isHealthy = profileServiceClient.isProfileServiceHealthy();
        
        if (isHealthy) {
            return ResponseEntity.ok(ApiResponse.success("Profile service is healthy"));
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.error("Profile service is unavailable"));
        }
    }
}
