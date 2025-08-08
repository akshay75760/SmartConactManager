# Smart Contact Manager - Technical Stack & Dependencies

## 🛠️ Technology Stack Overview

### **Backend Technology Stack**
```
Java 21+ (Programming Language)
    ↓
Spring Boot 3.2.10 (Application Framework)
    ↓
Spring Security 6.x (Authentication & Authorization)
    ↓
Spring Data JPA 3.x (Data Access Layer)
    ↓
Hibernate 6.4.10 (ORM Framework)
    ↓
MySQL 8.0+ (Database)
```

### **Frontend Technology Stack**
```
React 18.x (Frontend Framework)
    ↓
Vite 7.0.6 (Build Tool & Dev Server)
    ↓
React Router 6.x (Client-side Routing)
    ↓
Tailwind CSS 3.x (Styling Framework)
    ↓
Axios (HTTP Client)
```

---

## 📦 Complete Dependencies List

### **Backend Dependencies (Maven)**

#### **1. Core Spring Boot Dependencies**
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.10</version>
    <relativePath/>
</parent>

<!-- Spring Boot Web Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Boot Security Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Spring Boot Data JPA Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Spring Boot Validation Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Spring Boot Thymeleaf Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- Spring Boot Mail Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- Spring Boot OAuth2 Client -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>

<!-- Spring Boot DevTools -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

#### **2. Database Dependencies**
```xml
<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### **3. JWT Dependencies**
```xml
<!-- JJWT API -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- JJWT Implementation -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- JJWT Jackson -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

#### **4. Excel Processing Dependencies**
```xml
<!-- Apache POI for Excel -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>5.2.4</version>
</dependency>

<!-- Apache POI OOXML -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.4</version>
</dependency>
```

#### **5. Utility Dependencies**
```xml
<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Cloudinary -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.37.0</version>
</dependency>
```

#### **6. Testing Dependencies**
```xml
<!-- Spring Boot Test Starter -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- Spring Security Test -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

### **Frontend Dependencies (package.json)**

#### **1. Core React Dependencies**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0"
  }
}
```

#### **2. HTTP Client & Utilities**
```json
{
  "dependencies": {
    "axios": "^1.5.0",
    "react-toastify": "^9.1.3"
  }
}
```

#### **3. Development Dependencies**
```json
{
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^7.0.6",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3"
  }
}
```

#### **4. CSS & Styling Dependencies**
```json
{
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27"
  }
}
```

---

## 🎯 Feature-Specific Technology Mapping

### **1. Authentication & Security**
| Feature | Technology | Purpose |
|---------|------------|---------|
| **JWT Authentication** | `io.jsonwebtoken:jjwt-api:0.12.3` | Stateless authentication |
| **OAuth2 Integration** | `spring-boot-starter-oauth2-client` | Google/GitHub login |
| **Password Encryption** | `BCryptPasswordEncoder` (Spring Security) | Secure password storage |
| **CORS Configuration** | `@CrossOrigin` annotations | Cross-origin resource sharing |
| **Input Validation** | `spring-boot-starter-validation` | Bean validation |

### **2. Contact Management**
| Feature | Technology | Purpose |
|---------|------------|---------|
| **Data Persistence** | `Spring Data JPA` + `Hibernate` | ORM and database operations |
| **Image Upload** | `Cloudinary API` | Cloud-based image storage |
| **Form Validation** | `@Valid` annotations + React validation | Data integrity |
| **Pagination** | `Pageable` interface | Large dataset handling |
| **Search Functionality** | `@Query` annotations | Custom database queries |

### **3. Notes System**
| Feature | Technology | Purpose |
|---------|------------|---------|
| **Rich Text Storage** | `@Lob` annotation | Large text content |
| **Timestamps** | `@CreationTimestamp`, `@UpdateTimestamp` | Automatic date tracking |
| **Categorization** | `String` fields with validation | Note organization |
| **Full-text Search** | JPA custom queries | Content search |
| **Favoriting** | `boolean` flags | User preferences |

### **4. Excel Import/Export**
| Feature | Technology | Purpose |
|---------|------------|---------|
| **Excel Processing** | `Apache POI 5.2.4` | Read/write Excel files |
| **File Upload** | `MultipartFile` (Spring) | File handling |
| **Data Validation** | Custom validation logic | Import data integrity |
| **Template Generation** | `XSSFWorkbook` | Excel template creation |
| **Bulk Operations** | Batch processing logic | Performance optimization |

### **5. User Interface**
| Feature | Technology | Purpose |
|---------|------------|---------|
| **Component Architecture** | `React 18.x` | Modern UI framework |
| **Routing** | `React Router 6.x` | Single-page application navigation |
| **State Management** | `React Hooks` + `Context API` | Application state |
| **Styling** | `Tailwind CSS 3.x` | Utility-first CSS framework |
| **Icons** | `Font Awesome 6.4.0` | Icon library |
| **Notifications** | `react-toastify` | User feedback system |
| **HTTP Requests** | `Axios` | API communication |

