# Smart Contact Manager - Use Case Diagram

## Use Case Diagram (Text Representation)

```
                    Smart Contact Manager System
                           Use Case Diagram
    
    ┌─────────────────────────────────────────────────────────────────────┐
    │                                                                     │
    │                          SYSTEM BOUNDARY                           │
    │                                                                     │
    │    ┌─────────────────┐                                             │
    │    │                 │                                             │
    │    │   Guest User    │──────┐                                      │
    │    │                 │      │                                      │
    │    └─────────────────┘      │                                      │
    │                             │                                      │
    │                             ▼                                      │
    │                    ┌─────────────────┐                            │
    │                    │  Register       │                            │
    │                    │  Account        │                            │
    │                    └─────────────────┘                            │
    │                             │                                      │
    │                             ▼                                      │
    │                    ┌─────────────────┐                            │
    │                    │  Login to       │                            │
    │                    │  System         │◄───┐                       │
    │                    └─────────────────┘    │                       │
    │                             │             │                       │
    │                             ▼             │                       │
    │    ┌─────────────────┐ ┌─────────────────┐ │                      │
    │    │                 │ │  Verify Email   │ │                      │
    │    │ Regular User    │ │  Address        │ │                      │
    │    │                 │ └─────────────────┘ │                      │
    │    │ (ROLE_USER)     │                     │                      │
    │    └─────────────────┘                     │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  View Profile   │  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Update Profile │  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Add Contact    │  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  View Contacts  │  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Update Contact │  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Delete Contact │  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Search Contacts│  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Export Contacts│  │                      │
    │             │         └─────────────────┘  │                      │
    │             │                              │                      │
    │             │         ┌─────────────────┐  │                      │
    │             └────────►│  Direct Message │  │                      │
    │                       └─────────────────┘  │                      │
    │                                            │                      │
    │    ┌─────────────────┐                     │                      │
    │    │                 │                     │                      │
    │    │ Administrator   │─────────────────────┘                      │
    │    │                 │                                            │
    │    │ (ROLE_ADMIN)    │                                            │
    │    └─────────────────┘                                            │
    │             │                                                     │
    │             │         ┌─────────────────┐                        │
    │             └────────►│  View Admin     │                        │
    │             │         │  Dashboard      │                        │
    │             │         └─────────────────┘                        │
    │             │                                                     │
    │             │         ┌─────────────────┐                        │
    │             └────────►│  View All Users │                        │
    │             │         └─────────────────┘                        │
    │             │                                                     │
    │             │         ┌─────────────────┐                        │
    │             └────────►│  View User      │                        │
    │             │         │  Contacts       │                        │
    │             │         └─────────────────┘                        │
    │             │                                                     │
    │             │         ┌─────────────────┐                        │
    │             └────────►│  Monitor System │                        │
    │             │         │  Statistics     │                        │
    │             │         └─────────────────┘                        │
    │             │                                                     │
    │             │         ┌─────────────────┐                        │
    │             └────────►│  Manage User    │                        │
    │                       │  Accounts       │                        │
    │                       └─────────────────┘                        │
    │                                                                   │
    │                   External Systems                                │
    │                                                                   │
    │             ┌─────────────────┐                                   │
    │             │  OAuth Providers│                                   │
    │             │  (Google/GitHub)│                                   │
    │             └─────────────────┘                                   │
    │                       │                                           │
    │                       ▼                                           │
    │             ┌─────────────────┐                                   │
    │             │  Email Service  │                                   │
    │             │  (Verification) │                                   │
    │             └─────────────────┘                                   │
    │                                                                   │
    └─────────────────────────────────────────────────────────────────────┘
```

## Detailed Use Case Descriptions

### 1. **Guest User Use Cases**

#### UC-001: Register Account
- **Actor:** Guest User
- **Description:** New user creates an account in the system
- **Preconditions:** User has valid email address
- **Main Flow:**
  1. User navigates to registration page
  2. User fills registration form (name, email, password)
  3. System validates input data
  4. System creates user account with ROLE_USER
  5. System sends verification email
- **Postconditions:** User account created, verification email sent

#### UC-002: Login to System
- **Actor:** Guest User, Regular User, Administrator
- **Description:** User authenticates into the system
- **Preconditions:** User has valid account
- **Main Flow:**
  1. User enters email and password
  2. System validates credentials
  3. System generates JWT token
  4. System redirects based on user role
- **Alternative Flow:** OAuth login (Google/GitHub)

### 2. **Regular User Use Cases**

#### UC-003: View Profile
- **Actor:** Regular User
- **Description:** User views their profile information
- **Preconditions:** User is authenticated
- **Main Flow:**
  1. User navigates to profile page
  2. System displays user information
  3. User can view personal details

#### UC-004: Update Profile
- **Actor:** Regular User
- **Description:** User updates their profile information
- **Preconditions:** User is authenticated
- **Main Flow:**
  1. User navigates to profile edit page
  2. User modifies profile information
  3. System validates and saves changes
  4. System displays success message

#### UC-005: Add Contact
- **Actor:** Regular User
- **Description:** User adds a new contact to their contact list
- **Preconditions:** User is authenticated
- **Main Flow:**
  1. User navigates to add contact page
  2. User fills contact form (name, email, phone, etc.)
  3. User optionally uploads contact image
  4. System validates and saves contact
  5. System displays success message

