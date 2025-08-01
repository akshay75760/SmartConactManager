package com.scm.services;

import com.scm.entities.User;
import java.util.*;

public interface UserService {
    User saveUser(User user);
    Optional<User> getUserById(String id);
    Optional<User> updatUser (User user);
    void deleteUser(String id);
    boolean isUserExist(String userId);
    boolean isExisByEmail(String email);
    User getUserByEmail(String email);
    List<User> getAllUsers();
} 
