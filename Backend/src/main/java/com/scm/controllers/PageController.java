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
import com.scm.services.EmailService;
import com.scm.services.UserService;
import org.springframework.core.env.Environment;
import jakarta.validation.Valid;

@RestController // Changed to RestController
@CrossOrigin(origins = "http://localhost:5173") // Added CrossOrigin annotation
public class PageController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private Environment env;

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

            // Send welcome email with better error handling
            try {
                String emailSubject = "🎉 Welcome to Smart Contact Manager - Registration Successful!";
                String emailBody = "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<style>" +
                        "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }" +
                        ".container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }" +
                        ".header { text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 20px; margin-bottom: 30px; }" +
                        ".content { color: #333; line-height: 1.6; }" +
                        ".highlight { color: #3498db; font-weight: bold; }" +
                        ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; text-align: center; color: #7f8c8d; }" +
                        ".button { display: inline-block; padding: 12px 25px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='container'>" +
                        "<div class='header'>" +
                        "<h1>🎉 Welcome to Smart Contact Manager!</h1>" +
                        "</div>" +
                        "<div class='content'>" +
                        "<p>Dear <span class='highlight'>" + user.getName() + "</span>,</p>" +
                        "<p>Congratulations! Your registration with <strong>Smart Contact Manager</strong> has been completed successfully.</p>" +
                        "<p>You can now enjoy the following features:</p>" +
                        "<ul>" +
                        "<li>📱 Manage your contacts efficiently</li>" +
                        "<li>🔒 Secure data storage</li>" +
                        "<li>📧 Integrated email functionality</li>" +
                        "<li>☁️ Cloud-based image storage</li>" +
                        "<li>🌐 Access from anywhere, anytime</li>" +
                        "</ul>" +
                        "<p>Your account is now ready to use. You can log in using the email address: <span class='highlight'>" + user.getEmail() + "</span></p>" +
                        "<div style='text-align: center;'>" +
                        "<a href='http://localhost:5173/login' class='button'>Login to Your Account</a>" +
                        "</div>" +
                        "</div>" +
                        "<div class='footer'>" +
                        "<p>Thank you for choosing Smart Contact Manager!</p>" +
                        "<p><strong>SCM Team</strong></p>" +
                        "<p><small>This is an automated message. Please do not reply to this email.</small></p>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";
                
                emailService.sendEmail(user.getEmail(), emailSubject, emailBody);
                System.out.println("✅ Welcome email sent successfully to: " + user.getEmail());
                
                return ResponseEntity.status(HttpStatus.CREATED).body(
                        Message.builder()
                                .content("🎉 Registration Successful! Welcome email has been sent to " + user.getEmail())
                                .type(MessageType.green)
                                .build());
                
            } catch (Exception emailException) {
                System.err.println("❌ Failed to send welcome email: " + emailException.getMessage());
                // Continue with registration success even if email fails
                return ResponseEntity.status(HttpStatus.CREATED).body(
                        Message.builder()
                                .content("🎉 Registration Successful! (Note: Welcome email could not be sent due to email configuration issues)")
                                .type(MessageType.green)
                                .build());
            }
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

