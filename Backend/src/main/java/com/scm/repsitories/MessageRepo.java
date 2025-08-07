package com.scm.repsitories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scm.entities.Message;
import com.scm.entities.User;

@Repository
public interface MessageRepo extends JpaRepository<Message, String> {
    
    // Find messages by sender
    List<Message> findBySender(User sender);
    
    // Find messages by sender email
    List<Message> findBySenderEmail(String senderEmail);
    
    // Find messages by recipient email
    List<Message> findByRecipientEmail(String recipientEmail);
    
    // Find sent messages
    List<Message> findBySent(boolean sent);
    
    // Find messages by sender and sent status
    List<Message> findBySenderAndSent(User sender, boolean sent);
}