### **6. Email System**
| Feature | Technology | Purpose |
|---------|------------|---------|
| **Email Sending** | `spring-boot-starter-mail` | SMTP email delivery |
| **Template Processing** | `Thymeleaf` | Email template rendering |
| **Verification** | Custom token generation | Email verification |
| **Configuration** | `JavaMailSender` | Email service setup |

---

## 🔧 Configuration Files

### **Backend Configuration**

#### **1. Application Properties**
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/scm2
spring.datasource.username=root
spring.datasource.password=admin
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8081

# File Upload Configuration
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

# JWT Configuration
jwt.secret=your-jwt-secret-key
jwt.expiration=86400000

# OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${EMAIL_USERNAME}
spring.mail.password=${EMAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Cloudinary Configuration
cloudinary.cloud.name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api.key=${CLOUDINARY_API_KEY}
cloudinary.api.secret=${CLOUDINARY_API_SECRET}

# Logging Configuration
logging.level.com.scm=DEBUG
logging.level.org.springframework.security=DEBUG
```

#### **2. Maven Configuration (pom.xml)**
```xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### **Frontend Configuration**

#### **1. Vite Configuration**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
```

#### **2. Tailwind Configuration**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### **3. PostCSS Configuration**
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### **4. ESLint Configuration**
```javascript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
]
```

---

## 🏗️ Build Tools & Scripts

### **Backend Build Scripts**
```bash
# Maven wrapper commands
./mvnw clean                    # Clean build artifacts
./mvnw compile                  # Compile source code
./mvnw test                     # Run tests
./mvnw package                  # Create JAR file
./mvnw spring-boot:run          # Run application
./mvnw spring-boot:build-image  # Create Docker image
```

### **Frontend Build Scripts**
```json
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "vite build",            // Production build
    "lint": "eslint . --ext js,jsx",  // Code linting
    "preview": "vite preview",        // Preview production build
    "test": "vitest"                  // Run tests
  }
}
```

---

## 📊 Version Compatibility Matrix

| Backend Technology | Version | Compatibility |
|-------------------|---------|---------------|
| **Java** | 21+ | ✅ Required |
| **Spring Boot** | 3.2.10 | ✅ LTS Version |
| **Spring Security** | 6.x | ✅ Latest |
| **MySQL** | 8.0+ | ✅ Recommended |
| **Maven** | 3.6+ | ✅ Required |

| Frontend Technology | Version | Compatibility |
|--------------------|---------|---------------|
| **Node.js** | 18+ | ✅ Required |
| **React** | 18.x | ✅ Latest Stable |
| **Vite** | 7.0.6 | ✅ Latest |
| **Tailwind CSS** | 3.x | ✅ Latest |

---

## 🔍 Performance Considerations

### **Backend Optimizations**
- **Connection Pooling**: HikariCP (default in Spring Boot)
- **JPA Optimization**: Lazy loading, batch fetching
- **Caching**: Spring Cache abstraction (ready for Redis)
- **Pagination**: Efficient large dataset handling
- **Database Indexing**: Strategic index placement

### **Frontend Optimizations**
- **Code Splitting**: React.lazy() for route-based splitting
- **Bundle Optimization**: Vite's tree-shaking
- **Image Optimization**: Cloudinary transformations
- **Caching**: Browser caching strategies
- **Minification**: Production build optimization

---

## 🛡️ Security Dependencies

### **Authentication Libraries**
```xml
<!-- JWT Token Processing -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- OAuth2 Client Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>

<!-- Password Encryption -->
<!-- Included in spring-boot-starter-security -->
```

### **Validation Libraries**
```xml
<!-- Bean Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Hibernate Validator -->
<!-- Included in validation starter -->
```

---

## 📋 Complete Technology Summary

### **Programming Languages**
- **Backend**: Java 21
- **Frontend**: JavaScript (ES2023)
- **Styling**: CSS3 with Tailwind
- **Configuration**: YAML/Properties
- **Database**: SQL (MySQL dialect)

### **Frameworks & Libraries**
- **Spring Ecosystem**: Boot, Security, Data JPA, OAuth2
- **React Ecosystem**: React, Router, Hooks, Context API
- **ORM**: Hibernate 6.4.10
- **Build Tools**: Maven (backend), Vite (frontend)
- **Testing**: JUnit 5, React Testing Library

### **External Services**
- **Database**: MySQL 8.0+
- **Image Storage**: Cloudinary
- **Email**: SMTP (Gmail)
- **Authentication**: Google OAuth2, GitHub OAuth2
- **Icons**: Font Awesome CDN

### **Development Tools**
- **IDE**: VS Code, IntelliJ IDEA
- **Version Control**: Git
- **Package Managers**: Maven, npm
- **Linting**: ESLint (frontend)
- **Hot Reload**: Spring DevTools, Vite HMR

This comprehensive technical documentation covers all technologies, dependencies, and configurations used in the Smart Contact Manager project. Each component is carefully selected to provide optimal performance, security, and developer experience.
