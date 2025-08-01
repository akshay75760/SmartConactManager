package com.scm.services;

import java.util.*;

import com.scm.entities.Contact;
import com.scm.entities.User;


public interface ContactService {


    // Save Contact 
    Contact save(Contact contact);

    // Update Contact
    Contact update(Contact contact);

    // get Contact
    List<Contact> getAll();

    // Geyt by id
    Contact getById(String id);

    // Delete Contact
    void delete(String id);

    // Seacrh Contact
    List<Contact> search(String name , String email , String phoneNumber);

    // get cantact by user id
    List<Contact> getByUserId(String userId);

    List<Contact> getByUser(User user);
}
