package com.scm.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scm.entities.User;
import com.scm.helpers.AppConstants;
import com.scm.helpers.Helper;
import com.scm.helpers.ResourceNotFoundException;
import com.scm.repsitories.UserRepo;
import com.scm.services.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Helper helper;

    @Override
    public User saveUser(User user) {
        // Generate unique user ID
        String userId = UUID.randomUUID().toString();
        user.setUserId(userId);

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role
        user.setRoleList(List.of(AppConstants.ROLE_USER));
        // user.setEmailVerified(true);
        user.setEnabled(true);
        // Log provider info
        log.info( user.getProvider().toString());

        // Save user to database
        return userRepo.save(user);
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepo.findById(id);
    }

    @Override
    public Optional<User> updateUser(User user) {
        User existingUser = userRepo.findById(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setAbout(user.getAbout());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setProfilePic(user.getProfilePic());
        existingUser.setEnabled(user.isEnabled());
        existingUser.setEmailVerified(user.isEmailVerified());
        existingUser.setPhoneVerified(user.isPhoneVerified());
        existingUser.setProvider(user.getProvider());
        existingUser.setProviderUserId(user.getProviderUserId());

        User updatedUser = userRepo.save(existingUser);
        return Optional.ofNullable(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepo.delete(existingUser);
    }

    @Override
    public boolean isUserExist(String userId) {
        return userRepo.findById(userId).isPresent();
    }

    @Override
    public boolean isUserExistByEmail(String email) {
        return userRepo.findByEmail(email).isPresent();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
    }

    @Override
    public List<User> getAllUsersWithContactCount() {
        return userRepo.findAllWithContacts();
    }

    @Override
    public Long getContactCountByUserId(String userId) {
        return userRepo.countContactsByUserId(userId);
    }
}

