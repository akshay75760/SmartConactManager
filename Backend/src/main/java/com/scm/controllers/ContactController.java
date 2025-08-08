package com.scm.controllers;

import java.util.*;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin; // Import CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping; // Use specific mapping
import org.springframework.web.bind.annotation.GetMapping; // Use specific mapping
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // Use specific mapping
import org.springframework.web.bind.annotation.PutMapping; // Use specific mapping
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart; // For multipart form data
import org.springframework.web.bind.annotation.RestController; // Changed to RestController
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // For returning ResponseEntity

import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.forms.ContactForm;
import com.scm.forms.ContactSearchForm;
import com.scm.helpers.AppConstants;
import com.scm.helpers.Helper;
import com.scm.helpers.Message;
import com.scm.helpers.MessageType;
import com.scm.helpers.ResourceNotFoundException;
import com.scm.services.ContactService;
import com.scm.services.ImageService;
import com.scm.services.UserService;

import jakarta.servlet.http.HttpSession; // HttpSession is generally not used in stateless REST APIs
import jakarta.validation.Valid;

@RestController // Changed to RestController
@RequestMapping("/user/contacts") // Consider changing this to /api/user/contacts for consistency
@CrossOrigin(origins = "http://localhost:5173") // Added CrossOrigin annotation
public class ContactController {

    private Logger logger = org.slf4j.LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;

