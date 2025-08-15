# Smart Contact Manager - Text-Based Activity Diagram

## 🔄 ACTIVITY DIAGRAM (TEXT FORMAT)

### **1. USER REGISTRATION ACTIVITY**

```
                    USER REGISTRATION FLOW
                    ======================

    [START] ──► Enter Registration Details
                         │
                         ▼
               ┌─────────────────────┐
               │ Validate Input Data │
               └─────────────────────┘
                         │
                    ┌────▼────┐
                    │ Valid?  │
                    └────┬────┘
                         │
               ┌─────────┴──────────┐
               │ NO                 │ YES
               ▼                    ▼
    Show Validation Errors    Check Email Exists
               │                    │
               │              ┌─────▼─────┐
               │              │ Exists?   │
               │              └─────┬─────┘
               │                    │
               │              ┌─────┴──────┐
               │              │ YES        │ NO
               │              ▼            ▼
               │     Email Already    Hash Password
               │     Registered            │
               │              │            ▼
               └──────────────┴────► Save to Database
                                           │
                                           ▼
                                  Send Verification Email
                                           │
                                           ▼
                                Registration Successful
                                           │
                                           ▼
                                        [END]

STEPS:
1. User enters: Name, Email, Password, Phone, About
2. System validates all required fields
3. Check if email already exists in database
4. Hash password using BCrypt
5. Save user record to database
6. Send verification email
7. Display success message
```

### **2. USER LOGIN ACTIVITY**

```
                        USER LOGIN FLOW
                        ===============

    [START] ──► Enter Login Credentials
                         │
                         ▼
               ┌─────────────────────┐
               │ Validate Input      │
               └─────────────────────┘
                         │
                    ┌────▼────┐
                    │ Valid?  │
                    └────┬────┘
                         │
               ┌─────────┴──────────┐
               │ NO                 │ YES
               ▼                    ▼
    Show Input Errors        Check User Exists
               │                    │
               │              ┌─────▼─────┐
               │              │ Exists?   │
               │              └─────┬─────┘
               │                    │
               │              ┌─────┴──────┐
               │              │ NO         │ YES
               │              ▼            ▼
               │        User Not Found  Verify Password
               │              │            │
               │              │       ┌────▼────┐
               │              │       │Correct? │
               │              │       └────┬────┘
               │              │            │
               │              │      ┌─────┴──────┐
               │              │      │ NO         │ YES
               │              │      ▼            ▼
               │              │ Invalid      Check Account
               │              │ Password     Enabled
               │              │      │            │
               │              │      │       ┌────▼────┐
               │              │      │       │Enabled? │
               │              │      │       └────┬────┘
               │              │      │            │
               │              │      │      ┌─────┴──────┐
               │              │      │      │ NO         │ YES
               │              │      │      ▼            ▼
               │              │      │ Account      Generate JWT
               │              │      │ Disabled          │
               │              │      │      │            ▼
               └──────────────┴──────┴──────┴────► Set User Session
                                                         │
                                                         ▼
                                                Redirect to Dashboard
                                                         │
                                                         ▼
                                                      [END]

DECISION POINTS:
• Input Validation: Email format, required fields
• User Existence: Check in database
• Password Verification: BCrypt comparison
• Account Status: Enabled/disabled check
• Session Creation: JWT token generation
```

### **3. OAUTH LOGIN ACTIVITY**

