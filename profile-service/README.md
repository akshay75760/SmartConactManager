# Profile Service - Microservice

This is a Spring Boot microservice for managing user profiles in the Smart Contact Manager application.

## Features

- Create user profiles
- Retrieve user profiles by userId
- Update user profiles
- Delete user profiles
- Input validation
- Error handling with proper HTTP status codes
- MySQL database integration

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profile` | Create a new user profile |
| GET | `/api/profile/{userId}` | Get user profile by userId |
| PUT | `/api/profile/{userId}` | Update user profile |
| DELETE | `/api/profile/{userId}` | Delete user profile |
| GET | `/api/profile/health` | Health check endpoint |

## Running the Service

1. Make sure MySQL is running on `localhost:3306`
2. Create database `profile_service_db` or let the application create it automatically
3. Update database credentials in `application.properties` if needed
4. Run the application:

```bash
mvn spring-boot:run
```

The service will start on port `8082`.

## Database Schema

The service creates a `user_profiles` table with the following structure:

- `id` (Primary Key, Auto-increment)
- `user_id` (Unique, Not Null)
- `full_name` (Not Null)
- `bio` (Optional)
- `profile_picture_url` (Optional)
- `created_at` (Auto-generated)
- `updated_at` (Auto-generated)

## Configuration

Key configuration properties in `application.properties`:

```properties
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/profile_service_db
spring.datasource.username=root
spring.datasource.password=root1234
```
