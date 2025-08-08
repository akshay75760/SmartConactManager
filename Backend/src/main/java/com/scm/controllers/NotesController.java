package com.scm.controllers;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.scm.entities.Note;
import com.scm.entities.User;
import com.scm.forms.NoteForm;
import com.scm.helpers.AppConstants;
import com.scm.helpers.Helper;
import com.scm.helpers.Message;
import com.scm.helpers.MessageType;
import com.scm.services.NoteService;
import com.scm.services.UserService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/user/notes-html")  // Changed to avoid conflict with React routes
public class NotesController {
    
    private static final Logger logger = LoggerFactory.getLogger(NotesController.class);
    
    @Autowired
    private NoteService noteService;
    
    @Autowired
    private UserService userService;
    
    // Show notes page
    @GetMapping
    public String notesPage(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = AppConstants.PAGE_SIZE + "") int size,
            @RequestParam(value = "sortBy", defaultValue = "updatedAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction,
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "favorites", defaultValue = "false") boolean favorites,
            Model model, Authentication authentication) {

        logger.info("📝 Loading notes page for user: {}", authentication.getName());
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        Page<Note> pageNotes;
        
        if (favorites) {
            // Get only favorite notes
            pageNotes = noteService.getFavoriteNotesByUser(user, page, size, sortBy, direction);
            logger.info("⭐ Loading favorite notes for user: {}", username);
        } else if (!keyword.trim().isEmpty()) {
            // Search notes
            pageNotes = noteService.searchNotes(user, keyword, page, size, sortBy, direction);
            logger.info("🔍 Searching notes with keyword: {} for user: {}", keyword, username);
        } else {
            // Get all notes
            pageNotes = noteService.getNotesByUser(user, page, size, sortBy, direction);
        }
        
        model.addAttribute("notesPage", pageNotes);
        model.addAttribute("pageSize", AppConstants.PAGE_SIZE);
        model.addAttribute("user", user);
        model.addAttribute("keyword", keyword);
        model.addAttribute("favorites", favorites);
        model.addAttribute("title", "My Notes");
        
        return "user/notes";
    }
    
    // Show add note page
    @GetMapping("/add")
    public String addNotePage(Model model) {
        logger.info("📝 Loading add note page");
        
        NoteForm noteForm = new NoteForm();
        model.addAttribute("noteForm", noteForm);
        model.addAttribute("title", "Add New Note");
        
        return "user/add_note";
    }
    
    // Handle note creation
    @PostMapping("/add")
    public String saveNote(@Valid @ModelAttribute NoteForm noteForm, BindingResult result,
                          Authentication authentication, RedirectAttributes redirectAttributes, Model model) {
        
        logger.info("💾 Saving new note for user: {}", authentication.getName());
        
        // Handle validation errors
        if (result.hasErrors()) {
            logger.warn("❌ Validation errors in note form: {}", result.getAllErrors());
            model.addAttribute("noteForm", noteForm);
            model.addAttribute("title", "Add New Note");
            return "user/add_note";
        }
        
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            // Create note from form
            Note note = new Note();
            note.setId(UUID.randomUUID().toString());
            note.setTitle(noteForm.getTitle());
            note.setContent(noteForm.getContent());
            note.setCategory(noteForm.getCategory());
            note.setFavorite(noteForm.isFavorite());
            note.setUser(user);
            
            Note savedNote = noteService.saveNote(note);
            logger.info("✅ Note saved successfully with ID: {}", savedNote.getId());
            
            redirectAttributes.addFlashAttribute("message", 
                Message.builder()
                    .content("Note created successfully! 📝✨")
                    .type(MessageType.green)
                    .build()
            );
            
            return "redirect:/user/notes";
            
        } catch (Exception e) {
            logger.error("❌ Error saving note: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("message", 
                Message.builder()
                    .content("Error creating note: " + e.getMessage())
                    .type(MessageType.red)
                    .build()
            );
            return "redirect:/user/notes/add";
        }
    }
    
    // Show edit note page
    @GetMapping("/edit/{noteId}")
    public String editNotePage(@PathVariable String noteId, Model model, Authentication authentication) {
        logger.info("✏️ Loading edit page for note: {}", noteId);
        
        String username = Helper.getEmailOfLoggedInUser(authentication);
        User user = userService.getUserByEmail(username);
        
        Note note = noteService.getNoteById(noteId);
        
        // Security check - ensure user owns this note
        if (note == null || !note.getUser().getUserId().equals(user.getUserId())) {
            logger.warn("🚫 Unauthorized access attempt to note: {} by user: {}", noteId, username);
            return "redirect:/user/notes";
        }
        
        // Convert note to form
        NoteForm noteForm = new NoteForm();
        noteForm.setTitle(note.getTitle());
        noteForm.setContent(note.getContent());
        noteForm.setCategory(note.getCategory());
        noteForm.setFavorite(note.isFavorite());
        
        model.addAttribute("noteForm", noteForm);
        model.addAttribute("noteId", noteId);
        model.addAttribute("title", "Edit Note");
        
        return "user/edit_note";
    }
    
    // Handle note update
    @PostMapping("/edit/{noteId}")
    public String updateNote(@PathVariable String noteId, @Valid @ModelAttribute NoteForm noteForm,
                           BindingResult result, Authentication authentication, 
                           RedirectAttributes redirectAttributes, Model model) {
        
        logger.info("📝 Updating note: {} for user: {}", noteId, authentication.getName());
        
        // Handle validation errors
        if (result.hasErrors()) {
            logger.warn("❌ Validation errors in note form: {}", result.getAllErrors());
            model.addAttribute("noteForm", noteForm);
            model.addAttribute("noteId", noteId);
            model.addAttribute("title", "Edit Note");
            return "user/edit_note";
        }
        
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note existingNote = noteService.getNoteById(noteId);
            
            // Security check
            if (existingNote == null || !existingNote.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized update attempt for note: {} by user: {}", noteId, username);
                return "redirect:/user/notes";
            }
            
            // Update note properties
            existingNote.setTitle(noteForm.getTitle());
            existingNote.setContent(noteForm.getContent());
            existingNote.setCategory(noteForm.getCategory());
            existingNote.setFavorite(noteForm.isFavorite());
            
            Note updatedNote = noteService.updateNote(existingNote);
            logger.info("✅ Note updated successfully: {}", updatedNote.getId());
            
            redirectAttributes.addFlashAttribute("message", 
                Message.builder()
                    .content("Note updated successfully! 📝✨")
                    .type(MessageType.green)
                    .build()
            );
            
            return "redirect:/user/notes";
            
        } catch (Exception e) {
            logger.error("❌ Error updating note: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("message", 
                Message.builder()
                    .content("Error updating note: " + e.getMessage())
                    .type(MessageType.red)
                    .build()
            );
            return "redirect:/user/notes";
        }
    }
    
    // Delete note
    @DeleteMapping("/{noteId}")
    @ResponseBody
    public ResponseEntity<String> deleteNote(@PathVariable String noteId, Authentication authentication) {
        logger.info("🗑️ Deleting note: {} for user: {}", noteId, authentication.getName());
        
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note note = noteService.getNoteById(noteId);
            
            // Security check
            if (note == null || !note.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized delete attempt for note: {} by user: {}", noteId, username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            
            noteService.deleteNote(noteId);
            logger.info("✅ Note deleted successfully: {}", noteId);
            
            return ResponseEntity.ok("Note deleted successfully");
            
        } catch (Exception e) {
            logger.error("❌ Error deleting note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting note");
        }
    }
    
    // Toggle favorite status
    @PutMapping("/{noteId}/favorite")
    @ResponseBody
    public ResponseEntity<String> toggleFavorite(@PathVariable String noteId, Authentication authentication) {
        logger.info("⭐ Toggling favorite for note: {} by user: {}", noteId, authentication.getName());
        
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note note = noteService.getNoteById(noteId);
            
            // Security check
            if (note == null || !note.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized favorite toggle for note: {} by user: {}", noteId, username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            
            Note updatedNote = noteService.toggleFavorite(noteId);
            String status = updatedNote.isFavorite() ? "added to favorites" : "removed from favorites";
            
            logger.info("✅ Note {} successfully {}", noteId, status);
            
            return ResponseEntity.ok("Note " + status);
            
        } catch (Exception e) {
            logger.error("❌ Error toggling favorite for note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating favorite status");
        }
    }
}
