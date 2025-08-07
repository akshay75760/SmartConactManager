package com.scm.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Message;
import com.scm.entities.User;
import com.scm.forms.MessageForm;

public interface MessageService {
    
    /**
     * Send a message via email
     * @param messageForm The message form
     * @param sender The sender user
     * @return The saved message entity
     */
    Message sendMessage(MessageForm messageForm, User sender);
    
    /**
     * Send a message with attachments via email
     * @param messageForm The message form
     * @param sender The sender user
     * @param attachments The file attachments
     * @return The saved message entity
     */
    Message sendMessageWithAttachments(MessageForm messageForm, User sender, MultipartFile[] attachments);
    
    /**
     * Save a message
     * @param message The message to save
     * @return The saved message
     */
    Message saveMessage(Message message);
    
    /**
     * Get message by ID
     * @param messageId The message ID
     * @return The message
     */
    Message getMessageById(String messageId);
    
    /**
     * Get all messages sent by a user
     * @param sender The sender user
     * @return List of messages
     */
    List<Message> getMessagesBySender(User sender);
    
    /**
     * Get messages by recipient email
     * @param recipientEmail The recipient email
     * @return List of messages
     */
    List<Message> getMessagesByRecipientEmail(String recipientEmail);
    
    /**
     * Get all messages (for admin)
     * @return List of all messages
     */
    List<Message> getAllMessages();
    
    /**
     * Delete a message
     * @param messageId The message ID to delete
     */
    void deleteMessage(String messageId);
}
