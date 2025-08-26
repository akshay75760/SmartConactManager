package com.scm.profileservice.controller;

import com.scm.profileservice.dto.ApiResponse;
import com.scm.profileservice.dto.UserProfileRequest;
import com.scm.profileservice.dto.UserProfileResponse;
import com.scm.profileservice.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:8081"})
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> createProfile(@Valid @RequestBody UserProfileRequest request) {
        log.info("POST /api/profile - Creating profile for user: {}", request.getUserId());
        
        UserProfileResponse profile = userProfileService.createProfile(request);
        ApiResponse<UserProfileResponse> response = ApiResponse.success("Profile created successfully", profile);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createProfileByAdmin(@Valid @RequestBody UserProfileRequest request) {
        log.info("POST /api/profile/admin - Admin creating profile for user: {}", request.getUserId());
        
        UserProfileResponse profile = userProfileService.createProfile(request);
        ApiResponse<UserProfileResponse> response = ApiResponse.success("Profile created by admin successfully", profile);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllProfiles() {
        log.info("GET /api/profile/admin/all - Admin fetching all profiles");
        
        List<UserProfileResponse> profiles = userProfileService.getAllProfiles();
        ApiResponse<List<UserProfileResponse>> response = ApiResponse.success("All profiles fetched successfully", profiles);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@PathVariable String userId) {
        log.info("GET /api/profile/{} - Fetching profile", userId);
        
        UserProfileResponse profile = userProfileService.getProfile(userId);
        ApiResponse<UserProfileResponse> response = ApiResponse.success(profile);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @PathVariable String userId,
            @Valid @RequestBody UserProfileRequest request) {
        
        log.info("PUT /api/profile/{} - Updating profile", userId);
        
        UserProfileResponse profile = userProfileService.updateProfile(userId, request);
        ApiResponse<UserProfileResponse> response = ApiResponse.success("Profile updated successfully", profile);
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Object>> deleteProfile(@PathVariable String userId) {
        log.info("DELETE /api/profile/{} - Deleting profile", userId);
        
        userProfileService.deleteProfile(userId);
        ApiResponse<Object> response = ApiResponse.success("Profile deleted successfully", null);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Profile service is running"));
    }
}
