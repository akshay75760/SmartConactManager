package com.scm.repsitories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scm.entities.Note;
import com.scm.entities.User;

@Repository
public interface NoteRepo extends JpaRepository<Note, String> {
    
    // Find notes by user
    Page<Note> findByUser(User user, Pageable pageable);
    
    // Find notes by user and category
    Page<Note> findByUserAndCategory(User user, String category, Pageable pageable);
    
    // Find favorite notes by user
    Page<Note> findByUserAndIsFavoriteTrue(User user, Pageable pageable);
    
    // Search notes by title or content
    @Query("SELECT n FROM Note n WHERE n.user = :user AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Note> searchByUserAndKeyword(@Param("user") User user, @Param("keyword") String keyword, Pageable pageable);
    
    // Find all categories for a user
    @Query("SELECT DISTINCT n.category FROM Note n WHERE n.user = :user AND n.category IS NOT NULL ORDER BY n.category")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);
    
    // Count notes by user
    long countByUser(User user);
    
    // Count favorite notes by user
    long countByUserAndIsFavoriteTrue(User user);
}
