# Smart Contact Manager - Text-Based Data Flow Diagram

## 📊 DATA FLOW DIAGRAM (TEXT FORMAT)

### **LEVEL 0 - CONTEXT DIAGRAM**

```
                    SMART CONTACT MANAGER SYSTEM
                    =============================

┌─────────────────┐                                   ┌─────────────────┐
│      USER       │◄─────── Authentication ────────► │   OAUTH         │
│  (External)     │         Response                  │  PROVIDERS      │
└─────────────────┘                                   │ (Google/GitHub) │
         │                                            └─────────────────┘
         │ Login/Register                                      │
         │ Contact Data                                        │
         │ Notes Data           ┌─────────────────────────────┐│ OAuth Data
         │ Excel Files          │                             ││
         ▼                      │   SMART CONTACT MANAGER     ││
┌─────────────────┐             │         SYSTEM              ││
│    RESPONSES    │◄────────────│                             ││
│  Contact Info   │             │   ┌─────────────────────┐   ││
│  Notes Info     │             │   │   Authentication    │   ││
│  Processed Data │             │   │      Module         │◄──┘│
└─────────────────┘             │   └─────────────────────┘   │
                               │   ┌─────────────────────┐   │
                               │   │   Contact          │   │
                               │   │   Management       │   │
                               │   └─────────────────────┘   │
                               │   ┌─────────────────────┐   │
                               │   │   Notes            │   │
                               │   │   Management       │   │
                               │   └─────────────────────┘   │
                               │   ┌─────────────────────┐   │
                               │   │   Excel            │   │
                               │   │   Processing       │   │
                               │   └─────────────────────┘   │
                               └─────────────────────────────┘
                                         │         │
                                         │         │
                              ┌──────────▼─┐   ┌───▼────────┐
                              │  DATABASE  │   │ CLOUDINARY │
                              │  (MySQL)   │   │  (Images)  │
                              └────────────┘   └────────────┘
                                         │
                                         ▼
                              ┌─────────────────┐
                              │  EMAIL SERVICE  │
                              │    (SMTP)       │
                              └─────────────────┘
```

### **LEVEL 1 - SYSTEM OVERVIEW DFD**

```
                         SMART CONTACT MANAGER - LEVEL 1 DFD
                         ===================================

┌─────────┐     Login           ┌─────────────────┐         ┌──────────────┐
│  USER   │────Credentials─────►│  1.0 AUTH       │────────►│ D1: USER     │
│         │                     │  PROCESS        │         │    DATA      │
│         │◄────JWT Token───────│                 │◄────────│              │
└─────────┘                     └─────────────────┘         └──────────────┘
     │                                   │
     │ Contact Data           OAuth      │
     ▼                       Request     ▼
┌─────────────────┐                ┌─────────────────┐
│  2.0 CONTACT    │◄──────────────►│ OAUTH PROVIDERS │
│  MANAGEMENT     │   User Info    │ (Google/GitHub) │
│                 │                └─────────────────┘
└─────────────────┘
     │         │
     │         ▼
     │    ┌──────────────┐     ┌─────────────────┐
     │    │ D2: CONTACT  │────►│   CLOUDINARY    │
     │    │    DATA      │     │  (Image Store)  │
     │    └──────────────┘     └─────────────────┘
     │
┌─────────┐
│  USER   │     Notes Data      ┌─────────────────┐         ┌──────────────┐
│         │────────────────────►│  3.0 NOTES      │────────►│ D3: NOTES    │
│         │◄────Notes List──────│  MANAGEMENT     │◄────────│    DATA      │
└─────────┘                     └─────────────────┘         └──────────────┘
     │
     │ Excel Files
     ▼
┌─────────────────┐              ┌──────────────┐
│  4.0 EXCEL      │◄────────────►│ D2: CONTACT  │
│  MANAGEMENT     │  Bulk Data   │    DATA      │
│                 │              └──────────────┘
└─────────────────┘
     │
     ▼ Export/Import Results
┌─────────┐     Profile Data     ┌─────────────────┐         ┌──────────────┐
│  USER   │────────────────────►│  5.0 USER       │────────►│ D1: USER     │
│         │◄────Updated Profile─│  MANAGEMENT     │◄────────│    DATA      │
└─────────┘                     └─────────────────┘         └──────────────┘
                                          │
                                          ▼
                               ┌─────────────────┐
                               │  EMAIL SERVICE  │
                               │ (Verification)  │
                               └─────────────────┘

DATA STORES:
D1: USER DATA     - User accounts, profiles, authentication
D2: CONTACT DATA  - Contact information, relationships
D3: NOTES DATA    - User notes, categories, favorites
D4: MESSAGE DATA  - System messages, notifications
```

