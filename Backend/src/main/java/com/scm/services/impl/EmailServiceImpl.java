package com.scm.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private MessageRepo messageRepo;
    
    @Override
    public Message sendEmail(MessageForm messageForm, String senderEmail) {
        return sendEmailWithAttachments(messageForm, senderEmail, null);
    }
    
    @Override
    public Message sendEmailWithAttachments(MessageForm messageForm, String senderEmail, MultipartFile[] attachments) {
        logger.info("Attempting to send email from {} to {} with {} attachments", 
                   senderEmail, messageForm.getRecipientEmail(), 
                   attachments != null ? attachments.length : 0);
        
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
            
            logger.info("Sending email with SMTP settings - Host: {}, Port: {}", 
                       "smtp.gmail.com", "587");
            
            mailSender.send(mimeMessage);
            
            // Mark as sent and save to database
            message.setSent(true);
            Message savedMessage = messageRepo.save(message);
            
            logger.info("Email sent successfully to: {} with {} attachments", 
                       messageForm.getRecipientEmail(), attachmentNames.size());
            return savedMessage;
            
        } catch (MessagingException e) {
            logger.error("Failed to create email message with attachments for: {}, Error details: {}", 
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
            logger.error("Failed to send email to: {}, Error details: {}", 
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
            
            // Provide more specific error messages
            String errorMessage = "Failed to send email";
            if (e.getMessage().contains("Authentication failed")) {
                errorMessage = "Email authentication failed. Please check your Gmail App Password.";
            } else if (e.getMessage().contains("Connection refused") || e.getMessage().contains("timeout")) {
                errorMessage = "Cannot connect to Gmail SMTP server. Please check your internet connection.";
            } else if (e.getMessage().contains("Invalid Addresses")) {
                errorMessage = "Invalid email address provided.";
            }
            
            throw new RuntimeException(errorMessage + " Details: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean sendEmail(Message message) {
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
            
            logger.info("Email sent successfully to: {}", message.getRecipientEmail());
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to send email to: {}, Error: {}", message.getRecipientEmail(), e.getMessage());
            return false;
        }
    }
    
    @Override
    public boolean sendSimpleEmail(String to, String subject, String text, String from) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(text);
            mailMessage.setFrom(from);
            
            mailSender.send(mailMessage);
            
            logger.info("Simple email sent successfully to: {}", to);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to send simple email to: {}, Error: {}", to, e.getMessage());
            return false;
        }
    }
}