```
                       OAUTH LOGIN FLOW
                       ================

    [START] ──► Choose OAuth Provider
                         │
                         ▼
              ┌─────────────────────┐
              │ Google or GitHub?   │
              └─────────────────────┘
                    │          │
              ┌─────▼─────┐  ┌─▼─────┐
              │  Google   │  │ GitHub │
              └─────┬─────┘  └─┬──────┘
                    └─────────┘
                         │
                         ▼
              Redirect to OAuth Provider
                         │
                         ▼
               User Authorizes Application
                         │
                         ▼
              OAuth Callback Received
                         │
                         ▼
               Get Access Token
                         │
                         ▼
               Fetch User Profile
                         │
                         ▼
              ┌─────────────────────┐
              │ User Exists in DB?  │
              └─────────────────────┘
                    │          │
              ┌─────▼─────┐  ┌─▼────────┐
              │    NO     │  │   YES    │
              ▼           │  ▼          │
    Create New User       │  Update     │
    Account              │  Profile     │
              │           │  Info       │
              ▼           │  │          │
    Link OAuth Account    │  │          │
              │           │  │          │
              └───────────┴──┘          │
                         │              │
                         ▼              │
               Generate JWT Token       │
                         │              │
                         └──────────────┘
                         │
                         ▼
               Set User Session
                         │
                         ▼
              Redirect to Dashboard
                         │
                         ▼
                      [END]

OAUTH PROVIDERS:
• Google: Uses Google OAuth2 API
• GitHub: Uses GitHub OAuth2 API
• Profile Data: Name, Email, Profile Picture
• Account Linking: Connects OAuth to user account
```

### **4. CONTACT MANAGEMENT ACTIVITY**

```
                    CONTACT MANAGEMENT FLOW
                    =======================

    [START] ──► User Dashboard
                         │
                         ▼
               ┌─────────────────────┐
               │ Choose Action:      │
               │ • Add Contact       │
               │ • View Contacts     │
               │ • Search Contacts   │
               │ • Excel Operations  │
               └─────────────────────┘
                         │
           ┌─────────────┼─────────────────────┬─────────────────┐
           │             │                     │                 │
           ▼             ▼                     ▼                 ▼
    [ADD CONTACT]  [VIEW CONTACTS]      [SEARCH]         [EXCEL OPS]
           │             │                     │                 │
           ▼             ▼                     ▼                 ▼
    Fill Contact   Load User Contacts   Enter Search      Choose Import
    Form                  │             Criteria          or Export
           │              ▼                     │                 │
           ▼        Apply Pagination           ▼                 ▼
    Validate Data         │             Execute Search    [IMPORT FLOW]
           │              ▼                     │                 │
      ┌────▼────┐   Display Contact            ▼                 ▼
      │ Valid?  │   List                Display Results   [EXPORT FLOW]
      └────┬────┘         │                     │                 │
           │              ▼                     │                 │
    ┌──────┴──────┐ Select Contact Action       │                 │
    │ NO    │ YES │       │                     │                 │
    ▼       ▼     ▼  ┌────▼─────┬──────────────┐│                 │
Show    Image     │  │          │              ││                 │
Errors  Upload?   │  ▼          ▼              ▼│                 │
    │       │     │ View      Edit           Delete              │
    │   ┌───▼───┐ │ Details   Contact        Contact             │
    │   │ YES   │ │    │         │              │                │
    │   ▼   │NO │ │    ▼         ▼              ▼                │
    │Upload │   │ │Show      Update       Confirm Delete         │
    │to     │   │ │Modal     Data              │                │
    │Cloud  │   │ │    │         │         ┌───▼───┐             │
    │   │   │   │ │    │         ▼         │ YES   │ NO          │
    │   ▼   │   │ │    │    Save Changes   ▼   │   ▼             │
    │Get    │   │ │    │         │      Delete │ Cancel          │
    │URL    │   │ │    │         │      Contact│    │             │
    │   │   │   │ │    │         │         │   │    │             │
    │   └───┴───┘ │    │         │         ▼   │    │             │
    │       │     │    │         │      Success│    │             │
    │       ▼     │    │         │      Message│    │             │
    │    Save     │    │         │         │   │    │             │
    │    Contact  │    │         │         └───┼────┘             │
    │       │     │    │         │             │                  │
    │       ▼     │    │         │             │                  │
    │    Success  │    │         │             │                  │
    │    Message  │    │         │             │                  │
    │       │     │    │         │             │                  │
    └───────┴─────┴────┴─────────┴─────────────┼──────────────────┘
                         │                     │
                         ▼                     │
                    Back to Dashboard          │
                         │                     │
                         └─────────────────────┘
                         │
                         ▼
                      [END]

CONTACT OPERATIONS:
• ADD: Form validation, image upload, database save
• VIEW: Pagination, sorting, filtering
• EDIT: Update form, data validation, save changes
• DELETE: Confirmation dialog, database removal
• SEARCH: Field-based search, results display
```

