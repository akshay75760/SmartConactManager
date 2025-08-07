package com.scm.services;

import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Message;
import com.scm.forms.MessageForm;

public interface EmailService {
    
    /**
     * Send email using SMTP
     * @param messageForm The message form containing email details
     * @param senderEmail The email of the sender
     * @return Message entity representing the sent message
     */
    Message sendEmail(MessageForm messageForm, String senderEmail);
    
    /**
     * Send email with attachments using SMTP
     * @param messageForm The message form containing email details
     * @param senderEmail The email of the sender
     * @param attachments Array of file attachments
     * @return Message entity representing the sent message
     */
    Message sendEmailWithAttachments(MessageForm messageForm, String senderEmail, MultipartFile[] attachments);
    
    /**
     * Send email using Message entity
     * @param message The message entity to send
     * @return boolean indicating success/failure
     */
    boolean sendEmail(Message message);
    
    /**
     * Send a simple text email
     * @param to Recipient email
     * @param subject Email subject
     * @param text Email body
     * @param from Sender email
     * @return boolean indicating success/failure
     */
    boolean sendSimpleEmail(String to, String subject, String text, String from);
}
