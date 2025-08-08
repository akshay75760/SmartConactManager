package com.scm.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NoteForm {
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 5, max = 5000, message = "Content must be between 5 and 5000 characters")
    private String content;
    
    private String category;
    
    private boolean isFavorite = false;

    public NoteForm() {
    }

    public NoteForm(String title, String content, String category, boolean isFavorite) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.isFavorite = isFavorite;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    @Override
    public String toString() {
        return "NoteForm{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", category='" + category + '\'' +
                ", isFavorite=" + isFavorite +
                '}';
    }
}
