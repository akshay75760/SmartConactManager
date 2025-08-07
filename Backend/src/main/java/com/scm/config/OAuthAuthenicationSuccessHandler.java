package com.scm.config;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.scm.entities.Providers;
import com.scm.entities.User;
import com.scm.helpers.AppConstants;
import com.scm.repsitories.UserRepo;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuthAuthenicationSuccessHandler implements AuthenticationSuccessHandler {

    Logger logger = LoggerFactory.getLogger(OAuthAuthenicationSuccessHandler.class);

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        logger.info("OAuthAuthenicationSuccessHandler");

        // Identify the provider
        var oauth2AuthenicationToken = (OAuth2AuthenticationToken) authentication;
        String authorizedClientRegistrationId = oauth2AuthenicationToken.getAuthorizedClientRegistrationId();
        logger.info("OAuth Provider: " + authorizedClientRegistrationId);

        var oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        oauthUser.getAttributes().forEach((key, value) -> {
            logger.info(key + " : " + value);
        });

        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setRoleList(List.of(AppConstants.ROLE_USER));
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setPassword("dummy");

        if (authorizedClientRegistrationId.equalsIgnoreCase("google")) {
            // Google OAuth
            Object emailAttr = oauthUser.getAttribute("email");
            Object pictureAttr = oauthUser.getAttribute("picture");
            Object nameAttr = oauthUser.getAttribute("name");
            
            user.setEmail(emailAttr != null ? emailAttr.toString() : "");
            user.setProfilePic(pictureAttr != null ? pictureAttr.toString() : "");
            user.setName(nameAttr != null ? nameAttr.toString() : "");
            user.setProviderUserId(oauthUser.getName());
            user.setProvider(Providers.GOOGLE);
            user.setAbout("This account is created using Google.");
        } else if (authorizedClientRegistrationId.equalsIgnoreCase("github")) {
            // GitHub OAuth
            Object emailAttr = oauthUser.getAttribute("email");
            Object loginAttr = oauthUser.getAttribute("login");
            Object avatarAttr = oauthUser.getAttribute("avatar_url");
            
            String email = emailAttr != null ? 
                    emailAttr.toString() :
                    (loginAttr != null ? loginAttr.toString() + "@gmail.com" : "");
            String picture = avatarAttr != null ? avatarAttr.toString() : "";
            String name = loginAttr != null ? loginAttr.toString() : "";
            String providerUserId = oauthUser.getName();

            user.setEmail(email);
            user.setProfilePic(picture);
            user.setName(name);
            user.setProviderUserId(providerUserId);
            user.setProvider(Providers.GITHUB);
            user.setAbout("This account is created using GitHub.");
        } else {
            logger.info("OAuthAuthenicationSuccessHandler: Unknown provider");
        }

        // Check if user already exists
        User existingUser = userRepo.findByEmail(user.getEmail()).orElse(null);
        User savedUser;
        
        if (existingUser == null) {
            savedUser = userRepo.save(user);
            logger.info("New OAuth user saved: " + user.getEmail());
        } else {
            savedUser = existingUser;
            logger.info("Existing OAuth user found: " + user.getEmail());
        }

        // Generate JWT token for the user
        String jwtToken = jwtUtil.generateToken(savedUser.getEmail());
        
        logger.info("Generated JWT token for OAuth user: " + savedUser.getEmail());
        
        // Redirect to frontend with JWT token as query parameter
        String frontendUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth-success")
                .queryParam("token", jwtToken)
                .queryParam("email", savedUser.getEmail())
                .queryParam("name", savedUser.getName())
                .build()
                .toUriString();
                
        logger.info("Redirecting OAuth user to frontend with JWT token");
        new DefaultRedirectStrategy().sendRedirect(request, response, frontendUrl);  
    }
}
