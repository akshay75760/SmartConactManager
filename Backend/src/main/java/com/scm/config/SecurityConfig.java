package com.scm.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.scm.services.impl.SecurityCustomUserDetailService;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private SecurityCustomUserDetailService detailsService;
    
    @Autowired
    private OAuthAuthenicationSuccessHandler handler;
    
    @Autowired
    private FormLoginSuccessHandler formLoginSuccessHandler;
    
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();

        // User details Service ka object
        daoAuthenticationProvider.setUserDetailsService(detailsService);
        
        // user password encoder
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());

        return daoAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        // Configuration
        // URL Configuration kiye hai ki konsa public rahega aur konsa protected
        httpSecurity.authorizeHttpRequests(authorize -> {
            // Public endpoints - no authentication required
            authorize.requestMatchers("/home", "/register", "/services", "/about", "/contact").permitAll();
            authorize.requestMatchers("/login", "/do-logout").permitAll();
            authorize.requestMatchers("/api/auth/**").permitAll(); // JWT auth endpoints
            authorize.requestMatchers("/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll();
            
            // Admin endpoints - require ADMIN role
            authorize.requestMatchers("/admin/**").hasRole("ADMIN");
            
            // Protected endpoints - require authentication
            authorize.requestMatchers("/user/**").authenticated();
            authorize.requestMatchers("/api/contacts/**").authenticated(); // Require auth for contact APIs
            authorize.requestMatchers("/api/messages/**").authenticated(); // Require auth for message APIs
            
            authorize.anyRequest().permitAll();
        });

        // Disable CSRF for stateless JWT authentication
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        
        // Configure CORS
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource));
        
        // Configure session management - STATELESS for JWT
        httpSecurity.sessionManagement(session -> {
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        });

        // Add JWT filter before UsernamePasswordAuthenticationFilter
        httpSecurity.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Form login configuration (for web interface)
        httpSecurity.formLogin(formLogin -> {
            formLogin.loginPage("/login");
            formLogin.loginProcessingUrl("/authenticate");
            formLogin.successHandler(formLoginSuccessHandler);
            formLogin.usernameParameter("email");
            formLogin.passwordParameter("password");
        });
        
        httpSecurity.logout(logoutForm -> {
            logoutForm.logoutUrl("/do-logout");
            logoutForm.logoutSuccessUrl("/login?logout=true");
        });

        // OAuth Configuration (for web interface)
        httpSecurity.oauth2Login(oauth -> {
            oauth.loginPage("/login");
            oauth.successHandler(handler);
            oauth.failureUrl("/login?error=oauth_failed");
        });

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .authenticationProvider(authenticationProvider())
                .build();
    }
}

