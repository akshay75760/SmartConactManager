package com.scm.controllers;

import com.scm.dto.ApiResponse;
import com.scm.dto.UserProfileRequest;
import com.scm.dto.UserProfileResponse;
import com.scm.services.ProfileServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/profiles")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfileController {

    private final ProfileServiceClient profileServiceClient;

    @PostMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> createUserProfile(
            @RequestBody UserProfileRequest request,
            Authentication authentication) {
        
        log.info("Admin {} creating profile for user: {}", authentication.getName(), request.getUserId());
        
        try {
            UserProfileResponse profile = profileServiceClient.createProfile(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User profile created successfully by admin", profile));
                    
        } catch (Exception e) {
            log.error("Error creating profile for user {}: {}", request.getUserId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create user profile: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUserProfiles(
            Authentication authentication) {
        
        log.info("Admin {} fetching all user profiles", authentication.getName());
        
        try {
            List<UserProfileResponse> profiles = profileServiceClient.getAllProfiles();
            return ResponseEntity.ok(ApiResponse.success("All user profiles fetched successfully", profiles));
            
        } catch (Exception e) {
            log.error("Error fetching all profiles: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch user profiles: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(
            @PathVariable String userId,
            Authentication authentication) {
        
        log.info("Admin {} fetching profile for user: {}", authentication.getName(), userId);
        
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
                    .body(ApiResponse.error("Failed to fetch user profile: " + e.getMessage()));
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserProfile(
            @PathVariable String userId,
            @RequestBody UserProfileRequest request,
            Authentication authentication) {
        
        log.info("Admin {} updating profile for user: {}", authentication.getName(), userId);
        
        try {
            // Ensure the request has the correct userId
            request.setUserId(userId);
            
            UserProfileResponse profile = profileServiceClient.updateProfile(userId, request);
            return ResponseEntity.ok(ApiResponse.success("User profile updated successfully by admin", profile));
            
        } catch (Exception e) {
            log.error("Error updating profile for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update user profile: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Object>> deleteUserProfile(
            @PathVariable String userId,
            Authentication authentication) {
        
        log.info("Admin {} deleting profile for user: {}", authentication.getName(), userId);
        
        try {
            profileServiceClient.deleteProfile(userId);
            return ResponseEntity.ok(ApiResponse.success("User profile deleted successfully by admin", null));
            
        } catch (Exception e) {
            log.error("Error deleting profile for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete user profile: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
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
