# Smart Contact Manager

A full-stack web application for managing contacts efficiently. This application provides a comprehensive set of features for both regular users and administrators, built with a modern technology stack.

## 🌟 Features

- **User Authentication:** Secure user registration and login with email verification and OAuth2 (Google, GitHub) support.
- **Contact Management:**
  - Add, view, update, and delete contacts.
  - Search for contacts.
  - View contacts in a paginated list.
- **User Dashboard:** A personalized dashboard for each user to manage their contacts and profile.
- **Admin Dashboard:** A separate dashboard for administrators to manage users and view system statistics.
- **Profile Management:** Users can view and update their profiles.
- **Notes:** Users can create and manage personal notes for each contact.
- **Excel Export:** Export contacts to an Excel file.
- **Direct Mail:** Send emails directly to contacts.
- **Dark/Light Mode:** Theme switching for user preference.
- **Responsive Design:** The application is designed to work on various devices.

## 🛠️ Tech Stack

### Backend
- **Java:** Core programming language.
- **Spring Boot:** Framework for building the application.
- **Spring Security:** For authentication and authorization.
- **Spring Data JPA:** For database interaction.
- **MySQL:** Relational database.
- **Maven:** Dependency management.

### Frontend
- **React.js:** JavaScript library for building user interfaces.
- **Vite:** Fast frontend build tool.
- **React Router:** For client-side routing.
- **Axios:** For making HTTP requests to the backend.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Context API:** For state management.

## 🚀 Getting Started

### Prerequisites
- Java JDK 17 or later
- Maven
- Node.js and npm
- MySQL

### Backend Setup
1. Clone the repository.
2. Navigate to the `Backend` directory.
3. Configure the `application.properties` file with your MySQL database credentials.
4. Run `mvn spring-boot:run` to start the backend server.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the frontend development server.
4. Open your browser and go to `http://localhost:5173`.

## 📁 Project Structure

```
SCM/
├── Backend/            # Spring Boot application
│   ├── src/main/java/  # Java source code
│   └── pom.xml         # Maven configuration
├── frontend/           # React application
│   ├── src/            # React source code
│   └── package.json    # NPM configuration
├── Diagram/            # Project diagrams
└── Readme/             # Detailed documentation
```

## 📄 Documentation

### API Endpoints

The backend provides a RESTful API for managing users and contacts. All endpoints are prefixed with `/api`.

#### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate a user and receive a JWT token.
- `GET /auth/verify`: Verify a user's email address.

#### User
- `GET /user/profile`: Get the current user's profile.
- `PUT /user/profile`: Update the current user's profile.

#### Contacts
- `POST /contacts`: Add a new contact.
- `GET /contacts`: Get a paginated list of contacts for the current user.
- `GET /contacts/{id}`: Get a specific contact by ID.
- `PUT /contacts/{id}`: Update a contact.
- `DELETE /contacts/{id}`: Delete a contact.
- `GET /contacts/search`: Search for contacts.

#### Admin
- `GET /admin/users`: Get a list of all users.
- `GET /admin/users/{id}`: Get a specific user by ID.
- `DELETE /admin/users/{id}`: Delete a user.

### Frontend Architecture

The frontend is a single-page application built with React.

-   **Components:** Reusable UI elements are located in `src/components`. This includes common components like `Navbar` and `Footer`, as well as user-specific components like `UserSidebar` and `ContactModal`.
-   **Pages:** The main views of the application are in `src/pages`. Each page corresponds to a specific route, for example `HomePage`, `LoginPage`, and `DashboardPage`.
-   **Routing:** Client-side routing is handled by `react-router-dom`. The main routes are defined in `App.jsx`. Private routes are used to protect pages that require authentication.
-   **State Management:** Application-wide state, such as user authentication and theme, is managed using React's Context API. The contexts are defined in `src/contexts`.
-   **API Communication:** The frontend communicates with the backend API using `axios`. A pre-configured axios instance in `src/api/axiosConfig.js` is used to automatically include the JWT token in requests.


