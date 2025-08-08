package com.scm.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin; // Import CrossOrigin
import org.springframework.web.bind.annotation.GetMapping; // Use specific mapping
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController; // Changed to RestController

import com.scm.entities.User;
import com.scm.services.UserService;
import org.springframework.http.ResponseEntity; // For returning ResponseEntity

@RestController // Changed to RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173") // Added CrossOrigin annotation
public class UserController {

    private Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    // user dashboard page - now returns JSON
    @GetMapping("/dashboard") // Changed to GetMapping
    public ResponseEntity<?> userDashboard(Authentication authentication) {
        // You might return a simplified user object or a success message
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user); // Return user details as JSON
        }
        return ResponseEntity.notFound().build(); // Or a specific error message
    }

    // user profile page - now returns JSON
    @GetMapping("/profile") // Changed to GetMapping
    public ResponseEntity<?> userProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user); // Return user details as JSON
        }
        return ResponseEntity.notFound().build(); // Or a specific error message
    }

    // user add contacts page (This will be handled by ContactController as an API)
    // user view contacts (This will be handled by ContactController as an API)
    // user edit contact (This will be handled by ContactController as an API)
    // user delete contact (This will be handled by ContactController as an API)

     @GetMapping("/me")
public ResponseEntity<?> getLoggedInUser(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(401).body("User not authenticated");
    }

    // Get email directly from Authentication
    String email = authentication.getName();
    User user = userService.getUserByEmail(email);

    if (user == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(user); // Returns User object as JSON
}

}
