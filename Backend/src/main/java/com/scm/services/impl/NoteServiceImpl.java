package com.scm.services.impl;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.scm.entities.Note;
import com.scm.entities.User;
import com.scm.helpers.ResourceNotFoundException;
import com.scm.repsitories.NoteRepo;
import com.scm.services.NoteService;

@Service
public class NoteServiceImpl implements NoteService {
    
    private static final Logger logger = LoggerFactory.getLogger(NoteServiceImpl.class);
    
    @Autowired
    private NoteRepo noteRepo;

    @Override
    public Note saveNote(Note note) {
        logger.info("📝 Saving note with title: {}", note.getTitle());
        
        if (note.getId() == null || note.getId().isEmpty()) {
            note.setId(UUID.randomUUID().toString());
        }
        
        Note savedNote = noteRepo.save(note);
        logger.info("✅ Note saved successfully with ID: {}", savedNote.getId());
        return savedNote;
    }

    @Override
    public Note getNoteById(String noteId) {
        logger.info("🔍 Fetching note with ID: {}", noteId);
        
        return noteRepo.findById(noteId)
                .orElseThrow(() -> {
                    logger.error("❌ Note not found with ID: {}", noteId);
                    return new ResourceNotFoundException("Note not found with ID: " + noteId);
                });
    }

    @Override
    public Page<Note> getNotesByUser(User user, int page, int size, String sortBy, String sortDir) {
        logger.info("📚 Fetching notes for user: {} (page: {}, size: {})", user.getEmail(), page, size);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Note> notes = noteRepo.findByUser(user, pageable);
        
        logger.info("✅ Found {} notes for user: {}", notes.getTotalElements(), user.getEmail());
        return notes;
    }

    @Override
    public Page<Note> getNotesByUserAndCategory(User user, String category, int page, int size, String sortBy, String sortDir) {
        logger.info("📂 Fetching notes for user: {} in category: {}", user.getEmail(), category);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return noteRepo.findByUserAndCategory(user, category, pageable);
    }

    @Override
    public Page<Note> getFavoriteNotesByUser(User user, int page, int size, String sortBy, String sortDir) {
        logger.info("⭐ Fetching favorite notes for user: {}", user.getEmail());
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return noteRepo.findByUserAndIsFavoriteTrue(user, pageable);
    }

    @Override
    public Page<Note> searchNotes(User user, String keyword, int page, int size, String sortBy, String sortDir) {
        logger.info("🔍 Searching notes for user: {} with keyword: {}", user.getEmail(), keyword);
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return noteRepo.searchByUserAndKeyword(user, keyword, pageable);
    }

    @Override
    public List<String> getCategoriesByUser(User user) {
        logger.info("📋 Fetching categories for user: {}", user.getEmail());
        return noteRepo.findDistinctCategoriesByUser(user);
    }

    @Override
    public void deleteNote(String noteId) {
        logger.info("🗑️ Deleting note with ID: {}", noteId);
        
        Note note = getNoteById(noteId);
        noteRepo.delete(note);
        
        logger.info("✅ Note deleted successfully with ID: {}", noteId);
    }

    @Override
    public Note updateNote(Note note) {
        logger.info("✏️ Updating note with ID: {}", note.getId());
        
        // Verify note exists
        Note existingNote = getNoteById(note.getId());
        
        // Update fields
        existingNote.setTitle(note.getTitle());
        existingNote.setContent(note.getContent());
        existingNote.setCategory(note.getCategory());
        existingNote.setFavorite(note.isFavorite());
        
        Note updatedNote = noteRepo.save(existingNote);
        logger.info("✅ Note updated successfully with ID: {}", updatedNote.getId());
        return updatedNote;
    }

    @Override
    public long countNotesByUser(User user) {
        logger.info("🔢 Counting notes for user: {}", user.getEmail());
        return noteRepo.countByUser(user);
    }

    @Override
    public long countFavoriteNotesByUser(User user) {
        logger.info("⭐ Counting favorite notes for user: {}", user.getEmail());
        return noteRepo.countByUserAndIsFavoriteTrue(user);
    }

    @Override
    public Note toggleFavorite(String noteId) {
        logger.info("⭐ Toggling favorite status for note ID: {}", noteId);
        
        Note note = getNoteById(noteId);
        note.setFavorite(!note.isFavorite());
        
        Note updatedNote = noteRepo.save(note);
        logger.info("✅ Favorite status toggled for note ID: {} - Now favorite: {}", noteId, updatedNote.isFavorite());
        return updatedNote;
    }
}
