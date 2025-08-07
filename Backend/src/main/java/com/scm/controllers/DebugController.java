package com.scm.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/debug")
@CrossOrigin(origins = "http://localhost:5173")
public class DebugController {

    @GetMapping("/auth-status")
    public java.util.Map<String, Object> getAuthStatus(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        java.util.Map<String, Object> status = new java.util.HashMap<>();
        status.put("isAuthenticated", auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()));
        status.put("username", auth != null ? auth.getName() : "null");
        status.put("sessionId", request.getSession(false) != null ? request.getSession().getId() : "no session");
        status.put("authorities", auth != null ? auth.getAuthorities().toString() : "null");
        
        return status;
    }
}