### **LEVEL 2 - DETAILED PROCESS DFD**

#### **2.1 AUTHENTICATION PROCESS (1.0)**

```
                    AUTHENTICATION PROCESS BREAKDOWN
                    ================================

┌─────────┐   Registration    ┌─────────────────┐        ┌──────────────┐
│  USER   │──────Data────────►│  1.1 USER       │───────►│ D1: USER     │
│         │                   │  REGISTRATION   │        │    DATA      │
│         │◄──Success/Error───│                 │        └──────────────┘
└─────────┘                   └─────────────────┘               │
     │                                 │                        │
     │ Login Credentials               │ Email Verification     │
     ▼                                 ▼                        │
┌─────────────────┐           ┌─────────────────┐              │
│  1.2 USER       │◄─────────►│ D1: USER DATA   │◄─────────────┘
│  LOGIN          │ Verify    └─────────────────┘
│                 │
└─────────────────┘
     │         │
     │         ▼ Valid User
     │    ┌─────────────────┐        ┌─────────────────┐
     │    │  1.4 JWT        │───────►│  JWT TOKEN      │
     │    │  MANAGEMENT     │        │  (Response)     │
     │    └─────────────────┘        └─────────────────┘
     │                                        │
┌─────────┐   OAuth Choice   ┌─────────────────┐        │
│  USER   │─────────────────►│  1.3 OAUTH      │        │
│         │                  │  AUTHENTICATION │        │
│         │◄─────────────────│                 │        │
└─────────┘  OAuth Response  └─────────────────┘        │
                                      │                 │
                                      ▼                 ▼
                              ┌─────────────────┐  ┌─────────┐
                              │ OAUTH PROVIDERS │  │  USER   │
                              │ (Google/GitHub) │  │         │
                              └─────────────────┘  └─────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │  1.5 EMAIL      │
                              │  VERIFICATION   │
                              └─────────────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │  EMAIL SERVICE  │
                              │    (SMTP)       │
                              └─────────────────┘
```

#### **2.2 CONTACT MANAGEMENT PROCESS (2.0)**

```
                    CONTACT MANAGEMENT PROCESS BREAKDOWN
                    ===================================

┌─────────┐   Contact Form    ┌─────────────────┐        ┌──────────────┐
│  USER   │──────Data────────►│  2.1 ADD        │───────►│ D2: CONTACT  │
│         │                   │  CONTACT        │        │    DATA      │
│         │◄──Success Msg─────│                 │        └──────────────┘
└─────────┘                   └─────────────────┘               │
     │                                 │                        │
     │ View Request                    │ Image Upload           │
     ▼                                 ▼                        │
┌─────────────────┐           ┌─────────────────┐              │
│  2.2 VIEW       │◄─────────►│ D2: CONTACT     │◄─────────────┘
│  CONTACTS       │  Contact  │    DATA         │
│                 │  List     └─────────────────┘
└─────────────────┘                   │
     │                                │
     ▼ Contact List                   ▼ Image Data
┌─────────┐                  ┌─────────────────┐
│  USER   │                  │  2.6 IMAGE      │
│         │                  │  MANAGEMENT     │
│         │◄─────────────────│                 │
└─────────┘  Display List    └─────────────────┘
     │                                │
     │ Update Request                 ▼
     ▼                       ┌─────────────────┐
┌─────────────────┐          │   CLOUDINARY    │
│  2.3 UPDATE     │          │  (Cloud Store)  │
│  CONTACT        │          └─────────────────┘
│                 │
└─────────────────┘
     │         │
     │         ▼ Modified Data
     │    ┌─────────────────┐
     │    │ D2: CONTACT     │
     │    │    DATA         │
     │    └─────────────────┘
┌─────────┐
│  USER   │   Delete Request ┌─────────────────┐        ┌──────────────┐
│         │─────────────────►│  2.4 DELETE     │───────►│ D2: CONTACT  │
│         │◄─Success Msg─────│  CONTACT        │ Remove │    DATA      │
└─────────┘                  └─────────────────┘        └──────────────┘
     │
     │ Search Query
     ▼
┌─────────────────┐          ┌──────────────┐
│  2.5 SEARCH     │◄────────►│ D2: CONTACT  │
│  CONTACTS       │  Query   │    DATA      │
│                 │          └──────────────┘
└─────────────────┘
     │
     ▼ Search Results
┌─────────┐
│  USER   │
│         │
└─────────┘
```