### **5. EXCEL IMPORT/EXPORT ACTIVITY**

```
                    EXCEL OPERATIONS FLOW
                    =====================

    [START] ──► Excel Operations Page
                         │
                         ▼
               ┌─────────────────────┐
               │ Choose Operation:   │
               │ • Import Contacts   │
               │ • Export Contacts   │
               │ • Download Template │
               └─────────────────────┘
                         │
           ┌─────────────┼─────────────┬──────────────┐
           │             │             │              │
           ▼             ▼             ▼              ▼
    [IMPORT FLOW]  [EXPORT FLOW]  [TEMPLATE]    [BACK]
           │             │             │              │
           ▼             ▼             ▼              ▼
    Upload Excel   Fetch User      Generate       Return to
    File          Contacts        Template        Dashboard
           │             │             │              │
           ▼             ▼             ▼              ▼
    Validate File  Create Excel    Download File    [END]
    Format        Workbook             │
           │             │             │
      ┌────▼────┐       ▼             ▼
      │ Valid?  │  Write Contact    [END]
      └────┬────┘  Data to Rows
           │             │
    ┌──────┴──────┐     ▼
    │ NO    │ YES │ Format Excel
    ▼       ▼     │ Cells
Show File   Parse │     │
Errors     Excel  │     ▼
    │      Data   │ Provide Download
    │         │   │     │
    │         ▼   │     ▼
    │    Validate │  [END]
    │    Each Row │
    │         │   │
    │    ┌────▼───┤
    │    │ Valid? │
    │    └────┬───┘
    │         │
    │  ┌──────┴──────┐
    │  │ NO    │ YES │
    │  ▼       ▼     │
    │Show     Bulk   │
    │Validation Import │
    │Errors   to DB   │
    │  │       │     │
    │  │       ▼     │
    │  │    Success  │
    │  │    Message  │
    │  │       │     │
    └──┴───────┴─────┘
           │
           ▼
    Back to Dashboard
           │
           ▼
        [END]

EXCEL OPERATIONS:
• IMPORT: File upload → Parse → Validate → Bulk insert
• EXPORT: Fetch data → Create workbook → Format → Download
• TEMPLATE: Generate sample → Format headers → Download
• VALIDATION: File type, size, data format, required fields
```

### **6. NOTES MANAGEMENT ACTIVITY**

```
                     NOTES MANAGEMENT FLOW
                     =====================

    [START] ──► Notes Dashboard
                         │
                         ▼
               ┌─────────────────────┐
               │ Choose Action:      │
               │ • Create Note       │
               │ • View Notes        │
               │ • Search Notes      │
               │ • Filter by Category│
               │ • View Favorites    │
               └─────────────────────┘
                         │
     ┌─────────┬─────────┼─────────┬─────────┬─────────┐
     │         │         │         │         │         │
     ▼         ▼         ▼         ▼         ▼         ▼
 [CREATE]  [VIEW ALL] [SEARCH] [FILTER] [FAVORITES] [BACK]
     │         │         │         │         │         │
     ▼         ▼         ▼         ▼         ▼         ▼
New Note   Load All   Enter     Select    Load      Return to
Form      Notes      Query     Category  Favorite  Dashboard
     │         │         │         │      Notes        │
     ▼         ▼         ▼         ▼         │         ▼
Fill Note  Display   Execute   Apply      Display   [END]
Details    Notes     Search    Filter     Favorites
     │         │         │         │         │
     ▼         ▼         ▼         ▼         ▼
Validate   Select    Display   Show      Select Note
Note Data  Note      Results   Filtered  Action
     │    Action        │      Notes        │
┌────▼────┐   │         │         │         ▼
│ Valid?  │   ▼         │         │    ┌─────────────────┐
└────┬────┘ ┌─────────────────┐ │    │ Note Actions:   │
     │      │ Note Actions:   │ │    │ • View Details  │
┌────┴────┐ │ • View Details  │ │    │ • Edit Note     │
│NO │ YES │ │ • Edit Note     │ │    │ • Delete Note   │
▼   ▼     │ │ • Delete Note   │ │    │ • Toggle Fav    │
Show Save  │ │ • Toggle Fav    │ │    └─────────────────┘
Errors Note│ │ • Copy Note     │ │              │
│     │    │ └─────────────────┘ │              ▼
│     ▼    │           │         │         [ACTION FLOW]
│  Success │           ▼         │              │
│  Message │      [ACTION FLOW]  │              │
│     │    │           │         │              │
└─────┴────┘           │         │              │
      │                ▼         ▼              ▼
      │           ┌─────────────────────────────────────┐
      │           │          ACTION PROCESSING          │
      │           ├─────────────────────────────────────┤
      │           │ VIEW: Show note in modal/detail view│
      │           │ EDIT: Load edit form, save changes  │
      │           │ DELETE: Confirm dialog, remove note │
      │           │ FAVORITE: Toggle favorite status    │
      │           │ COPY: Duplicate note with new title │
      │           └─────────────────────────────────────┘
      │                           │
      └───────────────────────────┘
              │
              ▼
        Back to Notes Dashboard
              │
              ▼
           [END]

NOTE OPERATIONS:
• CREATE: Form input → Validation → Database save
• VIEW: Load notes → Apply pagination → Display list
• EDIT: Load note → Edit form → Update database
• DELETE: Confirmation → Database removal
• SEARCH: Query input → Search execution → Results
• FILTER: Category selection → Filtered results
• FAVORITE: Toggle status → Update database
```

