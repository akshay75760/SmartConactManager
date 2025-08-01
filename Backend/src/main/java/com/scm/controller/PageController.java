package com.scm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.scm.entities.User;
import com.scm.forms.UserForm;
import com.scm.helper.Message;
import com.scm.helper.MessageType;
import com.scm.services.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;



@Controller
public class PageController {
    @Autowired
    private UserService userService;

    @RequestMapping("/home")
    public String home (Model model){
        System.out.println("Home page handler");
        model.addAttribute("name","Substring model");
        model.addAttribute("YoutubeChannel", "Hello World");
        model.addAttribute("Git hub", "Repo");
        return "home";
    }


    //About
    @RequestMapping("/about")
    public String about(Model model){
        System.out.println("About page handler");
        model.addAttribute("name","Substring model");
        model.addAttribute("YoutubeChannel", "Hello World");
        model.addAttribute("Git hub", "Repo");
        return "about";
    }


    // Services
    @RequestMapping("/services")
    public String services(Model model){
        System.out.println("Services page handler");
        model.addAttribute("name","Substring model");
        model.addAttribute("YoutubeChannel", "Hello World");
        model.addAttribute("Git hub", "Repo");
        return "services";
    }

    // Login
    @GetMapping("/login")
    public String login() {
        // return "login";
        return new String("login");

    }

    // Signup
    @GetMapping("/register")
    public String register(Model model) {
        
        UserForm userForm = new UserForm();
        // Set default data 
        // userForm.setName("Akshay");
        model.addAttribute("userForm", userForm);
        return "register";
        }

    // Contact
    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }

    // process register
    @RequestMapping(value="/do-register", method = RequestMethod.POST)
    public String processRegister(@Valid @ModelAttribute UserForm userForm , BindingResult rbBindingResult, HttpSession session){
        System.out.println(" Processing Registered ");
        // fetch from data
        // User form
        System.out.println(userForm);

        // validate form
        if (rbBindingResult.hasErrors()) {
            return "register";
        }
        // save to database

        // userService
        // Form se data ko nakal kr save karna
        // // UserForm --> User
        // User user = User.builder()
        // .name(userForm.getName())
        // .email(userForm.getEmail())
        // .password(userForm.getPassword())
        // .phoneNumber(userForm.getPhoneNumber())
        // .about(userForm.getAbout())
        // .profilePic("https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#query=profile%20logo&position=2&from_view=keyword&track=ais_hybrid&uuid=a868d504-8fdc-4a87-a167-a5ed471f7644")
        // .build();
        User user2 = new User();
        user2.setName(userForm.getName());
        user2.setEmail(userForm.getEmail());
        user2.setPassword(userForm.getPassword());
        user2.setPhoneNumber(userForm.getPhoneNumber());
        user2.setAbout(userForm.getAbout());
        user2.setProfilePic("https://www.freepik.com/free-vector/blue-circle-with-white-user_145857007.htm#query=profile%20logo&position=2&from_view=keyword&track=ais_hybrid&uuid=a868d504-8fdc-4a87-a167-a5ed471f7644");

        User savedUser = userService.saveUser(user2);
        System.out.println("User saved");

        // messsage="Resgsitration Succesfull"
        // Add the message
        
    
        Message message=Message.builder().content("Registration Succesfull").type(MessageType.green).build();
        session.setAttribute("message", message);

        
        return "redirect:/register";
    }
    
}
