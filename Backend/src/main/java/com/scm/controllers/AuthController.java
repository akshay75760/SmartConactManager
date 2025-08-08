package com.scm.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scm.config.JwtUtil;
import com.scm.dto.AuthResponse;
import com.scm.dto.LoginRequest;
import com.scm.entities.User;
import com.scm.services.UserService;
import com.scm.services.impl.SecurityCustomUserDetailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityCustomUserDetailService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, BindingResult result) {
        
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        
        // Check for validation errors
        if (result.hasErrors()) {
            logger.warn("Validation errors in login request: {}", result.getAllErrors());
            return ResponseEntity.badRequest().body(
                new AuthResponse(null, null, null, "Invalid input data"));
        }

        try {
            // Authenticate user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );

            // Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            
            // Get user entity for additional info
            User user = userService.getUserByEmail(loginRequest.getEmail());
            
            if (user == null) {
                logger.error("User not found after successful authentication: {}", loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse(null, null, null, "User not found"));
            }

            // Generate JWT token
            String jwt = jwtUtil.generateToken(userDetails);

            logger.info("Login successful for user: {}", loginRequest.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(
                jwt, 
                user.getEmail(), 
                user.getName(),
                "Login successful",
                user.getRoleList()
            ));

        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, null, "Invalid email or password"));
                
        } catch (Exception e) {
            logger.error("Login failed for email {}: {}", loginRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(null, null, null, "Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody String token) {
        try {
            if (jwtUtil.isTokenValid(token)) {
                String username = jwtUtil.extractUsername(token);
                User user = userService.getUserByEmail(username);
                
                if (user != null) {
                    return ResponseEntity.ok(new AuthResponse(
                        token, 
                        user.getEmail(), 
                        user.getName(),
                        "Token is valid"
                    ));
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, null, "Invalid token"));
                
        } catch (Exception e) {
            logger.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, null, "Token validation failed"));
        }
    }
}