### **DATA DICTIONARY (TEXT FORMAT)**

#### **DATA FLOWS**

```
┌─────────────────────┬─────────────────────────┬─────────────────────────┐
│    DATA FLOW        │      DESCRIPTION        │     DATA ELEMENTS       │
├─────────────────────┼─────────────────────────┼─────────────────────────┤
│ Login Credentials   │ User authentication     │ email, password         │
│ JWT Token          │ Authentication token    │ token, expiry, user_id  │
│ Contact Information│ Contact details         │ name, email, phone,     │
│                    │                         │ address, description,   │
│                    │                         │ picture                 │
│ Notes Data         │ Note information        │ title, content,         │
│                    │                         │ category, favorite,     │
│                    │                         │ created_at, updated_at  │
│ Excel File         │ Import/export file      │ contact_list, headers,  │
│                    │                         │ data_rows              │
│ Profile Updates    │ User profile changes    │ name, about, phone,     │
│                    │                         │ profile_picture        │
│ Search Query       │ Search parameters       │ field, value, filters   │
│ Image Upload       │ Profile/contact images  │ file, file_type, size   │
│ OAuth Data         │ External auth data      │ provider, user_info,    │
│                    │                         │ access_token           │
│ Email Request      │ Email verification      │ recipient, subject,     │
│                    │                         │ content, template      │
└─────────────────────┴─────────────────────────┴─────────────────────────┘
```

#### **DATA STORES**

```
┌─────────────────┬──────────────────────────┬─────────────────────────┐
│   DATA STORE    │       DESCRIPTION        │      KEY FIELDS         │
├─────────────────┼──────────────────────────┼─────────────────────────┤
│ D1: User Data   │ User account information │ user_id, name, email,   │
│                 │                          │ password_hash, roles,   │
│                 │                          │ created_at, enabled     │
├─────────────────┼──────────────────────────┼─────────────────────────┤
│ D2: Contact     │ Contact records          │ contact_id, user_id,    │
│     Data        │                          │ name, email, phone,     │
│                 │                          │ address, picture        │
├─────────────────┼──────────────────────────┼─────────────────────────┤
│ D3: Notes Data  │ User notes               │ note_id, user_id,       │
│                 │                          │ title, content,         │
│                 │                          │ category, favorite      │
├─────────────────┼──────────────────────────┼─────────────────────────┤
│ D4: Message     │ System messages          │ message_id, content,    │
│     Data        │                          │ type, timestamp         │
└─────────────────┴──────────────────────────┴─────────────────────────┘
```

#### **EXTERNAL ENTITIES**

```
┌─────────────────┬─────────────────────────┬─────────────────────────┐
│     ENTITY      │      DESCRIPTION        │       INTERFACE         │
├─────────────────┼─────────────────────────┼─────────────────────────┤
│ User            │ System users            │ Web interface,          │
│                 │                         │ API calls               │
├─────────────────┼─────────────────────────┼─────────────────────────┤
│ Database        │ MySQL database          │ JDBC connections        │
├─────────────────┼─────────────────────────┼─────────────────────────┤
│ Cloudinary      │ Image storage service   │ REST API                │
├─────────────────┼─────────────────────────┼─────────────────────────┤
│ Email Service   │ SMTP email service      │ JavaMail API            │
├─────────────────┼─────────────────────────┼─────────────────────────┤
│ OAuth Providers │ Google, GitHub auth     │ OAuth2 protocol         │
└─────────────────┴─────────────────────────┴─────────────────────────┘
```

### **PROCESS SPECIFICATIONS**

