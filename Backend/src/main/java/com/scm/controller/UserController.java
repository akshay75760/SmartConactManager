package com.scm.controller;


import org.springframework.web.bind.annotation.RequestMapping;

import com.scm.services.UserService;
import org.springframework.ui.Model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;



@Controller
@RequestMapping("/user")
public class UserController {

    private Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    // user dashboard page
    @GetMapping("/dashboard")
    public String userDashboard() {
        System.out.println("User dashboard");
        return "user/dashboard";
    }
    

    // user profile 
    @GetMapping("/profile")
    public String userProfile(Model model , Authentication authentication ) {

        return "user/profile";
    }

    // user add contact page

    // user view contact page

    // user delete contact page

    // user update contact page

    // user seacrch contact page


}