### **7. PROFILE MANAGEMENT ACTIVITY**

```
                    PROFILE MANAGEMENT FLOW
                    =======================

    [START] ──► Profile Page
                         │
                         ▼
               ┌─────────────────────┐
               │ Load Profile Data   │
               └─────────────────────┘
                         │
                         ▼
               ┌─────────────────────┐
               │ Display Profile     │
               │ Information         │
               └─────────────────────┘
                         │
                         ▼
               ┌─────────────────────┐
               │ Choose Action:      │
               │ • Edit Profile      │
               │ • Change Password   │
               │ • Update Picture    │
               │ • View Account Info │
               └─────────────────────┘
                         │
        ┌────────────────┼────────────────┬─────────────┐
        │                │                │             │
        ▼                ▼                ▼             ▼
  [EDIT PROFILE]  [CHANGE PASSWORD]  [UPDATE PIC]   [VIEW INFO]
        │                │                │             │
        ▼                ▼                ▼             ▼
  Enable Edit       Password Form    Upload Picture  Display
  Mode                   │                │          Account
        │                ▼                ▼          Details
        ▼          Enter Current      Validate            │
  Update Profile    & New Password    Image Format        │
  Fields                 │                │              │
        │                ▼                ▼              │
        ▼          Validate Passwords Validate Size       │
  Validate Profile        │                │              │
  Data                    ▼                ▼              │
        │            ┌───────────┐   ┌─────────────┐      │
   ┌────▼────┐       │ Valid?    │   │ Valid?      │      │
   │ Valid?  │       └───┬───────┘   └─────┬───────┘      │
   └────┬────┘           │                 │              │
        │           ┌────┴────┐       ┌────┴────┐         │
        │           │NO │ YES │       │NO │ YES │         │
        │           ▼   ▼     │       ▼   ▼     │         │
   ┌────┴────┐  Show  Hash    │    Show  Upload │         │
   │NO │ YES │  Pass  New     │    Error to     │         │
   ▼   ▼     │  Error Pass    │    Msg   Cloud  │         │
Show  Save   │    │     │     │      │     │    │         │
Error Profile│    │     ▼     │      │     ▼    │         │
  │     │    │    │  Update   │      │   Get    │         │
  │     ▼    │    │  Password │      │   Image  │         │
  │  Success │    │  in DB    │      │   URL    │         │
  │  Message │    │     │     │      │     │    │         │
  │     │    │    │     ▼     │      │     ▼    │         │
  │     │    │    │  Success  │      │  Update  │         │
  │     │    │    │  Message  │      │  Profile │         │
  │     │    │    │     │     │      │  Picture │         │
  │     │    │    │     │     │      │  URL     │         │
  │     │    │    │     │     │      │     │    │         │
  └─────┴────┴────┴─────┴─────┴──────┴─────┴────┴─────────┘
                         │
                         ▼
               Back to Profile Page
                         │
                         ▼
                ┌─────────────────┐
                │ Continue or     │
                │ Return to Main? │
                └─────────────────┘
                      │     │
                 ┌────▼───┐ │
                 │Continue│ │Return
                 ▼        │ ▼
          Profile Page    │ Main Dashboard
                 │        │     │
                 └────────┘     ▼
                         │   [END]
                         ▼
                      [END]

PROFILE OPERATIONS:
• EDIT: Form update → Validation → Database save
• PASSWORD: Current verification → New password → Hash → Save
• PICTURE: Upload → Validate → Cloudinary → URL update
• VIEW: Display current profile information
```

