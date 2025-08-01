package com.scm.controller;

import java.util.*;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.security.core.Authentication;

import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.forms.ContactForm;
import com.scm.helper.Helper;
import com.scm.helper.Message;
import com.scm.helper.MessageType;
import com.scm.services.ContactService;
import com.scm.services.UserService;
import com.scm.services.imageService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.ModelAttribute;


@Controller
@RequestMapping("/user/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;
    @Autowired
    private UserService userService;

    @Autowired
    private imageService imageservice;

    private Logger logger =org.slf4j.LoggerFactory.getLogger(ContactController.class);

    @RequestMapping("/add")
    // Add Contact page
    public String addContactView(Model model ){
        ContactForm contactForm = new ContactForm();
        // contactForm.setName("Akshay");
        // contactForm.setFavorite(true);
        model.addAttribute("contactForm", contactForm);
        return "user/add_contact";
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String saveContact(@Valid @ModelAttribute ContactForm contactForm, BindingResult result,
     Authentication authentication, HttpSession session) {

        
        // Process the Form data

        // validate the form

        // if(result.hasErrors()){
        //     return "user/add_contact";
        // }

        if (result.hasErrors()) {
            result.getAllErrors().forEach(error -> logger.info(error.toString()));

            session.setAttribute("message", Message.builder()
                    .content("Please correct the following errors")
                    .type(MessageType.red)
                    .build());
            return "user/add_contact";
        }

        String username = Helper.getEmailOfLoggedinUser(authentication);


        // Form -->Contact
        User user =userService.getUserByEmail(username);


        

        // Process the contact picture
        logger.info("File Imformation:{}", contactForm.getContactImage().getOriginalFilename());

        String filename= UUID.randomUUID().toString();
        
        String fileURL = imageservice.uploadImage(contactForm.getContactImage(), filename);

        Contact cantact = new Contact();

        

        cantact.setName(contactForm.getName());
        cantact.setEmail(contactForm.getEmail());
        cantact.setPhoneNumber(contactForm.getPhoneNumber());
        cantact.setFavorite(contactForm.isFavorite());
        cantact.setAddress(contactForm.getAddress());
        cantact.setDescription(contactForm.getDescription());
        cantact.setUser(user);
        cantact.setWebsiteLink(contactForm.getWebsiteLink());
        cantact.setLinkedinLink(contactForm.getLinkedinLink());
        cantact.setPicture(fileURL); 
        cantact.setCloudinaryImagePublicId(filename);


        // Set contact picture url


        // Set message to be displaed on the view

        contactService.save(cantact);

        
        System.out.println(contactForm);

        session.setAttribute("message", Message.builder()
                    .content("you have succesfully added a new contact")
                    .type(MessageType.green)
                    .build());
        // session.setAttribute("message", "");
        return "redirect:/user/contacts/add";
    }
    


    //View contacts

    @RequestMapping
    public String viewContacts(Model model,Authentication authentication) {

        //load all the  User contact

        String username= Helper.getEmailOfLoggedinUser(authentication);
        User user =userService.getUserByEmail(username);

        List<Contact> contacts=contactService.getByUser(user);
        model.addAttribute("contacts", contacts);

        return "/user/contacts";
    }
}
