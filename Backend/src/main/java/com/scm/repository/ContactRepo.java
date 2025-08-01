package com.scm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scm.entities.Contact;
import com.scm.entities.User;

import java.util.List;



public interface ContactRepo extends JpaRepository<Contact, String> {

    // Custom Finder method
    List<Contact> findByUser(User user);

    // Custom Query method
    @Query("SELECT c FROM Contact c WHERE c.user.id=:userId")
    List<Contact> findByUserId(@Param("userId") String userId);
    

  //   @Query("SELECT c FROM Contact c WHERE c.userId = :userId")
  // List<Contact> findByUserId(String userId);
}
