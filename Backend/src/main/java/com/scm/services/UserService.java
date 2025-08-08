package com.scm.services;

import java.util.List;
import java.util.Optional;

import com.scm.entities.User;

public interface UserService {

    User saveUser(User user);

    Optional<User> getUserById(String id);

    Optional<User> updateUser(User user);

    void deleteUser(String id);

    boolean isUserExist(String userId);

    boolean isUserExistByEmail(String email);

    List<User> getAllUsers();

    User getUserByEmail(String email);

    // Get users with contact count for admin dashboard
    List<User> getAllUsersWithContactCount();
    
    // Get contact count for a specific user
    Long getContactCountByUserId(String userId);

    // add more methods here related user service[logic]

}
