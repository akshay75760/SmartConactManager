package com.scm.dto;

import java.util.List;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String email;
    private String name;
    private String message;
    private List<String> roles;
    
    public AuthResponse() {}
    
    public AuthResponse(String token, String email, String name) {
        this.token = token;
        this.email = email;
        this.name = name;
    }
    
    public AuthResponse(String token, String email, String name, String message) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.message = message;
    }
    
    public AuthResponse(String token, String email, String name, String message, List<String> roles) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.message = message;
        this.roles = roles;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public List<String> getRoles() {
        return roles;
    }
    
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
