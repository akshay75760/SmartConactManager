package com.scm.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class EmailTestController {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @GetMapping("/email")
    public ResponseEntity<String> testEmail() {
        // Check if email is configured
        if (mailSender == null) {
            return ResponseEntity.ok("Email service not configured - testing disabled");
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("test@example.com");
            message.setSubject("Test Email from Smart Contact Manager");
            message.setText("This is a test email to verify SMTP configuration.");
            message.setFrom("no-reply@scm.com");

            mailSender.send(message);
            return ResponseEntity.ok("Test email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Failed to send test email: " + e.getMessage());
        }
    }
}
