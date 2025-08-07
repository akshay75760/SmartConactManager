package com.scm.forms;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MessageForm {
    
    @NotBlank(message = "Recipient email is required")
    @Email(message = "Please enter a valid email address")
    private String recipientEmail;
    
    @NotBlank(message = "Subject is required")
    @Size(max = 200, message = "Subject cannot be more than 200 characters")
    private String subject;
    
    @NotBlank(message = "Message body is required")
    @Size(max = 5000, message = "Message cannot be more than 5000 characters")
    private String messageBody;
    
    // For file attachments
    private MultipartFile[] attachments;
    
    public MessageForm() {}
    
    public MessageForm(String recipientEmail, String subject, String messageBody) {
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.messageBody = messageBody;
    }
    
    // Getters and Setters
    public String getRecipientEmail() {
        return recipientEmail;
    }
    
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getMessageBody() {
        return messageBody;
    }
    
    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }
    
    public MultipartFile[] getAttachments() {
        return attachments;
    }
    
    public void setAttachments(MultipartFile[] attachments) {
        this.attachments = attachments;
    }
    
    @Override
    public String toString() {
        return "MessageForm{" +
                "recipientEmail='" + recipientEmail + '\'' +
                ", subject='" + subject + '\'' +
                ", messageBody='" + messageBody + '\'' +
                ", attachments=" + (attachments != null ? attachments.length + " files" : "no attachments") +
                '}';
    }
}
