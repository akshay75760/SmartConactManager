package com.scm.services;

import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Message;
import com.scm.forms.MessageForm;

public interface EmailService {
    
    // Method for sending registration success emails (simple HTML emails)
    void sendEmail(String to, String subject, String body);
    
    // Method for sending emails with attachments using MessageForm
    Message sendEmail(MessageForm messageForm, String senderEmail);
    
    // Method for sending emails with attachments
    Message sendEmailWithAttachments(MessageForm messageForm, String senderEmail, MultipartFile[] attachments);
    
    // Method for sending simple Message entity emails
    boolean sendEmail(Message message);
    
    // Method for sending simple text emails
    boolean sendSimpleEmail(String to, String subject, String text, String from);
}