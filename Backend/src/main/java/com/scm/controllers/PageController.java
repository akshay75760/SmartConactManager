package com.scm.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin; // Import CrossOrigin
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping; // Use specific mapping
import org.springframework.web.bind.annotation.RequestBody; // For receiving JSON
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // Changed to RestController

import com.scm.entities.User;
import com.scm.forms.UserForm;
import com.scm.helpers.Message;
import com.scm.helpers.MessageType;
import com.scm.services.UserService;

import jakarta.validation.Valid;

@RestController // Changed to RestController
@CrossOrigin(origins = "http://localhost:5173") // Added CrossOrigin annotation
public class PageController {

    @Autowired
    private UserService userService;

    // Home page data - now returns JSON
    @GetMapping("/home")
    public ResponseEntity<?> home() {
        System.out.println("Home page handler - returning JSON");
        return ResponseEntity.ok(
                new Object() {
                    public final String name = "Akshay Kumar";
                    public final String linkedIn = "https://www.linkedin.com/in/akshay-kumar-7b6058252/";
                    public final String githubRepo = "https://github.com/akshay75760";
                });
    }

    // About page data - now returns JSON
    @GetMapping("/about")
    public ResponseEntity<?> aboutPage() {
        System.out.println("About page loading - returning JSON");
        return ResponseEntity.ok(
                new Object() {
                    public final String title = "About Smart Contact Manager";
                    public final String developerName = "Akshay Kumar";
                    public final String developerEmail = "kakshay70007@gmail.com";
                    public final String githubLink = "https://github.com/akshay75760";
                    public final String linkedinLink = "https://www.linkedin.com/in/akshay-kumar-7b6058252/";
                    public final String description = "Smart Contact Manager is a web-based application that allows users to efficiently manage their personal and professional contacts. It features login with Email, Google, and GitHub, supports storing and organizing contact details, and provides integrated email functionality.";
                });
    }

    // Services page data - now returns JSON
    @GetMapping("/services")
    public ResponseEntity<?> servicesPage() {
        System.out.println("Services page loading - returning JSON");
        return ResponseEntity.ok(
                new Object() {
                    public final String title = "Services Offered by SCM";
                    public final String[] features = {
                            "Easy Contact Management",
                            "Secure Storage",
                            "24/7 Access",
                            "OAuth Integration",
                            "Email Verification",
                            "Image Upload"
                    };
                });
    }

    // Contact page data - now returns JSON
    @GetMapping("/contact")
    public ResponseEntity<?> contact() {
        return ResponseEntity.ok(
                new Object() {
                    public final String name = "Akshay Kumar";
                    public final String email = "kakshay70007@gmail.com";
                    public final String github = "https://github.com/akshay75760";
                    public final String linkedin = "https://www.linkedin.com/in/akshay-kumar-7b6058252/";
                });
    }

    // Login page - React will handle the UI, this endpoint might not be directly called for UI
    // If you keep a traditional login form, this would be the target for POST
    @GetMapping("/login")
    public ResponseEntity<String> login() {
        return ResponseEntity.ok("Login endpoint for React frontend. Please use /api/auth/login for API login.");
    }

    // Registration endpoint - now accepts JSON and returns JSON
    @PostMapping("/do-register") // Changed to PostMapping
    public ResponseEntity<Message> processRegister(@Valid @RequestBody UserForm userForm) { // Use @RequestBody for JSON
        System.out.println("Processing registration via API");
        System.out.println(userForm);

        // Check if user already exists
        if (userService.isUserExistByEmail(userForm.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Message.builder()
                            .content("User with this email already exists!")
                            .type(MessageType.red)
                            .build());
        }

        User user = new User();
        user.setName(userForm.getName());
        user.setEmail(userForm.getEmail());
        user.setPassword(userForm.getPassword()); // Password will be encoded by service
        user.setAbout(userForm.getAbout());
        user.setPhoneNumber(userForm.getPhoneNumber());
        user.setEnabled(true); // User is disabled until email is verified
        user.setEmailVerified(true); // Email not verified initially
        user.setProfilePic(
                "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg");

        try {
            userService.saveUser(user); // This will also generate email token and send email
            System.out.println("User saved successfully via API");
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Message.builder()
                            .content("Registration Successful! Please check your email to verify your account.")
                            .type(MessageType.green)
                            .build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Message.builder()
                            .content("An error occurred during registration: " + e.getMessage())
                            .type(MessageType.red)
                            .build());
        }
    }
}

