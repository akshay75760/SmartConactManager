package com.scm.services.impl;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.scm.entities.User;
import com.scm.helper.AppConstant;
import com.scm.helper.ResourceNotFoundException;
import com.scm.repository.UserRepo;
import com.scm.services.UserService;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Logger logger = LoggerFactory.getLogger(this.getClass());


    @Override
    public User saveUser(User user) {
        // user id :have to generate
        String userId = UUID.randomUUID().toString();
        user.setUserId(userId);

        // Password Encoder
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set the Role
        user.setRoleList(List.of(AppConstant.ROLE_USER));

        // User.setpassword(userId)
        logger.info(user.getProviders().toString());
        return userRepo.save(user);
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepo.findById(id);
    }

    @Override
    public Optional<User> updatUser(User user) {
        User user2=userRepo.findById(user.getUserId()).orElseThrow(()->
         new ResourceNotFoundException("User Not found"));

        // Update karenge user2 ko from user
        user2.setName(user.getName());
        user2.setEmail(user.getEmail());
        user2.setPassword(user.getPassword());
        user2.setAbout(user.getAbout());
        user2.setPhoneNumber(user.getPhoneNumber());
        user2.setProfilePic(user.getProfilePic());
        user2.setEnabled(user.isEnabled());
        user2.setEmailVerified(user.isEmailVerified());
        user2.setPhoneVerified(user.isPhoneVerified());
        user2.setProviders(user.getProviders());
        user2.setProviderUserId(user.getProviderUserId());

        // Save the user in database
        User save =userRepo.save(user2);
        return Optional.ofNullable(save);
    }

    @Override
    public void deleteUser(String id) {
        User user2=userRepo.findById(id).orElseThrow(()->
         new ResourceNotFoundException("User Not found"));
         userRepo.delete(user2);

    }

    @Override
    public boolean isUserExist(String userId) {
        User user=userRepo.findById(userId).orElse(null);
        return user != null ? true:false;
    }

    @Override
    public boolean isExisByEmail(String email) {
        User user=userRepo.findByEmail(email).orElse(null);
        return user != null ? true:false; 
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }
}