#### **Process 1.0: Authentication Process**

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROCESS: 1.0 Authentication Process                                │
├─────────────────────────────────────────────────────────────────────┤
│ INPUT:   Login credentials, OAuth tokens, Registration data        │
│ OUTPUT:  JWT tokens, Authentication status, User sessions          │
│ LOGIC:   1. Validate input credentials                             │
│          2. Check user existence in database                       │
│          3. Verify password or OAuth token                         │
│          4. Generate JWT token if valid                            │
│          5. Create user session                                    │
│          6. Send verification email if needed                      │
│ STORAGE: User Data (D1)                                            │
│ ERROR:   Invalid credentials, Account disabled, Network errors     │
└─────────────────────────────────────────────────────────────────────┘
```

#### **Process 2.0: Contact Management**

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROCESS: 2.0 Contact Management                                    │
├─────────────────────────────────────────────────────────────────────┤
│ INPUT:   Contact forms, Search queries, Image files                │
│ OUTPUT:  Contact lists, Search results, Success/Error messages     │
│ LOGIC:   1. Validate contact data                                  │
│          2. Process image uploads to Cloudinary                    │
│          3. Store/Update/Delete contact records                    │
│          4. Implement search functionality                         │
│          5. Apply pagination and sorting                           │
│          6. Ensure user data isolation                             │
│ STORAGE: Contact Data (D2), User Data (D1)                         │
│ ERROR:   Validation errors, Image upload failures, DB errors       │
└─────────────────────────────────────────────────────────────────────┘
```

#### **Process 3.0: Notes Management**

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROCESS: 3.0 Notes Management                                      │
├─────────────────────────────────────────────────────────────────────┤
│ INPUT:   Note content, Category data, Search queries               │
│ OUTPUT:  Notes lists, Search results, Favorite notes               │
│ LOGIC:   1. Validate note content and metadata                     │
│          2. Store notes with timestamps                            │
│          3. Implement categorization and favorites                 │
│          4. Provide full-text search capabilities                  │
│          5. Support CRUD operations                                │
│          6. Maintain user data ownership                           │
│ STORAGE: Notes Data (D3), User Data (D1)                           │
│ ERROR:   Content validation errors, Search failures                │
└─────────────────────────────────────────────────────────────────────┘
```

#### **Process 4.0: Excel Management**

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROCESS: 4.0 Excel Management                                      │
├─────────────────────────────────────────────────────────────────────┤
│ INPUT:   Excel files, Export requests, Template requests           │
│ OUTPUT:  Import results, Excel downloads, Templates                │
│ LOGIC:   1. Validate Excel file format and size                    │
│          2. Parse Excel data into contact objects                  │
│          3. Validate each contact record                           │
│          4. Bulk import valid contacts                             │
│          5. Generate export files with user contacts               │
│          6. Provide download templates                             │
│ STORAGE: Contact Data (D2), User Data (D1)                         │
│ ERROR:   File format errors, Validation failures, Import errors    │
└─────────────────────────────────────────────────────────────────────┘
```

#### **Process 5.0: User Management**

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROCESS: 5.0 User Management                                       │
├─────────────────────────────────────────────────────────────────────┤
│ INPUT:   Profile updates, Password changes, Image uploads          │
│ OUTPUT:  Updated profiles, Success messages, Profile images        │
│ LOGIC:   1. Validate profile update data                           │
│          2. Process profile image uploads                          │
│          3. Hash and store password changes                        │
│          4. Update user preferences                                │
│          5. Maintain user session consistency                      │
│          6. Send notification emails if needed                     │
│ STORAGE: User Data (D1)                                            │
│ ERROR:   Validation errors, Image upload failures, DB errors       │
└─────────────────────────────────────────────────────────────────────┘
```

### **SECURITY AND CONSTRAINTS**

```
┌─────────────────────────────────────────────────────────────────────┐
│ SECURITY REQUIREMENTS                                               │
├─────────────────────────────────────────────────────────────────────┤
│ • Authentication required for all data operations                  │
│ • User data isolation - users access only their own data           │
│ • Input validation and sanitization for all user inputs            │
│ • Password hashing using BCrypt with salt                          │
│ • JWT token validation for session management                      │
│ • HTTPS encryption for all data transmission                       │
│ • File upload validation (type, size, content)                     │
│ • SQL injection prevention using parameterized queries             │
│ • XSS protection with output encoding                              │
│ • CSRF protection for state-changing operations                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANCE CONSTRAINTS                                             │
├─────────────────────────────────────────────────────────────────────┤
│ • Database connection pooling for efficient resource usage         │
│ • Pagination for large datasets (contacts, notes)                  │
│ • Indexing on frequently queried fields                            │
│ • Image optimization and CDN usage                                 │
│ • Caching for frequently accessed data                             │
│ • Rate limiting for API endpoints                                  │
│ • File size limits for uploads (5MB max)                           │
│ • Session timeout for inactive users (30 minutes)                  │
│ • Bulk operations optimization for Excel imports                   │
│ • Lazy loading for related data                                    │
└─────────────────────────────────────────────────────────────────────┘
```
