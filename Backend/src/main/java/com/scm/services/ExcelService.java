package com.scm.services;

import java.io.InputStream;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.scm.entities.Contact;
import com.scm.entities.User;

public interface ExcelService {
    
    /**
     * Import contacts from Excel file
     * @param file The Excel file containing contact data
     * @param user The user who owns these contacts
     * @return List of imported contacts
     */
    List<Contact> importContactsFromExcel(MultipartFile file, User user) throws Exception;
    
    /**
     * Validate Excel file format
     * @param file The Excel file to validate
     * @return true if valid, false otherwise
     */
    boolean validateExcelFile(MultipartFile file);
    
    /**
     * Get template Excel file input stream
     * @return InputStream of the template file
     */
    InputStream getTemplateFile() throws Exception;
    
    /**
     * Export contacts to Excel file
     * @param contacts List of contacts to export
     * @return Excel file as byte array
     */
    byte[] exportContactsToExcel(List<Contact> contacts) throws Exception;
}
