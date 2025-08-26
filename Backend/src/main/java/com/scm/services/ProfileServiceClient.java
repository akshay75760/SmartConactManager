package com.scm.services;

import com.scm.dto.ApiResponse;
import com.scm.dto.UserProfileRequest;
import com.scm.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PROFILE_SERVICE_BASE_URL = "http://localhost:8082/api/profile";

    public UserProfileResponse createProfile(UserProfileRequest request) {
        log.info("Creating profile for user: {}", request.getUserId());
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<UserProfileRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<ApiResponse<UserProfileResponse>> response = restTemplate.exchange(
                PROFILE_SERVICE_BASE_URL,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<ApiResponse<UserProfileResponse>>() {}
            );
            
            if (response.getBody() != null && response.getBody().isSuccess()) {
                return response.getBody().getData();
            }
            throw new RuntimeException("Failed to create profile");
            
        } catch (HttpClientErrorException e) {
            log.error("Error creating profile: {}", e.getMessage());
            throw new RuntimeException("Failed to create profile: " + e.getMessage());
        }
    }

    public UserProfileResponse getProfile(String userId) {
        log.info("Fetching profile for user: {}", userId);
        
        try {
            ResponseEntity<ApiResponse<UserProfileResponse>> response = restTemplate.exchange(
                PROFILE_SERVICE_BASE_URL + "/" + userId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<UserProfileResponse>>() {}
            );
            
            if (response.getBody() != null && response.getBody().isSuccess()) {
                return response.getBody().getData();
            }
            return null;
            
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return null;
            }
            log.error("Error fetching profile: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch profile: " + e.getMessage());
        }
    }

    public List<UserProfileResponse> getAllProfiles() {
        log.info("Fetching all profiles");
        
        try {
            ResponseEntity<ApiResponse<List<UserProfileResponse>>> response = restTemplate.exchange(
                PROFILE_SERVICE_BASE_URL + "/admin/all",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<List<UserProfileResponse>>>() {}
            );
            
            if (response.getBody() != null && response.getBody().isSuccess()) {
                return response.getBody().getData();
            }
            throw new RuntimeException("Failed to fetch all profiles");
            
        } catch (HttpClientErrorException e) {
            log.error("Error fetching all profiles: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch all profiles: " + e.getMessage());
        }
    }

    public UserProfileResponse updateProfile(String userId, UserProfileRequest request) {
        log.info("Updating profile for user: {}", userId);
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<UserProfileRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<ApiResponse<UserProfileResponse>> response = restTemplate.exchange(
                PROFILE_SERVICE_BASE_URL + "/" + userId,
                HttpMethod.PUT,
                entity,
                new ParameterizedTypeReference<ApiResponse<UserProfileResponse>>() {}
            );
            
            if (response.getBody() != null && response.getBody().isSuccess()) {
                return response.getBody().getData();
            }
            throw new RuntimeException("Failed to update profile");
            
        } catch (HttpClientErrorException e) {
            log.error("Error updating profile: {}", e.getMessage());
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }

    public void deleteProfile(String userId) {
        log.info("Deleting profile for user: {}", userId);
        
        try {
            restTemplate.exchange(
                PROFILE_SERVICE_BASE_URL + "/" + userId,
                HttpMethod.DELETE,
                null,
                new ParameterizedTypeReference<ApiResponse<Object>>() {}
            );
            
        } catch (HttpClientErrorException e) {
            log.error("Error deleting profile: {}", e.getMessage());
            throw new RuntimeException("Failed to delete profile: " + e.getMessage());
        }
    }

    public boolean isProfileServiceHealthy() {
        try {
            ResponseEntity<ApiResponse<String>> response = restTemplate.exchange(
                PROFILE_SERVICE_BASE_URL + "/health",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<ApiResponse<String>>() {}
            );
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.warn("Profile service health check failed: {}", e.getMessage());
            return false;
        }
    }
}
