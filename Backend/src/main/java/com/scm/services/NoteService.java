package com.scm.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.scm.entities.Note;
import com.scm.entities.User;

public interface NoteService {
    
    // Save note
    Note saveNote(Note note);
    
    // Get note by id
    Note getNoteById(String noteId);
    
    // Get notes by user with pagination
    Page<Note> getNotesByUser(User user, int page, int size, String sortBy, String sortDir);
    
    // Get notes by user and category
    Page<Note> getNotesByUserAndCategory(User user, String category, int page, int size, String sortBy, String sortDir);
    
    // Get favorite notes by user
    Page<Note> getFavoriteNotesByUser(User user, int page, int size, String sortBy, String sortDir);
    
    // Search notes
    Page<Note> searchNotes(User user, String keyword, int page, int size, String sortBy, String sortDir);
    
    // Get all categories for a user
    List<String> getCategoriesByUser(User user);
    
    // Delete note
    void deleteNote(String noteId);
    
    // Update note
    Note updateNote(Note note);
    
    // Count notes by user
    long countNotesByUser(User user);
    
    // Count favorite notes by user
    long countFavoriteNotesByUser(User user);
    
    // Toggle favorite status
    Note toggleFavorite(String noteId);
}
