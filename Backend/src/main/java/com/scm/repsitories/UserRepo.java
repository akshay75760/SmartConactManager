package com.scm.repsitories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scm.entities.User;

@Repository
public interface UserRepo extends JpaRepository<User, String> {
    // extra methods db relatedoperations
    // custom query methods
    // custom finder methods

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    // Get all users with their contact counts
    @Query("SELECT u FROM user u LEFT JOIN FETCH u.contacts")
    List<User> findAllWithContacts();

    // Count contacts for a specific user
    @Query("SELECT COUNT(c) FROM Contact c WHERE c.user.userId = :userId")
    Long countContactsByUserId(@Param("userId") String userId);

    // Optional<User> findByEmailToken(String id);

}