    // Add contact endpoint - now accepts multipart/form-data and returns JSON
    @PostMapping("/add") // Changed to PostMapping
    public ResponseEntity<?> saveContact(
            @Valid @RequestPart("contact") ContactForm contactForm, // Use @RequestPart for JSON part
            @RequestPart(value = "contactImage", required = false) MultipartFile contactImage, // Use @RequestPart for file
            Authentication authentication) {

        // No BindingResult needed directly here for JSON validation, Spring handles it
        // and throws MethodArgumentNotValidException which can be handled globally.
        // However, if you want to return custom error messages, you'd catch it.

        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Message.builder().content("User not found or not authenticated.").type(MessageType.red).build());
            }

            Contact contact = new Contact();
            contact.setName(contactForm.getName());
            contact.setFavorite(contactForm.isFavorite());
            contact.setEmail(contactForm.getEmail());
            contact.setPhoneNumber(contactForm.getPhoneNumber());
            contact.setAddress(contactForm.getAddress());
            contact.setDescription(contactForm.getDescription());
            contact.setUser(user);
            contact.setLinkedInLink(contactForm.getLinkedInLink());
            contact.setWebsiteLink(contactForm.getWebsiteLink());

            if (contactImage != null && !contactImage.isEmpty()) {
                String filename = UUID.randomUUID().toString();
                String fileURL = imageService.uploadImage(contactImage, filename);
                contact.setPicture(fileURL);
                contact.setCloudinaryImagePublicId(filename);
            }

            Contact savedContact = contactService.save(contact);
            logger.info("Contact saved: {}", savedContact.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedContact); // Return the saved contact
        } catch (Exception e) {
            logger.error("Error saving contact: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Message.builder()
                            .content("Error adding contact: " + e.getMessage())
                            .type(MessageType.red)
                            .build());
        }
    }

    // View contacts endpoint - now returns JSON (paginated)
    @GetMapping // Changed to GetMapping
    public ResponseEntity<Page<Contact>> viewContacts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = AppConstants.PAGE_SIZE + "") int size,
            @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
            @RequestParam(value = "direction", defaultValue = "asc") String direction,
            Authentication authentication) {

        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Or return a specific error message
        }

        Page<Contact> pageContact = contactService.getByUser(user, page, size, sortBy, direction);
        return ResponseEntity.ok(pageContact);
    }

    // Search handler endpoint - now returns JSON (paginated)
    @GetMapping("/search") // Changed to GetMapping
    public ResponseEntity<Page<Contact>> searchHandler(
            @RequestParam String field,
            @RequestParam String value,
            @RequestParam(value = "size", defaultValue = AppConstants.PAGE_SIZE + "") int size,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "sortBy", defaultValue = "name") String sortBy,
            @RequestParam(value = "direction", defaultValue = "asc") String direction,
            Authentication authentication) {

        logger.info("Search field: {}, keyword: {}", field, value);

        User user = userService.getUserByEmail(Helper.getEmailOfLoggedInUser(authentication));
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Page<Contact> pageContact = null;
        if (field.equalsIgnoreCase("name")) {
            pageContact = contactService.searchByName(value, size, page, sortBy, direction, user);
        } else if (field.equalsIgnoreCase("email")) {
            pageContact = contactService.searchByEmail(value, size, page, sortBy, direction, user);
        } else if (field.equalsIgnoreCase("phone")) {
            pageContact = contactService.searchByPhoneNumber(value, size, page, sortBy, direction, user);
        } else {
            return ResponseEntity.badRequest().build(); // Invalid search field
        }

        logger.info("PageContact results: {}", pageContact.getTotalElements());
        return ResponseEntity.ok(pageContact);
    }

    // Delete contact endpoint - now returns JSON message
    @DeleteMapping("/delete/{contactId}") // Changed to DeleteMapping
    public ResponseEntity<Message> deleteContact(
            @PathVariable("contactId") String contactId,
            Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Message.builder().content("User not found or not authenticated.").type(MessageType.red).build());
            }

            Contact contactToDelete = contactService.getById(contactId);
            // Ensure the contact belongs to the authenticated user
            if (!contactToDelete.getUser().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        Message.builder().content("Access denied to delete this contact.").type(MessageType.red).build());
            }

            contactService.delete(contactId);
            logger.info("Contact {} deleted", contactId);

            return ResponseEntity.ok(
                    Message.builder()
                            .content("Contact is Deleted successfully !! ")
                            .type(MessageType.green)
                            .build());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Message.builder().content(e.getMessage()).type(MessageType.red).build());
        } catch (Exception e) {
            logger.error("Error deleting contact {}: {}", contactId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Message.builder().content("Error deleting contact: " + e.getMessage()).type(MessageType.red).build());
        }
    }

    // Update contact form view (This will be handled by React UI)
    // This endpoint will now return the contact data for the React form to pre-populate
    @GetMapping("/view/{contactId}") // Changed to GetMapping
    public ResponseEntity<?> updateContactFormView(
            @PathVariable("contactId") String contactId,
            Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Message.builder().content("User not found or not authenticated.").type(MessageType.red).build());
            }

            var contact = contactService.getById(contactId);
            // Ensure the contact belongs to the authenticated user
            if (!contact.getUser().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        Message.builder().content("Access denied to view this contact for update.").type(MessageType.red).build());
            }

            // Return the contact object directly. React will map it to its form state.
            return ResponseEntity.ok(contact);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Message.builder().content(e.getMessage()).type(MessageType.red).build());
        } catch (Exception e) {
            logger.error("Error fetching contact for update {}: {}", contactId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Message.builder().content("Error fetching contact for update: " + e.getMessage()).type(MessageType.red).build());
        }
    }

    // Update contact endpoint - now accepts multipart/form-data and returns JSON
    @PutMapping("/update/{contactId}") // Changed to PutMapping
    public ResponseEntity<?> updateContact(
            @PathVariable("contactId") String contactId,
            @Valid @RequestPart("contact") ContactForm contactForm, // Use @RequestPart for JSON part
            @RequestPart(value = "contactImage", required = false) MultipartFile contactImage, // Use @RequestPart for file
            Authentication authentication) {

        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        Message.builder().content("User not found or not authenticated.").type(MessageType.red).build());
            }

            var con = contactService.getById(contactId);
            // Ensure the contact belongs to the authenticated user
            if (!con.getUser().getUserId().equals(user.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        Message.builder().content("Access denied to update this contact.").type(MessageType.red).build());
            }

            con.setId(contactId); // Ensure ID is set for update
            con.setName(contactForm.getName());
            con.setEmail(contactForm.getEmail());
            con.setPhoneNumber(contactForm.getPhoneNumber());
            con.setAddress(contactForm.getAddress());
            con.setDescription(contactForm.getDescription());
            con.setFavorite(contactForm.isFavorite());
            con.setWebsiteLink(contactForm.getWebsiteLink());
            con.setLinkedInLink(contactForm.getLinkedInLink());

            // Process image:
            if (contactImage != null && !contactImage.isEmpty()) {
                logger.info("New image provided for update");
                // Optionally delete old image from Cloudinary if it exists
                // if (con.getCloudinaryImagePublicId() != null && !con.getCloudinaryImagePublicId().isEmpty()) {
                //     imageService.deleteImage(con.getCloudinaryImagePublicId());
                // }
                String fileName = UUID.randomUUID().toString();
                String imageUrl = imageService.uploadImage(contactImage, fileName);
                con.setCloudinaryImagePublicId(fileName);
                con.setPicture(imageUrl);
            } else if (contactForm.getPicture() == null || contactForm.getPicture().isEmpty()) {
                // If no new image and picture field is explicitly cleared, remove existing image
                logger.info("Image explicitly cleared or no new image provided.");
                // if (con.getCloudinaryImagePublicId() != null && !con.getCloudinaryImagePublicId().isEmpty()) {
                //     imageService.deleteImage(con.getCloudinaryImagePublicId());
                // }
                con.setPicture(null);
                con.setCloudinaryImagePublicId(null);
            } else {
                logger.info("No new image provided, keeping existing image.");
                // Keep existing picture and public ID if no new image is uploaded and not explicitly cleared
                // The `contactForm.getPicture()` might contain the old URL if the frontend sends it back.
                // Ensure your frontend sends the existing picture URL if it's not changed.
                con.setPicture(contactForm.getPicture());
                // Cloudinary public ID might need to be re-fetched or stored in the form if you need it for deletion later.
                // For now, assuming it's managed internally or not needed for update if no new image.
            }


            var updateCon = contactService.update(con);
            logger.info("Updated contact {}", updateCon.getId());

            return ResponseEntity.ok(updateCon); // Return the updated contact
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Message.builder().content(e.getMessage()).type(MessageType.red).build());
        } catch (Exception e) {
            logger.error("Error updating contact {}: {}", contactId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Message.builder().content("Error updating contact: " + e.getMessage()).type(MessageType.red).build());
        }
    }
}
