package com.scm.profileservice.service;

import com.scm.profileservice.dto.UserProfileRequest;
import com.scm.profileservice.dto.UserProfileResponse;
import com.scm.profileservice.entity.UserProfile;
import com.scm.profileservice.exception.ProfileNotFoundException;
import com.scm.profileservice.exception.ProfileAlreadyExistsException;
import com.scm.profileservice.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfileResponse createProfile(UserProfileRequest request) {
        log.info("Creating profile for user: {}", request.getUserId());
        
        if (userProfileRepository.existsByUserId(request.getUserId())) {
            throw new ProfileAlreadyExistsException("Profile already exists for user: " + request.getUserId());
        }

        UserProfile profile = new UserProfile(
                request.getUserId(),
                request.getFullName(),
                request.getBio(),
                request.getProfilePictureUrl()
        );

        UserProfile savedProfile = userProfileRepository.save(profile);
        log.info("Profile created successfully for user: {}", request.getUserId());
        
        return convertToResponse(savedProfile);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {
        log.info("Fetching profile for user: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));
        
        return convertToResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllProfiles() {
        log.info("Fetching all profiles");
        
        List<UserProfile> profiles = userProfileRepository.findAll();
        return profiles.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileResponse updateProfile(String userId, UserProfileRequest request) {
        log.info("Updating profile for user: {}", userId);
        
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + userId));

        profile.setFullName(request.getFullName());
        profile.setBio(request.getBio());
        profile.setProfilePictureUrl(request.getProfilePictureUrl());

        UserProfile updatedProfile = userProfileRepository.save(profile);
        log.info("Profile updated successfully for user: {}", userId);
        
        return convertToResponse(updatedProfile);
    }

    @Transactional
    public void deleteProfile(String userId) {
        log.info("Deleting profile for user: {}", userId);
        
        if (!userProfileRepository.existsByUserId(userId)) {
            throw new ProfileNotFoundException("Profile not found for user: " + userId);
        }

        userProfileRepository.deleteByUserId(userId);
        log.info("Profile deleted successfully for user: {}", userId);
    }

    private UserProfileResponse convertToResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getUserId(),
                profile.getFullName(),
                profile.getBio(),
                profile.getProfilePictureUrl(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
