package com.scm.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class RedirectController {

    private static final Logger logger = LoggerFactory.getLogger(RedirectController.class);

    @GetMapping("/auth-success")
    public String authSuccess(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) {
        logger.info("=== RECEIVED REQUEST AT /auth-success ===");
        
        // Check if user is authenticated
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            logger.info("✅ User is authenticated: " + auth.getName());
            logger.info("✅ User authorities: " + auth.getAuthorities());
            
            // Ensure session is created and configure session cookie
            HttpSession session = request.getSession(true);
            logger.info("✅ Session ID: " + session.getId());
            
            // Set session cookie with proper domain and path
            jakarta.servlet.http.Cookie sessionCookie = new jakarta.servlet.http.Cookie("JSESSIONID", session.getId());
            sessionCookie.setPath("/");
            sessionCookie.setHttpOnly(false); // Allow JavaScript access for debugging
            sessionCookie.setSecure(false); // Set to true in production with HTTPS
            sessionCookie.setDomain("localhost"); // Set domain to localhost
            response.addCookie(sessionCookie);
            
            logger.info("✅ Session cookie configured, returning auth success page");
            return "oauth-success"; // This will serve oauth-success.html template
        } else {
            logger.warn("❌ User is NOT authenticated or is anonymous user");
            logger.warn("❌ Auth object: " + auth);
            logger.warn("❌ Auth name: " + (auth != null ? auth.getName() : "null"));
            logger.warn("❌ Redirecting to login");
            return "redirect:http://localhost:5173/login";
        }
    }
    
    @GetMapping("/test-redirect")
    public RedirectView testRedirect() {
        logger.info("=== TEST REDIRECT ENDPOINT CALLED ===");
        return new RedirectView("http://localhost:5173/user/profile");
    }
}
