package com.scm.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Message;
import com.scm.forms.MessageForm;
import com.scm.repsitories.MessageRepo;
import com.scm.services.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.host:}")
    private String mailHost;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    @Autowired
    private MessageRepo messageRepo;
    
    // Method for sending registration success emails (simple HTML emails)
    @Override
    public void sendEmail(String to, String subject, String body) {
        logger.info("🔵 Attempting to send HTML email to: {}", to);
        
        // Check if email configuration is available
        if (mailSender == null || mailHost == null || mailHost.trim().isEmpty()) {
            logger.warn("⚠️ Email service not configured - skipping email sending");
            return;
        }
        
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true indicates HTML content
            
            // Set from address using configured email
            if (mailUsername != null && !mailUsername.trim().isEmpty()) {
                helper.setFrom(mailUsername);
            }
            
            mailSender.send(mimeMessage);
            logger.info("✅ HTML email sent successfully to: {}", to);
            
        } catch (MessagingException e) {
            logger.error("❌ Failed to create HTML email message for: {}, Error: {}", to, e.getMessage());
            // Don't throw exception for email failures during registration
            logger.warn("⚠️ Email sending failed but continuing with registration process");
        } catch (Exception e) {
            logger.error("❌ Failed to send HTML email to: {}, Error: {}", to, e.getMessage());
            if (e.getMessage().contains("Authentication failed")) {
                logger.error("🚨 Email authentication failed. Please check your SMTP credentials in application.properties");
            }
            // Don't throw exception for email failures during registration
            logger.warn("⚠️ Email sending failed but continuing with registration process");
        }
    }
    
    @Override
    public Message sendEmail(MessageForm messageForm, String senderEmail) {
        return sendEmailWithAttachments(messageForm, senderEmail, null);
    }
    
    @Override
    public Message sendEmailWithAttachments(MessageForm messageForm, String senderEmail, MultipartFile[] attachments) {
        logger.info("🔵 Attempting to send email from {} to {} with {} attachments", 
                   senderEmail, messageForm.getRecipientEmail(), 
                   attachments != null ? attachments.length : 0);
        
        // Check if email configuration is available
        if (mailSender == null || mailHost == null || mailHost.trim().isEmpty()) {
            logger.warn("⚠️ Email service not configured - skipping email sending");
            
            // Still create and save message entity for testing purposes
            Message message = new Message();
            message.setId(UUID.randomUUID().toString());
            message.setRecipientEmail(messageForm.getRecipientEmail());
            message.setSubject(messageForm.getSubject());
            message.setMessageBody(messageForm.getMessageBody());
            message.setSenderEmail(senderEmail);
            
            // Store attachment file names if any
            List<String> attachmentNames = new ArrayList<>();
            if (attachments != null && attachments.length > 0) {
                for (MultipartFile attachment : attachments) {
                    if (!attachment.isEmpty()) {
                        String filename = attachment.getOriginalFilename();
                        if (filename != null && !filename.trim().isEmpty()) {
                            attachmentNames.add(filename);
                        }
                    }
                }
                message.setAttachmentPaths(attachmentNames);
            }
            
            Message savedMessage = messageRepo.save(message);
            logger.info("✅ Message saved (SKIPPED_NO_CONFIG) due to missing email configuration");
            return savedMessage;
        }
        
        try {
            // Create Message entity
            Message message = new Message();
            message.setId(UUID.randomUUID().toString());
            message.setRecipientEmail(messageForm.getRecipientEmail());
            message.setSubject(messageForm.getSubject());
            message.setMessageBody(messageForm.getMessageBody());
            message.setSenderEmail(senderEmail);
            
            // Store attachment file names if any
            List<String> attachmentNames = new ArrayList<>();
            if (attachments != null && attachments.length > 0) {
                for (MultipartFile attachment : attachments) {
                    if (!attachment.isEmpty()) {
                        String filename = attachment.getOriginalFilename();
                        if (filename != null && !filename.trim().isEmpty()) {
                            attachmentNames.add(filename);
                        }
                    }
                }
                message.setAttachmentPaths(attachmentNames);
            }
            
            // Create MIME message for attachments
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(messageForm.getRecipientEmail());
            helper.setSubject(messageForm.getSubject());
            
            // Format the email body with sender information
            String emailBody = "From: " + senderEmail + "\n\n" + messageForm.getMessageBody();
            helper.setText(emailBody);
            helper.setFrom(senderEmail);
            
            // Add attachments if provided
            if (attachments != null && attachments.length > 0) {
                for (MultipartFile attachment : attachments) {
                    if (!attachment.isEmpty()) {
                        String filename = attachment.getOriginalFilename();
                        if (filename != null && !filename.trim().isEmpty()) {
                            helper.addAttachment(filename, attachment);
                            logger.info("Added attachment: {}", filename);
                        }
                    }
                }
            }
            
            logger.info("📧 Sending email with SMTP settings - Host: {}, Port: {}", 
                       "smtp.gmail.com", "587");
            
            mailSender.send(mimeMessage);
            
            // Mark as sent and save to database
            message.setSent(true);
            Message savedMessage = messageRepo.save(message);
            
            logger.info("✅ Email sent successfully to: {} with {} attachments", 
                       messageForm.getRecipientEmail(), attachmentNames.size());
            return savedMessage;
            
        } catch (MessagingException e) {
            logger.error("❌ Failed to create email message with attachments for: {}, Error details: {}", 
                        messageForm.getRecipientEmail(), e.getMessage(), e);
            
            // Save message with sent = false for tracking failed attempts
            Message message = new Message();
            message.setId(UUID.randomUUID().toString());
            message.setRecipientEmail(messageForm.getRecipientEmail());
            message.setSubject(messageForm.getSubject());
            message.setMessageBody(messageForm.getMessageBody());
            message.setSenderEmail(senderEmail);
            message.setSent(false);
            
            messageRepo.save(message);
            
            throw new RuntimeException("Failed to create email message with attachments: " + e.getMessage(), e);
            
        } catch (Exception e) {
            logger.error("❌ Failed to send email to: {}, Error details: {}", 
                        messageForm.getRecipientEmail(), e.getMessage(), e);
            
            // Save message with sent = false for tracking failed attempts
            Message message = new Message();
            message.setId(UUID.randomUUID().toString());
            message.setRecipientEmail(messageForm.getRecipientEmail());
            message.setSubject(messageForm.getSubject());
            message.setMessageBody(messageForm.getMessageBody());
            message.setSenderEmail(senderEmail);
            message.setSent(false);
            
            // Provide more specific error messages
            String errorMessage = "Failed to send email";
            if (e.getMessage().contains("Authentication failed")) {
                errorMessage = "Email authentication failed. Please check your Gmail App Password.";
            } else if (e.getMessage().contains("Connection refused") || e.getMessage().contains("timeout")) {
                errorMessage = "Cannot connect to Gmail SMTP server. Please check your internet connection.";
            } else if (e.getMessage().contains("Invalid Addresses")) {
                errorMessage = "Invalid email address provided.";
            }
            
            messageRepo.save(message);
            
            logger.error("🚨 Email sending failed - {}", errorMessage);
            throw new RuntimeException(errorMessage + " Details: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean sendEmail(Message message) {
        logger.info("🔵 Attempting to send simple email to: {}", message.getRecipientEmail());
        
        // Check if email configuration is available
        if (mailSender == null || mailHost == null || mailHost.trim().isEmpty()) {
            logger.warn("⚠️ Email service not configured - skipping email sending");
            message.setSent(false);
            messageRepo.save(message);
            return false;
        }
        
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(message.getRecipientEmail());
            mailMessage.setSubject(message.getSubject());
            mailMessage.setText(message.getMessageBody());
            mailMessage.setFrom(message.getSenderEmail());
            
            mailSender.send(mailMessage);
            
            // Update sent status
            message.setSent(true);
            messageRepo.save(message);
            
            logger.info("✅ Email sent successfully to: {}", message.getRecipientEmail());
            return true;
            
        } catch (Exception e) {
            logger.error("❌ Failed to send email to: {}, Error: {}", message.getRecipientEmail(), e.getMessage());
            message.setSent(false);
            messageRepo.save(message);
            return false;
        }
    }
    
    @Override
    public boolean sendSimpleEmail(String to, String subject, String text, String from) {
        logger.info("🔵 Attempting to send simple email to: {}", to);
        
        // Check if email configuration is available
        if (mailSender == null || mailHost == null || mailHost.trim().isEmpty()) {
            logger.warn("⚠️ Email service not configured - skipping simple email sending");
            return false;
        }
        
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(text);
            mailMessage.setFrom(from);
            
            mailSender.send(mailMessage);
            
            logger.info("✅ Simple email sent successfully to: {}", to);
            return true;
            
        } catch (Exception e) {
            logger.error("❌ Failed to send simple email to: {}, Error: {}", to, e.getMessage());
            return false;
        }
    }
}
