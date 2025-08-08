package com.scm.controllers;

import java.io.InputStream;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.helpers.Helper;
import com.scm.helpers.Message;
import com.scm.helpers.MessageType;
import com.scm.repsitories.ContactRepo;
import com.scm.services.ExcelService;
import com.scm.services.UserService;

@Controller
@RequestMapping("/user/excel-html")  // Changed to avoid conflict with React routes
public class ExcelController {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelController.class);
    
    @Autowired
    private ExcelService excelService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ContactRepo contactRepo;
    
    // Show Excel import/export page
    @GetMapping
    public String excelPage(Model model, Authentication authentication) {
        logger.info("📊 Loading Excel import/export page for user: {}", authentication.getName());
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        // Get contact count for display
        Pageable pageable = PageRequest.of(0, 1);
        Page<Contact> contactPage = contactRepo.findByUser(user, pageable);
        
        model.addAttribute("totalContacts", contactPage.getTotalElements());
        model.addAttribute("title", "Import/Export Contacts");
        
        return "user/excel";
    }
    
    // Download template Excel file
    @GetMapping("/template")
    @ResponseBody
    public ResponseEntity<InputStreamResource> downloadTemplate() {
        logger.info("📄 Generating Excel template for download");
        
        try {
            InputStream templateStream = excelService.getTemplateFile();
            
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=contact_import_template.xlsx");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(templateStream));
                    
        } catch (Exception e) {
            logger.error("❌ Error generating template: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Import contacts from Excel
    @PostMapping("/import")
    public String importContacts(@RequestParam("file") MultipartFile file, 
                               Authentication authentication,
                               RedirectAttributes redirectAttributes) {
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        logger.info("📁 Starting Excel import for user: {}", username);
        
        try {
            if (file.isEmpty()) {
                redirectAttributes.addFlashAttribute("message", 
                    Message.builder()
                        .content("Please select an Excel file to import")
                        .type(MessageType.red)
                        .build()
                );
                return "redirect:/user/excel";
            }
            
            List<Contact> importedContacts = excelService.importContactsFromExcel(file, user);
            
            if (importedContacts.isEmpty()) {
                redirectAttributes.addFlashAttribute("message", 
                    Message.builder()
                        .content("No contacts were imported. Please check your Excel file format.")
                        .type(MessageType.yellow)
                        .build()
                );
            } else {
                redirectAttributes.addFlashAttribute("message", 
                    Message.builder()
                        .content("Successfully imported " + importedContacts.size() + " contacts! 🎉")
                        .type(MessageType.green)
                        .build()
                );
                logger.info("✅ Successfully imported {} contacts for user: {}", importedContacts.size(), username);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error importing Excel file: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("message", 
                Message.builder()
                    .content("Error importing contacts: " + e.getMessage())
                    .type(MessageType.red)
                    .build()
            );
        }
        
        return "redirect:/user/excel";
    }
    
    // Export contacts to Excel
    @GetMapping("/export")
    @ResponseBody
    public ResponseEntity<byte[]> exportContacts(@RequestParam(value = "favorites", defaultValue = "false") boolean favoritesOnly,
                                                Authentication authentication) {
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        logger.info("📤 Exporting contacts for user: {}, favorites only: {}", username, favoritesOnly);
        
        try {
            List<Contact> contacts;
            if (favoritesOnly) {
                // Get only favorite contacts
                Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.ASC, "name"));
                contacts = contactRepo.findByUser(user, pageable).stream()
                    .filter(Contact::isFavorite)
                    .toList();
            } else {
                // Get all contacts
                Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.ASC, "name"));
                contacts = contactRepo.findByUser(user, pageable).getContent();
            }
            
            byte[] excelBytes = excelService.exportContactsToExcel(contacts);
            
            HttpHeaders headers = new HttpHeaders();
            String filename = favoritesOnly ? "favorite_contacts.xlsx" : "all_contacts.xlsx";
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            
            logger.info("✅ Successfully exported {} contacts for user: {}", contacts.size(), username);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error exporting contacts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
