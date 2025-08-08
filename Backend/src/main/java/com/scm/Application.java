package com.scm;

import com.scm.config.AppConfig;
import com.scm.entities.User;
import com.scm.helpers.AppConstants;
import com.scm.repsitories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

@SpringBootApplication
public class Application  implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		// Create default admin user (force update if exists)
		User adminUser = new User();
		adminUser.setUserId(UUID.randomUUID().toString());
		adminUser.setName("admin");
		adminUser.setEmail("smpt28akshay@gmail.com");
		adminUser.setPassword(passwordEncoder.encode("admin"));
		adminUser.setRoleList(List.of(AppConstants.ROLE_ADMIN, AppConstants.ROLE_USER));
		adminUser.setEmailVerified(true);
		adminUser.setEnabled(true);
		adminUser.setAbout("This is the admin user created initially");
		adminUser.setPhoneVerified(true);

		// Check if admin user exists and update/create accordingly
		userRepo.findByEmail("smpt28akshay@gmail.com").ifPresentOrElse(existingUser -> {
			// Update existing admin user with new password and roles
			existingUser.setPassword(passwordEncoder.encode("admin"));
			existingUser.setRoleList(List.of(AppConstants.ROLE_ADMIN, AppConstants.ROLE_USER));
			existingUser.setName("admin");
			existingUser.setEmailVerified(true);
			existingUser.setEnabled(true);
			existingUser.setAbout("This is the admin user created initially");
			existingUser.setPhoneVerified(true);
			userRepo.save(existingUser);
			System.out.println("Admin user updated with new password and admin role");
		}, () -> {
			userRepo.save(adminUser);
			System.out.println("Admin user created");
		});

		// Create default regular user
		User user = new User();
		user.setUserId(UUID.randomUUID().toString());
		user.setName("demo user");
		user.setEmail("user@gmail.com");
		user.setPassword(passwordEncoder.encode("user"));
		user.setRoleList(List.of(AppConstants.ROLE_USER));
		user.setEmailVerified(true);
		user.setEnabled(true);
		user.setAbout("This is dummy user created initially");
		user.setPhoneVerified(true);

		userRepo.findByEmail("user@gmail.com").ifPresentOrElse(user1 -> {},() -> {
			userRepo.save(user);
			System.out.println("Demo user created");
		});
	}
}
