package com.scm.services.impl;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Contact;
import com.scm.entities.User;
import com.scm.repsitories.ContactRepo;
import com.scm.services.ExcelService;

@Service
public class ExcelServiceImpl implements ExcelService {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelServiceImpl.class);
    
    @Autowired
    private ContactRepo contactRepo;
    
    // Excel column indices
    private static final int NAME_COLUMN = 0;
    private static final int EMAIL_COLUMN = 1;
    private static final int PHONE_COLUMN = 2;
    private static final int ADDRESS_COLUMN = 3;
    private static final int DESCRIPTION_COLUMN = 4;
    private static final int WEBSITE_COLUMN = 5;
    private static final int LINKEDIN_COLUMN = 6;
    private static final int FAVORITE_COLUMN = 7;

    @Override
    public List<Contact> importContactsFromExcel(MultipartFile file, User user) throws Exception {
        logger.info("📁 Starting Excel import for user: {}", user.getEmail());
        
        if (!validateExcelFile(file)) {
            throw new IllegalArgumentException("Invalid Excel file format");
        }
        
        List<Contact> importedContacts = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip header row (row 0)
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;
                
                try {
                    Contact contact = createContactFromRow(row, user, rowIndex);
                    if (contact != null) {
                        // Check for duplicate email
                        if (contactRepo.findByEmailAndUser(contact.getEmail(), user).isPresent()) {
                            errors.add("Row " + (rowIndex + 1) + ": Email " + contact.getEmail() + " already exists");
                            continue;
                        }
                        
                        Contact savedContact = contactRepo.save(contact);
                        importedContacts.add(savedContact);
                        logger.debug("✅ Imported contact: {} from row {}", contact.getName(), rowIndex + 1);
                    }
                } catch (Exception e) {
                    errors.add("Row " + (rowIndex + 1) + ": " + e.getMessage());
                    logger.warn("❌ Error processing row {}: {}", rowIndex + 1, e.getMessage());
                }
            }
        }
        
        logger.info("📊 Excel import completed. Success: {}, Errors: {}", importedContacts.size(), errors.size());
        
        if (!errors.isEmpty()) {
            logger.warn("Import errors: {}", errors);
            // You might want to throw an exception with error details or return them somehow
        }
        
        return importedContacts;
    }
    
    private Contact createContactFromRow(Row row, User user, int rowIndex) {
        // Validate required fields
        String name = getCellValueAsString(row.getCell(NAME_COLUMN));
        String email = getCellValueAsString(row.getCell(EMAIL_COLUMN));
        String phone = getCellValueAsString(row.getCell(PHONE_COLUMN));
        String address = getCellValueAsString(row.getCell(ADDRESS_COLUMN));
        
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("Address is required");
        }
        
        // Validate email format
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format: " + email);
        }
        
        // Validate phone format (10 digits)
        String cleanPhone = phone.replaceAll("[^0-9]", "");
        if (cleanPhone.length() != 10) {
            throw new IllegalArgumentException("Phone number must be 10 digits: " + phone);
        }
        
        // Create contact
        Contact contact = new Contact();
        contact.setId(UUID.randomUUID().toString());
        contact.setName(name.trim());
        contact.setEmail(email.trim().toLowerCase());
        contact.setPhoneNumber(cleanPhone);
        contact.setAddress(address.trim());
        contact.setUser(user);
        
        // Optional fields
        String description = getCellValueAsString(row.getCell(DESCRIPTION_COLUMN));
        if (description != null && !description.trim().isEmpty()) {
            contact.setDescription(description.trim());
        }
        
        String website = getCellValueAsString(row.getCell(WEBSITE_COLUMN));
        if (website != null && !website.trim().isEmpty()) {
            contact.setWebsiteLink(website.trim());
        }
        
        String linkedin = getCellValueAsString(row.getCell(LINKEDIN_COLUMN));
        if (linkedin != null && !linkedin.trim().isEmpty()) {
            contact.setLinkedInLink(linkedin.trim());
        }
        
        String favoriteStr = getCellValueAsString(row.getCell(FAVORITE_COLUMN));
        if (favoriteStr != null) {
            contact.setFavorite("true".equalsIgnoreCase(favoriteStr.trim()) || 
                              "yes".equalsIgnoreCase(favoriteStr.trim()) ||
                              "1".equals(favoriteStr.trim()));
        }
        
        // Set default picture
        contact.setPicture("https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png");
        contact.setCloudinaryImagePublicId("default");
        
        return contact;
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                // Handle phone numbers and other numeric values as strings
                double numericValue = cell.getNumericCellValue();
                if (numericValue == (long) numericValue) {
                    return String.valueOf((long) numericValue);
                } else {
                    return String.valueOf(numericValue);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case BLANK:
                return null;
            default:
                return cell.toString();
        }
    }

    @Override
    public boolean validateExcelFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            logger.warn("File is null or empty");
            return false;
        }
        
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || 
            (!originalFilename.toLowerCase().endsWith(".xlsx") && 
             !originalFilename.toLowerCase().endsWith(".xls"))) {
            logger.warn("Invalid file extension: {}", originalFilename);
            return false;
        }
        
        // Check file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            logger.warn("File size too large: {} bytes", file.getSize());
            return false;
        }
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null || sheet.getLastRowNum() < 1) {
                logger.warn("Excel file has no data rows");
                return false;
            }
            
            // Validate header row
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                logger.warn("Excel file has no header row");
                return false;
                
            }
            
            return true;
        } catch (Exception e) {
            logger.error("Error validating Excel file: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public InputStream getTemplateFile() throws Exception {
        logger.info("📄 Generating contact import template");
        
        // Create a new workbook and sheet
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Contacts");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                "Name*", "Email*", "Phone*", "Address*", "Description", 
                "Website Link", "LinkedIn Link", "Favorite (true/false)"
            };
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            
            // Add sample data row
            Row sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("John Doe");
            sampleRow.createCell(1).setCellValue("john.doe@example.com");
            sampleRow.createCell(2).setCellValue("9876543210");
            sampleRow.createCell(3).setCellValue("123 Main St, City, State");
            sampleRow.createCell(4).setCellValue("Sample contact description");
            sampleRow.createCell(5).setCellValue("https://johndoe.com");
            sampleRow.createCell(6).setCellValue("https://linkedin.com/in/johndoe");
            sampleRow.createCell(7).setCellValue("true");
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Convert to byte array and create InputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return new java.io.ByteArrayInputStream(outputStream.toByteArray());
        }
    }

    @Override
    public byte[] exportContactsToExcel(List<Contact> contacts) throws Exception {
        logger.info("📤 Exporting {} contacts to Excel", contacts.size());
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Contacts");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                "Name", "Email", "Phone", "Address", "Description", 
                "Website Link", "LinkedIn Link", "Favorite"
            };
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            
            // Add contact data
            int rowIndex = 1;
            for (Contact contact : contacts) {
                Row row = sheet.createRow(rowIndex++);
                
                row.createCell(0).setCellValue(contact.getName());
                row.createCell(1).setCellValue(contact.getEmail());
                row.createCell(2).setCellValue(contact.getPhoneNumber());
                row.createCell(3).setCellValue(contact.getAddress());
                row.createCell(4).setCellValue(contact.getDescription() != null ? contact.getDescription() : "");
                row.createCell(5).setCellValue(contact.getWebsiteLink() != null ? contact.getWebsiteLink() : "");
                row.createCell(6).setCellValue(contact.getLinkedInLink() != null ? contact.getLinkedInLink() : "");
                row.createCell(7).setCellValue(contact.isFavorite());
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
}
