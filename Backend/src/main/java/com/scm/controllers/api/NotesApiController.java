package com.scm.controllers.api;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scm.entities.Note;
import com.scm.entities.User;
import com.scm.helpers.Helper;
import com.scm.services.NoteService;
import com.scm.services.UserService;

@RestController
@RequestMapping("/api/notes")
public class NotesApiController {
    
    private static final Logger logger = LoggerFactory.getLogger(NotesApiController.class);
    
    @Autowired
    private NoteService noteService;
    
    @Autowired
    private UserService userService;
    
    // Get user's notes with pagination
    @GetMapping
    public ResponseEntity<Page<Note>> getUserNotes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "updatedAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction,
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "favorites", defaultValue = "false") boolean favorites,
            Authentication authentication) {
        
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Page<Note> notes;
            
            if (favorites) {
                notes = noteService.getFavoriteNotesByUser(user, page, size, sortBy, direction);
            } else if (!keyword.trim().isEmpty()) {
                notes = noteService.searchNotes(user, keyword, page, size, sortBy, direction);
            } else {
                notes = noteService.getNotesByUser(user, page, size, sortBy, direction);
            }
            
            logger.info("📝 Retrieved {} notes for user: {}", notes.getContent().size(), username);
            return ResponseEntity.ok(notes);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching notes: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get single note by ID
    @GetMapping("/{noteId}")
    public ResponseEntity<Note> getNoteById(@PathVariable String noteId, Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note note = noteService.getNoteById(noteId);
            
            if (note == null || !note.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized access to note: {} by user: {}", noteId, username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            return ResponseEntity.ok(note);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create new note
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note noteData, Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            // Create new note
            Note note = new Note();
            note.setId(UUID.randomUUID().toString());
            note.setTitle(noteData.getTitle());
            note.setContent(noteData.getContent());
            note.setCategory(noteData.getCategory());
            note.setFavorite(noteData.isFavorite());
            note.setUser(user);
            
            Note savedNote = noteService.saveNote(note);
            logger.info("✅ Note created successfully: {} by user: {}", savedNote.getId(), username);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
            
        } catch (Exception e) {
            logger.error("❌ Error creating note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update existing note
    @PutMapping("/{noteId}")
    public ResponseEntity<Note> updateNote(@PathVariable String noteId, @RequestBody Note noteData, 
                                         Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note existingNote = noteService.getNoteById(noteId);
            
            if (existingNote == null || !existingNote.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized update attempt for note: {} by user: {}", noteId, username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Update note properties
            existingNote.setTitle(noteData.getTitle());
            existingNote.setContent(noteData.getContent());
            existingNote.setCategory(noteData.getCategory());
            existingNote.setFavorite(noteData.isFavorite());
            
            Note updatedNote = noteService.updateNote(existingNote);
            logger.info("✅ Note updated successfully: {}", updatedNote.getId());
            
            return ResponseEntity.ok(updatedNote);
            
        } catch (Exception e) {
            logger.error("❌ Error updating note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Delete note
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable String noteId, Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note note = noteService.getNoteById(noteId);
            
            if (note == null || !note.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized delete attempt for note: {} by user: {}", noteId, username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            noteService.deleteNote(noteId);
            logger.info("✅ Note deleted successfully: {}", noteId);
            
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            logger.error("❌ Error deleting note: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Toggle favorite status
    @PutMapping("/{noteId}/favorite")
    public ResponseEntity<Note> toggleFavorite(@PathVariable String noteId, Authentication authentication) {
        try {
            String username = Helper.getEmailOfLoggedInUser(authentication);
            User user = userService.getUserByEmail(username);
            
            Note note = noteService.getNoteById(noteId);
            
            if (note == null || !note.getUser().getUserId().equals(user.getUserId())) {
                logger.warn("🚫 Unauthorized favorite toggle for note: {} by user: {}", noteId, username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            Note updatedNote = noteService.toggleFavorite(noteId);
            logger.info("✅ Note favorite toggled: {}", noteId);
            
            return ResponseEntity.ok(updatedNote);
            
        } catch (Exception e) {
            logger.error("❌ Error toggling favorite: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
