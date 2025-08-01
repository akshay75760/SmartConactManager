package com.scm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.scm.entities.User;
import java.util.*;


@Repository
public interface UserRepo extends JpaRepository<User, String> {

    // Extra method dp related oprations
    // Cusmtom query Method

    // Custom finer mathod
    // Iksi implimentation Spring data japa khud se kar deta h
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email , String password);
}  
