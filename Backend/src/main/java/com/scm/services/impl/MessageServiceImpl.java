package com.scm.services.impl;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Message;
import com.scm.entities.User;
import com.scm.forms.MessageForm;
import com.scm.helpers.ResourceNotFoundException;
import com.scm.repsitories.MessageRepo;
import com.scm.services.EmailService;
import com.scm.services.MessageService;

@Service
public class MessageServiceImpl implements MessageService {
    
    private static final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);
    
    @Autowired
    private MessageRepo messageRepo;
    
    @Autowired
    private EmailService emailService;
    
    @Override
    public Message sendMessage(MessageForm messageForm, User sender) {
        try {
            logger.info("Attempting to send message from {} to {}", sender.getEmail(), messageForm.getRecipientEmail());
            
            // Use EmailService to send the email and save the message
            Message sentMessage = emailService.sendEmail(messageForm, sender.getEmail());
            
            // Set the sender relationship
            sentMessage.setSender(sender);
            Message savedMessage = messageRepo.save(sentMessage);
            
            logger.info("Message sent and saved successfully with ID: {}", savedMessage.getId());
            return savedMessage;
            
        } catch (Exception e) {
            logger.error("Failed to send message from {} to {}: {}", 
                        sender.getEmail(), messageForm.getRecipientEmail(), e.getMessage());
            throw new RuntimeException("Failed to send message: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Message sendMessageWithAttachments(MessageForm messageForm, User sender, MultipartFile[] attachments) {
        try {
            logger.info("Attempting to send message with attachments from {} to {}", 
                       sender.getEmail(), messageForm.getRecipientEmail());
            
            // Use EmailService to send the email with attachments and save the message
            Message sentMessage = emailService.sendEmailWithAttachments(messageForm, sender.getEmail(), attachments);
            
            // Set the sender relationship
            sentMessage.setSender(sender);
            Message savedMessage = messageRepo.save(sentMessage);
            
            logger.info("Message with attachments sent and saved successfully with ID: {}", savedMessage.getId());
            return savedMessage;
            
        } catch (Exception e) {
            logger.error("Failed to send message with attachments from {} to {}: {}", 
                        sender.getEmail(), messageForm.getRecipientEmail(), e.getMessage());
            throw new RuntimeException("Failed to send message with attachments: " + e.getMessage(), e);
        }
    }
    
    @Override
    public Message saveMessage(Message message) {
        if (message.getId() == null || message.getId().isEmpty()) {
            message.setId(UUID.randomUUID().toString());
        }
        return messageRepo.save(message);
    }
    
    @Override
    public Message getMessageById(String messageId) {
        return messageRepo.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));
    }
    
    @Override
    public List<Message> getMessagesBySender(User sender) {
        return messageRepo.findBySender(sender);
    }
    
    @Override
    public List<Message> getMessagesByRecipientEmail(String recipientEmail) {
        return messageRepo.findByRecipientEmail(recipientEmail);
    }
    
    @Override
    public List<Message> getAllMessages() {
        return messageRepo.findAll();
    }
    
    @Override
    public void deleteMessage(String messageId) {
        Message message = getMessageById(messageId);
        messageRepo.delete(message);
        logger.info("Message deleted with ID: {}", messageId);
    }
}