### **8. ERROR HANDLING ACTIVITY**

```
                     ERROR HANDLING FLOW
                     ===================

    [ERROR OCCURS] ──► Identify Error Type
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Error Categories:   │
                    │ • Validation Error  │
                    │ • Authentication    │
                    │ • Database Error    │
                    │ • Network Error     │
                    │ • File Upload Error │
                    │ • Server Error      │
                    └─────────────────────┘
                              │
     ┌─────────┬──────────────┼──────────────┬─────────┬──────────┐
     │         │              │              │         │          │
     ▼         ▼              ▼              ▼         ▼          ▼
[VALIDATION] [AUTH]      [DATABASE]      [NETWORK]  [FILE]   [SERVER]
     │         │              │              │         │          │
     ▼         ▼              ▼              ▼         ▼          ▼
Show Form   Clear User     Log Error     Check      Show File  Log Server
Validation  Session       Details       Connection  Error      Error
Errors         │              │              │      Message       │
     │         ▼              ▼              ▼         │          ▼
     │    Redirect to     Show Generic   Show Network │     Show Server
     │    Login Page      Error Msg     Error Msg     │     Error Msg
     │         │              │              │         │          │
     ▼         │              ▼              ▼         ▼          ▼
Allow User     │        Retry Available? Retry Option Allow     Contact
to Retry       │              │              │      Retry      Support
     │         │         ┌────▼────┐        ▼         │       Option
     │         │         │YES │ NO │   Retry Action   │          │
     │         │         ▼    ▼    │        │         │          │
     │         │      Allow  End   │        │         │          │
     │         │      Retry  Flow  │        │         │          │
     │         │         │    │    │        │         │          │
     └─────────┴─────────┴────┴────┴────────┴─────────┴──────────┘
                              │
                              ▼
                     Log Error Details
                              │
                              ▼
                     Update Error Metrics
                              │
                              ▼
                        [END/RETRY]

ERROR HANDLING STRATEGIES:
• VALIDATION: Client-side and server-side validation
• AUTHENTICATION: Session management and redirect
• DATABASE: Transaction rollback and retry logic
• NETWORK: Connection retry and timeout handling
• FILE: Format and size validation
• SERVER: Graceful degradation and support contact
```

### **9. SYSTEM BACKUP ACTIVITY**

