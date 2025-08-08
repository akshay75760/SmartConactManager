package com.scm.controllers.api;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.helpers.Helper;
import com.scm.repsitories.ContactRepo;
import com.scm.services.ExcelService;
import com.scm.services.UserService;

@RestController
@RequestMapping("/api/excel")
public class ExcelApiController {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelApiController.class);
    
    @Autowired
    private ExcelService excelService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ContactRepo contactRepo;
    
    // Download template Excel file
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadTemplate() {
        logger.info("📄 API: Generating Excel template for download");
        
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
            logger.error("❌ API: Error generating template: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Import contacts from Excel
    @PostMapping("/import")
    public ResponseEntity<ImportResult> importContacts(@RequestParam("file") MultipartFile file, 
                                                      Authentication authentication) {
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        logger.info("📁 API: Starting Excel import for user: {}", username);
        
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ImportResult(false, "Please select an Excel file to import", 0));
            }
            
            List<Contact> importedContacts = excelService.importContactsFromExcel(file, user);
            
            String message = importedContacts.isEmpty() 
                ? "No contacts were imported. Please check your Excel file format."
                : "Successfully imported " + importedContacts.size() + " contacts!";
            
            logger.info("✅ API: Successfully imported {} contacts for user: {}", importedContacts.size(), username);
            
            return ResponseEntity.ok(new ImportResult(true, message, importedContacts.size()));
            
        } catch (Exception e) {
            logger.error("❌ API: Error importing Excel file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ImportResult(false, "Error importing contacts: " + e.getMessage(), 0));
        }
    }
    
    // Export contacts to Excel
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportContacts(@RequestParam(value = "favorites", defaultValue = "false") boolean favoritesOnly,
                                                Authentication authentication) {
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        logger.info("📤 API: Exporting contacts for user: {}, favorites only: {}", username, favoritesOnly);
        
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
            
            logger.info("✅ API: Successfully exported {} contacts for user: {}", contacts.size(), username);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ API: Error exporting contacts: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get contact statistics
    @GetMapping("/stats")
    public ResponseEntity<ContactStats> getContactStats(Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Pageable pageable = PageRequest.of(0, 1);
            Page<Contact> contactPage = contactRepo.findByUser(user, pageable);
            long totalContacts = contactPage.getTotalElements();
            
            // Count favorites
            List<Contact> allContacts = contactRepo.findByUser(user, PageRequest.of(0, Integer.MAX_VALUE)).getContent();
            long favoriteContacts = allContacts.stream().filter(Contact::isFavorite).count();
            
            ContactStats stats = new ContactStats(totalContacts, favoriteContacts);
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            logger.error("❌ API: Error fetching contact stats: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // DTOs for API responses
    public static class ImportResult {
        private boolean success;
        private String message;
        private int importedCount;
        
        public ImportResult(boolean success, String message, int importedCount) {
            this.success = success;
            this.message = message;
            this.importedCount = importedCount;
        }
        
        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public int getImportedCount() { return importedCount; }
    }
    
    public static class ContactStats {
        private long totalContacts;
        private long favoriteContacts;
        
        public ContactStats(long totalContacts, long favoriteContacts) {
            this.totalContacts = totalContacts;
            this.favoriteContacts = favoriteContacts;
        }
        
        // Getters
        public long getTotalContacts() { return totalContacts; }
        public long getFavoriteContacts() { return favoriteContacts; }
    }
}