#### UC-006: View Contacts
- **Actor:** Regular User
- **Description:** User views their contact list
- **Preconditions:** User is authenticated
- **Main Flow:**
  1. User navigates to contacts page
  2. System displays paginated contact list
  3. User can sort and filter contacts
  4. User can mark contacts as favorites

#### UC-007: Update Contact
- **Actor:** Regular User
- **Description:** User modifies existing contact information
- **Preconditions:** User is authenticated, contact exists
- **Main Flow:**
  1. User selects contact to edit
  2. User modifies contact information
  3. System validates and saves changes
  4. System displays success message

#### UC-008: Delete Contact
- **Actor:** Regular User
- **Description:** User removes a contact from their list
- **Preconditions:** User is authenticated, contact exists
- **Main Flow:**
  1. User selects contact to delete
  2. System asks for confirmation
  3. User confirms deletion
  4. System removes contact and displays confirmation

#### UC-009: Search Contacts
- **Actor:** Regular User
- **Description:** User searches for specific contacts
- **Preconditions:** User is authenticated
- **Main Flow:**
  1. User enters search criteria
  2. System searches contacts by name, email, or phone
  3. System displays matching results
  4. User can select and view contact details

#### UC-010: Export Contacts
- **Actor:** Regular User
- **Description:** User exports their contacts data
- **Preconditions:** User is authenticated, has contacts
- **Main Flow:**
  1. User requests contact export
  2. System generates export file (CSV/Excel)
  3. System provides download link
  4. User downloads contact data

#### UC-011: Direct Message
- **Actor:** Regular User
- **Description:** User sends direct messages to contacts
- **Preconditions:** User is authenticated, contact exists
- **Main Flow:**
  1. User selects contact for messaging
  2. User composes message
  3. System sends message
  4. System displays message history

### 3. **Administrator Use Cases**

#### UC-012: View Admin Dashboard
- **Actor:** Administrator
- **Description:** Admin views system overview and statistics
- **Preconditions:** User has ROLE_ADMIN
- **Main Flow:**
  1. Admin navigates to admin dashboard
  2. System displays user statistics
  3. System shows contact counts
  4. System displays system health metrics

#### UC-013: View All Users
- **Actor:** Administrator
- **Description:** Admin views all registered users
- **Preconditions:** User has ROLE_ADMIN
- **Main Flow:**
  1. Admin navigates to users management page
  2. System displays paginated user list
  3. Admin can see user details (name, email, status)
  4. Admin can view contact counts per user

#### UC-014: View User Contacts
- **Actor:** Administrator
- **Description:** Admin views specific user's contacts
- **Preconditions:** User has ROLE_ADMIN, target user exists
- **Main Flow:**
  1. Admin selects user from list
  2. Admin clicks "View Contacts"
  3. System displays user's contact list
  4. Admin can view contact details

#### UC-015: Monitor System Statistics
- **Actor:** Administrator
- **Description:** Admin monitors system usage and performance
- **Preconditions:** User has ROLE_ADMIN
- **Main Flow:**
  1. Admin views dashboard statistics
  2. System shows total users count
  3. System shows total contacts count
  4. System shows active users count

#### UC-016: Manage User Accounts
- **Actor:** Administrator
- **Description:** Admin manages user account status
- **Preconditions:** User has ROLE_ADMIN
- **Main Flow:**
  1. Admin views user list
  2. Admin can see user status (enabled/disabled)
  3. Admin can view user verification status
  4. Admin can monitor user activity

### 4. **System Use Cases**

#### UC-017: Email Verification
- **Actor:** System
- **Description:** System sends and processes email verification
- **Preconditions:** User registration completed
- **Main Flow:**
  1. System generates verification token
  2. System sends verification email
  3. User clicks verification link
  4. System validates token and activates account

#### UC-018: OAuth Authentication
- **Actor:** System, OAuth Provider
- **Description:** System authenticates users via OAuth providers
- **Preconditions:** OAuth provider configured
- **Main Flow:**
  1. User selects OAuth login
  2. System redirects to OAuth provider
  3. User authorizes application
  4. System receives user data and creates/updates account

## Actor Relationships

### Primary Actors:
- **Guest User:** Unregistered visitor
- **Regular User (ROLE_USER):** Authenticated user with basic permissions
- **Administrator (ROLE_ADMIN):** Authenticated user with administrative permissions

### Secondary Actors:
- **Email Service:** External service for sending emails
- **OAuth Providers:** Google, GitHub for authentication
- **Database System:** Data persistence layer
- **File Storage:** Cloud storage for contact images

## Use Case Priorities

### High Priority:
- Login/Registration (UC-001, UC-002)
- Contact Management (UC-005, UC-006, UC-007, UC-008)
- Admin Dashboard (UC-012, UC-013)

### Medium Priority:
- Profile Management (UC-003, UC-004)
- Contact Search (UC-009)
- Admin User Management (UC-014, UC-016)

### Low Priority:
- Contact Export (UC-010)
- Direct Messaging (UC-011)
- System Monitoring (UC-015)

## Security Considerations

1. **Authentication:** JWT-based authentication
2. **Authorization:** Role-based access control (RBAC)
3. **Data Validation:** Input validation for all user inputs
4. **Secure Communication:** HTTPS for all communications
5. **Password Security:** BCrypt password encoding
6. **Session Management:** Stateless JWT tokens