```
                      SYSTEM BACKUP FLOW
                      ==================

    [SCHEDULED TIME] ──► Check Backup Schedule
                                │
                                ▼
                      ┌─────────────────────┐
                      │ Backup Type:        │
                      │ • Full Backup       │
                      │ • Incremental       │
                      │ • Differential      │
                      └─────────────────────┘
                                │
               ┌────────────────┼────────────────┐
               │                │                │
               ▼                ▼                ▼
        [FULL BACKUP]   [INCREMENTAL]    [DIFFERENTIAL]
               │                │                │
               ▼                ▼                ▼
        Backup Entire    Backup Changes   Backup Changes
        Database         Since Last       Since Last Full
               │         Backup               │
               │                │                │
               └────────────────┼────────────────┘
                                │
                                ▼
                      Compress Backup Data
                                │
                                ▼
                      Encrypt Backup File
                                │
                                ▼
                      Upload to Cloud Storage
                                │
                                ▼
                      Verify Backup Integrity
                                │
                           ┌────▼────┐
                           │ Valid?  │
                           └────┬────┘
                                │
                         ┌──────┴──────┐
                         │ NO    │ YES │
                         ▼       ▼     │
                    Retry        Update │
                    Backup       Backup │
                         │       Log    │
                         │         │    │
                         └─────────┘    │
                                │       │
                                └───────┘
                                │
                                ▼
                        Clean Old Backups
                                │
                                ▼
                        Send Backup Report
                                │
                                ▼
                      ┌─────────────────────┐
                      │ Recovery Needed?    │
                      └─────────────────────┘
                                │
                         ┌──────┴──────┐
                         │ NO    │ YES │
                         ▼       ▼     │
                      [END]  Recovery  │
                               Flow    │
                                │      │
                                ▼      │
                        Select Backup  │
                        Point          │
                                │      │
                                ▼      │
                        Download       │
                        Backup         │
                                │      │
                                ▼      │
                        Decrypt &      │
                        Decompress     │
                                │      │
                                ▼      │
                        Restore        │
                        Database       │
                                │      │
                                ▼      │
                        Verify Data    │
                        Integrity      │
                                │      │
                                ▼      │
                        Notify Users   │
                        of Recovery    │
                                │      │
                                └──────┘
                                │
                                ▼
                             [END]

BACKUP OPERATIONS:
• FULL: Complete database backup
• INCREMENTAL: Changes since last backup
• DIFFERENTIAL: Changes since last full backup
• ENCRYPTION: AES-256 encryption for security
• STORAGE: Cloud storage with redundancy
• RECOVERY: Point-in-time recovery capability
```

### **ACTIVITY SUMMARY TABLE**

```
┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐
│      ACTIVITY       │    TRIGGER EVENT    │   KEY DECISIONS     │    END RESULT       │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ User Registration   │ User clicks signup  │ Input validation,   │ Account created,    │
│                     │                     │ Email uniqueness   │ Email verification  │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ User Login         │ User enters creds   │ Authentication,     │ Session established │
│                     │                     │ Account enabled     │ or error shown      │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ OAuth Login        │ User clicks OAuth   │ Provider choice,    │ Account linked,     │
│                     │ button              │ Account linking     │ Session created     │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Contact Management │ User navigates to   │ CRUD operations,    │ Contacts managed,   │
│                     │ contacts            │ Validation checks   │ Data synchronized   │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Excel Operations   │ User uploads/       │ File validation,    │ Data imported/      │
│                     │ downloads file      │ Format checking     │ exported            │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Notes Management   │ User creates/edits  │ Content validation, │ Notes saved/        │
│                     │ notes               │ Category assignment │ organized           │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Profile Management │ User updates        │ Data validation,    │ Profile updated,    │
│                     │ profile             │ Image processing    │ Changes saved       │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Error Handling     │ System error        │ Error type,         │ Error resolved,     │
│                     │ occurs              │ Recovery options    │ User informed       │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ System Backup      │ Scheduled time      │ Backup type,        │ Data backed up,     │
│                     │                     │ Verification        │ Recovery ready      │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
```

### **ACTIVITY FLOW PATTERNS**

```
┌─────────────────────────────────────────────────────────────────────┐
│ COMMON ACTIVITY PATTERNS                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ 1. INPUT-VALIDATION-PROCESS Pattern:                               │
│    User Input → Validate → Process → Store → Feedback              │
│                                                                     │
│ 2. AUTHENTICATION-REQUIRED Pattern:                                │
│    Check Auth → Allow/Deny → Process → Response                    │
│                                                                     │
│ 3. CRUD-OPERATION Pattern:                                         │
│    Select Operation → Validate → Execute → Update UI               │
│                                                                     │
│ 4. ERROR-HANDLING Pattern:                                         │
│    Error Occurs → Identify → Handle → Log → User Feedback          │
│                                                                     │
│ 5. FILE-PROCESSING Pattern:                                        │
│    Upload → Validate → Parse → Process → Store → Feedback          │
│                                                                     │
│ 6. SEARCH-FILTER Pattern:                                          │
│    Input Criteria → Execute Query → Apply Filters → Display        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

These text-based diagrams provide a comprehensive view of all system activities and data flows in a format that's easy to read and understand without requiring specialized diagram rendering tools.
