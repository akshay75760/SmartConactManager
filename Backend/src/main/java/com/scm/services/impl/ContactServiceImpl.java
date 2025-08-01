package com.scm.services.impl;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.helper.ResourceNotFoundException;
import com.scm.repository.ContactRepo;
import com.scm.services.ContactService;

@Service
public class ContactServiceImpl implements ContactService {
    @Autowired
    private ContactRepo contactRepo;


    @Override
    public Contact save(Contact contact) {
         String contactid=UUID.randomUUID().toString();
         contact.setId(contactid);
         return contactRepo.save(contact);
    }


    @Override
    public Contact update(Contact contact) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public List<Contact> getAll() {
        return contactRepo.findAll();
    }

    @Override
    public Contact getById(String id) {
        return contactRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact not Found"));
    }

    @Override
    public void delete(String id) {
        var cantact = contactRepo.findById(id).orElseThrow(() ->
         new ResourceNotFoundException("Contact not Found"));

        contactRepo.delete(cantact);
    }

    @Override
    public List<Contact> search(String name, String email, String phoneNumber) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'search'");
    }

    @Override
    public List<Contact> getByUserId(String userId) {
        return contactRepo.findByUserId(userId);
    }


    @Override
    public List<Contact> getByUser(User user) {

        return contactRepo.findByUser(user);
        
    }

}
