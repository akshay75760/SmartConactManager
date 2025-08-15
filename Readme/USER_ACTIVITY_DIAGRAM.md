# Smart Contact Manager - User Activity Diagram

## 👤 USER ACTIVITY DIAGRAM (TEXT FORMAT)

### **1. USER REGISTRATION & AUTHENTICATION FLOW**

```
                    USER REGISTRATION WORKFLOW
                    ==========================

    [START] ──► Visit Registration Page
                         │
                         ▼
               ┌─────────────────────┐
               │ Fill Registration   │
               │ Form:               │
               │ • Full Name         │
               │ • Email Address     │
               │ • Password          │
               │ • Phone Number      │
               │ • About (Optional)  │
               └─────────────────────┘
                         │
                         ▼
               ┌─────────────────────┐
               │ Client-Side         │
               │ Validation          │
               └─────────────────────┘
                         │
                    ┌────▼────┐
                    │ Valid?  │
                    └────┬────┘
                         │
               ┌─────────┴──────────┐
               │ NO                 │ YES
               ▼                    ▼
    Show Validation Errors    Submit to Server
               │                    │
               │                    ▼
               │              Server Validation
               │                    │
               │               ┌────▼────┐
               │               │ Valid?  │
               │               └────┬────┘
               │                    │
               │            ┌───────┴────────┐
               │            │ NO             │ YES
               │            ▼                ▼
               │     Show Server Error   Hash Password
               │            │                │
               │            │                ▼
               │            │         Save User to DB
               │            │                │
               │            │                ▼
               │            │         Generate Verification
               │            │         Token
               │            │                │
               │            │                ▼
               │            │         Send Verification Email
               │            │                │
               │            │                ▼
               │            │         Show Success Message
               │            │                │
               └────────────┴────────────────┘
                                     │
                                     ▼
                            Redirect to Login
                                     │
                                     ▼
                                  [END]

VALIDATION RULES:
• Name: Required, 2-50 characters
• Email: Valid format, unique in system
• Password: 8+ chars, uppercase, lowercase, number, special char
• Phone: Valid format, 10-15 digits
```

### **2. USER LOGIN FLOW**

```
                        USER LOGIN WORKFLOW
                        ===================

    [START] ──► Visit Login Page
                         │
                         ▼
               ┌─────────────────────┐
               │ Choose Login Method:│
               │ • Email/Password    │
               │ • Google OAuth      │
               │ • GitHub OAuth      │
               └─────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
 [EMAIL LOGIN]    [GOOGLE OAUTH]    [GITHUB OAUTH]
        │                │                │
        ▼                ▼                ▼
 Enter Email       Redirect to      Redirect to
 & Password        Google           GitHub
        │                │                │
        ▼                ▼                ▼
 Validate Form     Google Auth      GitHub Auth
        │                │                │
   ┌────▼────┐          ▼                ▼
   │ Valid?  │     Callback with    Callback with
   └────┬────┘     Auth Code        Auth Code
        │                │                │
 ┌──────┴──────┐        ▼                ▼
 │ NO    │ YES │   Exchange for     Exchange for
 ▼       ▼     │   Access Token     Access Token
Show     Submit│         │                │
Error    to    │         ▼                ▼
 │      Server │    Get User         Get User
 │         │   │    Profile          Profile
 │         ▼   │         │                │
 │    Authenticate      ▼                ▼
 │         │   │    Check User       Check User
 │         │   │    Exists           Exists
 │    ┌────▼───┤         │                │
 │    │Success?│    ┌────▼────┐      ┌────▼────┐
 │    └────┬───┘    │ Exists? │      │ Exists? │
 │         │        └────┬────┘      └────┬────┘
 │    ┌────┴────┐        │                │
 │    │NO │ YES │   ┌────┴────┐      ┌────┴────┐
 │    ▼   ▼     │   │NO │ YES │      │NO │ YES │
 │ Show Generate │   ▼   ▼     │      ▼   ▼     │
 │ Error JWT     │Create Link  │   Create Link  │
 │  │    │       │User  Account│   User  Account│
 │  │    ▼       │ │     │     │    │     │     │
 │  │ Set Session│ ▼     │     │    ▼     │     │
 │  │    │       │Save   │     │   Save   │     │
 │  │    ▼       │to DB  │     │   to DB  │     │
 │  │ Redirect   │ │     │     │    │     │     │
 │  │ to         │ └─────┴─────┴────┴─────┘     │
 │  │ Dashboard  │              │               │
 │  │    │       │              ▼               │
 │  │    │       │        Generate JWT          │
 │  │    │       │              │               │
 │  │    │       │              ▼               │
 │  │    │       │        Set User Session      │
 │  │    │       │              │               │
 └──┴────┴───────┴──────────────┘               │
           │                                    │
           └────────────────────────────────────┘
                         │
                         ▼
               Redirect to Dashboard
                         │
                         ▼
                      [END]

LOGIN OPTIONS:
• EMAIL: Traditional email/password authentication
• GOOGLE: OAuth2 with Google identity provider
• GITHUB: OAuth2 with GitHub identity provider
• SESSION: JWT token-based session management
```

### **3. USER DASHBOARD ACTIVITY**

```
                    USER DASHBOARD WORKFLOW
                    =======================

    [LOGIN SUCCESS] ──► Load Dashboard
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Initialize Dashboard│
                    │ • Load User Info    │
                    │ • Load Statistics   │
                    │ • Load Recent Items │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Display Dashboard   │
                    │ Sections:           │
                    │ • Welcome Message   │
                    │ • Quick Stats       │
                    │ • Recent Contacts   │
                    │ • Recent Notes      │
                    │ • Quick Actions     │
                    │ • Profile Summary   │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ User Chooses Action:│
                    │ • Manage Contacts   │
                    │ • Manage Notes      │
                    │ • Update Profile    │
                    │ • Excel Operations  │
                    │ • View Messages     │
                    │ • Account Settings  │
                    │ • Logout            │
                    └─────────────────────┘
                              │
        ┌─────────┬───────────┼───────────┬─────────┬─────────┬─────────┐
        │         │           │           │         │         │         │
        ▼         ▼           ▼           ▼         ▼         ▼         ▼
   [CONTACTS] [NOTES]    [PROFILE]   [EXCEL]   [MESSAGES] [SETTINGS] [LOGOUT]
        │         │           │           │         │         │         │
        ▼         ▼           ▼           ▼         ▼         ▼         ▼
Navigate to Navigate to Navigate to Navigate to Navigate to Navigate to Clear Session
Contacts   Notes       Profile     Excel      Messages   Settings    & Redirect
Page       Page        Page        Page       Page       Page        to Home
        │         │           │           │         │         │         │
        ▼         ▼           ▼           ▼         ▼         ▼         ▼
   [Contact   [Note      [Profile   [Excel     [Message   [Settings  [Home Page]
    Management Management  Management Operations Management Management    │
    Flow]      Flow]       Flow]      Flow]     Flow]      Flow]         ▼
        │         │           │           │         │         │      [END]
        │         │           │           │         │         │
        └─────────┴───────────┴───────────┴─────────┴─────────┘
                              │
                              ▼
                    Return to Dashboard
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Continue Using or   │
                    │ Choose New Action?  │
                    └─────────────────────┘
                         │         │
                    ┌────▼────┐    │
                    │Continue │    │Logout
                    ▼         │    ▼
            Dashboard Loop    │ [LOGOUT FLOW]
                    │         │    │
                    └─────────┘    ▼
                         │      [END]
                         ▼
                      [LOOP]

DASHBOARD FEATURES:
• STATISTICS: Total contacts, notes, recent activity
• QUICK ACCESS: Recent contacts and notes
• NAVIGATION: Easy access to all major features
• PROFILE: Current user information display
• NOTIFICATIONS: System messages and alerts
```

### **4. CONTACT MANAGEMENT WORKFLOW**

```
                    CONTACT MANAGEMENT WORKFLOW
                    ===========================

    [CONTACTS PAGE] ──► Display Contact Options
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Contact Actions:    │
                    │ • View All Contacts │
                    │ • Add New Contact   │
                    │ • Search Contacts   │
                    │ • Filter Contacts   │
                    │ • Export Contacts   │
                    │ • Import Contacts   │
                    └─────────────────────┘
                              │
       ┌──────────┬───────────┼───────────┬───────────┬───────────┐
       │          │           │           │           │           │
       ▼          ▼           ▼           ▼           ▼           ▼
   [VIEW ALL] [ADD NEW]   [SEARCH]    [FILTER]    [EXPORT]   [IMPORT]
       │          │           │           │           │           │
       ▼          ▼           ▼           ▼           ▼           ▼
Load Contact  Show Add    Show Search Show Filter  Generate   Show Import
List with     Form        Form        Options      Excel File  Form
Pagination       │           │           │           │           │
       │          ▼           ▼           ▼           ▼           ▼
       ▼     Fill Contact  Enter Search Select      Download   Upload Excel
Display       Details      Criteria    Category     File       File
Contacts         │           │           │           │           │
       │          ▼           ▼           ▼           ▼           ▼
       ▼     Validate      Execute     Apply        [END]     Validate File
Select        Data         Search      Filter                      │
Contact          │           │           │                        ▼
Action           │           ▼           ▼                   Parse Excel
       │          │     Display       Display                     │
       ▼          │     Results       Filtered                    ▼
┌─────────────────┐│           │       Results              Validate Data
│ Contact Actions ││           │           │                        │
│ • View Details  ││           │           │                   ┌────▼────┐
│ • Edit Contact  ││           │           │                   │ Valid?  │
│ • Delete Contact││           │           │                   └────┬────┘
│ • Send Message  ││           │           │                        │
│ • Call Contact  ││           │           │                 ┌──────┴──────┐
│ • Email Contact ││           │           │                 │ NO    │ YES │
└─────────────────┘│           │           │                 ▼       ▼     │
       │            │           │           │            Show     Import   │
       ▼            │           │           │            Errors   to DB    │
[ACTION FLOW]       │           │           │                 │       │     │
       │            │           │           │                 │       ▼     │
       ▼            │           │           │                 │    Success  │
┌─────────────────┐ │           │           │                 │    Message  │
│ Specific Action │ │           │           │                 │       │     │
│ Processing:     │ │           │           │                 │       │     │
│ • View: Modal   │ │           │           │                 │       │     │
│ • Edit: Form    │ │           │           │                 └───────┴─────┘
│ • Delete: Confirm│ │          │           │                          │
│ • Message: Compose│ │         │           │                          │
│ • Call: Phone   │ │           │           │                          │
│ • Email: Client │ │           │           │                          │
└─────────────────┘ │           │           │                          │
       │            │           │           │                          │
       ▼            │           │           │                          │
Process Action      │           │           │                          │
       │            │           │           │                          │
       ▼            │           │           │                          │
Show Result         │           │           │                          │
       │            │           │           │                          │
       └────────────┴───────────┴───────────┴──────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Continue or Return  │
                    │ to Dashboard?       │
                    └─────────────────────┘
                         │         │
                    ┌────▼────┐    │
                    │Continue │    │Return
                    ▼         │    ▼
            Contacts Page     │ Dashboard
                    │         │    │
                    └─────────┘    ▼
                         │      [END]
                         ▼
                      [LOOP]

ADD CONTACT FLOW:
1. Fill Form: Name, Email, Phone, Address, Description
2. Upload Image: Optional profile picture
3. Validate: Client and server-side validation
4. Save: Store in database with user association
5. Confirm: Success message and redirect

EDIT CONTACT FLOW:
1. Load: Existing contact data
2. Modify: Update form fields
3. Validate: Ensure data integrity
4. Save: Update database record
5. Confirm: Success feedback

DELETE CONTACT FLOW:
1. Confirm: User confirmation dialog
2. Validate: Check user permissions
3. Delete: Remove from database
4. Cleanup: Remove associated files
5. Redirect: Return to contact list
```

### **5. NOTES MANAGEMENT WORKFLOW**

```
                    NOTES MANAGEMENT WORKFLOW
                    =========================

    [NOTES PAGE] ──► Display Notes Dashboard
                           │
                           ▼
                 ┌─────────────────────┐
                 │ Notes Actions:      │
                 │ • View All Notes    │
                 │ • Create New Note   │
                 │ • Search Notes      │
                 │ • Filter by Category│
                 │ • View Favorites    │
                 │ • Manage Categories │
                 └─────────────────────┘
                           │
     ┌─────────┬───────────┼───────────┬───────────┬───────────┐
     │         │           │           │           │           │
     ▼         ▼           ▼           ▼           ▼           ▼
 [VIEW ALL] [CREATE]   [SEARCH]    [FILTER]   [FAVORITES] [CATEGORIES]
     │         │           │           │           │           │
     ▼         ▼           ▼           ▼           ▼           ▼
Load Notes  Show Note   Show Search Show Category Load Favorite Manage Note
Grid with   Creation    Form        Filter       Notes        Categories
Pagination  Form           │           │           │           │
     │         │           ▼           ▼           ▼           ▼
     ▼         ▼      Enter Search  Select       Display     Add/Edit/Delete
Display     Fill Note  Keywords     Category     Favorites   Categories
Notes       Details       │           │           │           │
     │         │           ▼           ▼           ▼           ▼
     ▼         ▼      Execute       Apply        Select      Save Category
Select Note  Validate   Search      Filter       Note        Changes
Action       Note Data     │           │        Action          │
     │         │           ▼           ▼           │           ▼
     ▼         │      Display       Display       ▼        [RETURN]
┌──────────────┐│     Results       Filtered    [NOTE
│ Note Actions ││        │         Results     ACTION
│ • View Note  ││        │           │         FLOW]
│ • Edit Note  ││        │           │           │
│ • Delete Note││        │           │           ▼
│ • Toggle Fav ││        │           │      ┌──────────────┐
│ • Share Note ││        │           │      │ Note Actions │
│ • Copy Note  ││        │           │      │ Processing:  │
│ • Export Note││        │           │      │ • View: Modal│
└──────────────┘│        │           │      │ • Edit: Form │
     │           │        │           │      │ • Delete: DB │
     ▼           │        │           │      │ • Fav: Toggle│
[ACTION FLOW]    │        │           │      │ • Share: Link│
     │           │        │           │      │ • Copy: Dup  │
     ▼           │        │           │      │ • Export: PDF│
┌──────────────┐ │        │           │      └──────────────┘
│ Process Note │ │        │           │           │
│ Action:      │ │        │           │           ▼
│              │ │        │           │      Process Action
│ VIEW:        │ │        │           │           │
│ • Load note  │ │        │           │           ▼
│ • Show modal │ │        │           │      Show Result
│              │ │        │           │           │
│ EDIT:        │ │        │           │           │
│ • Load form  │ │        │           │           │
│ • Save changes│ │       │           │           │
│              │ │        │           │           │
│ DELETE:      │ │        │           │           │
│ • Confirm    │ │        │           │           │
│ • Remove DB  │ │        │           │           │
│              │ │        │           │           │
│ FAVORITE:    │ │        │           │           │
│ • Toggle flag│ │        │           │           │
│ • Update DB  │ │        │           │           │
└──────────────┘ │        │           │           │
     │           │        │           │           │
     ▼           │        │           │           │
Update UI        │        │           │           │
     │           │        │           │           │
     └───────────┴────────┴───────────┴───────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │ Continue or Return  │
                 │ to Dashboard?       │
                 └─────────────────────┘
                      │         │
                 ┌────▼────┐    │
                 │Continue │    │Return
                 ▼         │    ▼
         Notes Page        │ Dashboard
                 │         │    │
                 └─────────┘    ▼
                      │      [END]
                      ▼
                   [LOOP]

CREATE NOTE FLOW:
1. Form Input: Title, Content, Category, Tags
2. Rich Editor: WYSIWYG content editing
3. Validation: Required fields and content length
4. Save: Store in database with metadata
5. Redirect: Show success and return to notes

CATEGORY MANAGEMENT:
• Create: Add new note categories
• Edit: Modify existing categories
• Delete: Remove unused categories
• Assign: Link notes to categories
```

### **6. PROFILE MANAGEMENT WORKFLOW**

```
                    PROFILE MANAGEMENT WORKFLOW
                    ===========================

    [PROFILE PAGE] ──► Load Current Profile
                             │
                             ▼
                   ┌─────────────────────┐
                   │ Display Profile Info│
                   │ • Personal Details  │
                   │ • Contact Info      │
                   │ • Profile Picture   │
                   │ • Account Settings  │
                   │ • Security Settings │
                   └─────────────────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │ Profile Actions:    │
                   │ • Edit Basic Info   │
                   │ • Change Password   │
                   │ • Update Picture    │
                   │ • Email Settings    │
                   │ • Privacy Settings  │
                   │ • Account Security  │
                   └─────────────────────┘
                             │
      ┌──────────┬───────────┼───────────┬───────────┬───────────┐
      │          │           │           │           │           │
      ▼          ▼           ▼           ▼           ▼           ▼
  [EDIT INFO] [PASSWORD] [PICTURE]   [EMAIL]    [PRIVACY]  [SECURITY]
      │          │           │           │           │           │
      ▼          ▼           ▼           ▼           ▼           ▼
Enable Edit  Show Password Show Upload  Show Email  Show Privacy Show Security
Mode         Change Form   Form        Settings    Settings     Settings
      │          │           │           │           │           │
      ▼          ▼           ▼           ▼           ▼           ▼
Update       Enter Current  Select      Configure   Set Privacy  Configure
Profile      & New         Image       Email       Preferences  2FA/Security
Fields       Passwords        │        Preferences      │           │
      │          │           ▼           │           ▼           ▼
      ▼          ▼       Validate       ▼       Update      Setup 2FA
Validate     Validate     Image      Save Email  Privacy     Enable/Disable
Profile      Passwords    Format &   Settings    Settings    Account Lock
Data            │        Size           │           │           │
      │          │           │           │           │           │
 ┌────▼────┐ ┌────▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐
 │ Valid?  │ │ Valid?  │ │ Valid? │ │ Valid? │ │ Valid? │ │ Valid? │
 └────┬────┘ └────┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
      │           │          │          │          │          │
┌─────┴─────┐┌────┴────┐┌────┴────┐┌────┴────┐┌────┴────┐┌────┴────┐
│NO   │ YES ││NO │ YES ││NO │ YES ││NO │ YES ││NO │ YES ││NO │ YES │
▼     ▼     │▼   ▼     │▼   ▼     │▼   ▼     │▼   ▼     │▼   ▼     │
Show  Save  │Show Hash │Show Upload│Show Save │Show Save │Show Save │
Error Profile│Err New  │Err  to    │Err  Email│Err  Priv │Err  Sec  │
│     │     ││   Pass  ││    Cloud ││    Pref ││    Set  ││    Set  │
│     ▼     ││   │     ││    │     ││    │    ││    │    ││    │    │
│  Success  ││   ▼     ││    ▼     ││    ▼    ││    ▼    ││    ▼    │
│  Message  ││Update   ││  Get     ││  Update ││  Update ││  Update │
│     │     ││Password ││  Image   ││  DB     ││  DB     ││  DB     │
│     │     ││in DB    ││  URL     ││    │    ││    │    ││    │    │
│     │     ││   │     ││    │     ││    ▼    ││    ▼    ││    ▼    │
│     │     ││   ▼     ││    ▼     ││  Success││  Success││  Success│
│     │     ││Success  ││Update    ││  Msg    ││  Msg    ││  Msg    │
│     │     ││Message  ││Profile   ││    │    ││    │    ││    │    │
│     │     ││   │     ││Picture   ││    │    ││    │    ││    │    │
│     │     ││   │     ││URL in DB ││    │    ││    │    ││    │    │
│     │     ││   │     ││    │     ││    │    ││    │    ││    │    │
│     │     ││   │     ││    ▼     ││    │    ││    │    ││    │    │
│     │     ││   │     ││  Success ││    │    ││    │    ││    │    │
│     │     ││   │     ││  Message ││    │    ││    │    ││    │    │
│     │     ││   │     ││    │     ││    │    ││    │    ││    │    │
└─────┴─────┘└───┴─────┘└────┴─────┘└────┴────┘└────┴────┘└────┴────┘
      │           │          │          │          │          │
      └───────────┴──────────┴──────────┴──────────┴──────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │ Continue Editing or │
                   │ Return to Profile?  │
                   └─────────────────────┘
                        │         │
                   ┌────▼────┐    │
                   │Continue │    │Return
                   ▼         │    ▼
           Profile Actions   │ Profile View
                   │         │    │
                   └─────────┘    ▼
                        │      [END]
                        ▼
                     [LOOP]

PROFILE SECTIONS:
• BASIC INFO: Name, email, phone, about
• PASSWORD: Current verification + new password
• PICTURE: Image upload with validation
• EMAIL: Notification preferences
• PRIVACY: Data sharing and visibility settings
• SECURITY: 2FA, login alerts, session management
```

### **7. EXCEL OPERATIONS WORKFLOW**

```
                    EXCEL OPERATIONS WORKFLOW
                    =========================

    [EXCEL PAGE] ──► Display Excel Options
                           │
                           ▼
                 ┌─────────────────────┐
                 │ Excel Operations:   │
                 │ • Import Contacts   │
                 │ • Export Contacts   │
                 │ • Download Template │
                 │ • View Import Log   │
                 │ • Export History    │
                 └─────────────────────┘
                           │
     ┌─────────┬───────────┼───────────┬───────────┬───────────┐
     │         │           │           │           │           │
     ▼         ▼           ▼           ▼           ▼           ▼
 [IMPORT]   [EXPORT]   [TEMPLATE]  [IMPORT LOG] [EXPORT HIST]
     │         │           │           │           │
     ▼         ▼           ▼           ▼           ▼
Show Upload Show Export  Generate   Display     Display
Form        Options     Template   Import      Export
     │         │           │        History     History
     ▼         ▼           ▼           │           │
Select      Choose       Create       ▼           ▼
Excel       Export       Sample      Show        Show
File        Format      Excel File   Log Details History
     │         │           │           │          Details
     ▼         ▼           ▼           ▼           │
Upload      Select       Download     │           │
File        Contacts     Template     │           │
     │         │           │           │           │
     ▼         ▼           ▼           │           │
Validate    Generate     [END]        │           │
File        Excel           │         │           │
Format      Workbook        │         │           │
     │         │           │           │           │
┌────▼────┐   ▼           │           │           │
│ Valid?  │ Create        │           │           │
└────┬────┘ Workbook      │           │           │
     │         │           │           │           │
┌────┴────┐   ▼           │           │           │
│NO │ YES │ Write Data    │           │           │
▼   ▼     │ to Rows       │           │           │
Show Parse │     │         │           │           │
Error Excel│     ▼         │           │           │
│    Data  │ Format        │           │           │
│      │   │ Cells         │           │           │
│      ▼   │     │         │           │           │
│  Validate│     ▼         │           │           │
│  Each    │ Provide       │           │           │
│  Row     │ Download      │           │           │
│      │   │     │         │           │           │
│ ┌────▼───┤     ▼         │           │           │
│ │ Valid? ││  [END]       │           │           │
│ └────┬───┘│              │           │           │
│      │    │              │           │           │
│ ┌────┴────┐              │           │           │
│ │NO │ YES ││             │           │           │
│ ▼   ▼     ││             │           │           │
│Show Bulk  ││             │           │           │
│Val  Import││             │           │           │
│Err  to DB ││             │           │           │
│ │    │    ││             │           │           │
│ │    ▼    ││             │           │           │
│ │ Create  ││             │           │           │
│ │ Import  ││             │           │           │
│ │ Log     ││             │           │           │
│ │    │    ││             │           │           │
│ │    ▼    ││             │           │           │
│ │ Success ││             │           │           │
│ │ Message ││             │           │           │
│ │    │    ││             │           │           │
└─┴────┴────┘│             │           │           │
      │      │             │           │           │
      └──────┴─────────────┴───────────┴───────────┘
             │
             ▼
   ┌─────────────────────┐
   │ Continue Operations │
   │ or Return?          │
   └─────────────────────┘
        │         │
   ┌────▼────┐    │
   │Continue │    │Return
   ▼         │    ▼
Excel Page   │ Dashboard
        │    │    │
        └────┘    ▼
        │      [END]
        ▼
     [LOOP]

IMPORT PROCESS:
1. File Upload: Select Excel/CSV file
2. Validation: Format, size, headers check
3. Parsing: Extract contact data
4. Data Validation: Email, phone format checks
5. Duplicate Check: Prevent duplicate imports
6. Bulk Insert: Save valid contacts to database
7. Log Creation: Record import results
8. Report: Show success/error summary

EXPORT PROCESS:
1. Contact Selection: All or filtered contacts
2. Format Choice: Excel or CSV format
3. Data Retrieval: Fetch contact data
4. Workbook Creation: Generate Excel file
5. Cell Formatting: Apply styles and headers
6. Download: Provide file to user
7. History Log: Record export activity
```

### **8. USER LOGOUT WORKFLOW**

```
                    USER LOGOUT WORKFLOW
                    ====================

    [LOGOUT TRIGGER] ──► User Clicks Logout
                               │
                               ▼
                     ┌─────────────────────┐
                     │ Confirm Logout      │
                     │ Dialog              │
                     └─────────────────────┘
                               │
                          ┌────▼────┐
                          │Confirm? │
                          └────┬────┘
                               │
                        ┌──────┴──────┐
                        │ NO    │ YES │
                        ▼       ▼     │
                    Cancel    Clear   │
                    Logout    Session │
                        │       │     │
                        │       ▼     │
                        │  Invalidate │
                        │  JWT Token  │
                        │       │     │
                        │       ▼     │
                        │  Clear      │
                        │  Local      │
                        │  Storage    │
                        │       │     │
                        │       ▼     │
                        │  Clear      │
                        │  Cookies    │
                        │       │     │
                        │       ▼     │
                        │  Log Logout │
                        │  Activity   │
                        │       │     │
                        │       ▼     │
                        │  Redirect   │
                        │  to Home    │
                        │  Page       │
                        │       │     │
                        └───────┘     │
                               │      │
                               └──────┘
                               │
                               ▼
                        Show Logout
                        Success Message
                               │
                               ▼
                            [END]

LOGOUT SECURITY:
• Session Invalidation: Server-side token blacklisting
• Client Cleanup: Remove all stored authentication data
• Activity Logging: Record logout time and IP
• Redirect: Return to public home page
• Confirmation: Prevent accidental logout
```

### **USER ACTIVITY SUMMARY TABLE**

```
┌─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐
│      ACTIVITY       │    USER TRIGGER     │   KEY FEATURES      │    END RESULT       │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Registration        │ Click "Sign Up"     │ Form validation,    │ Account created,    │
│                     │                     │ Email verification  │ Ready to login      │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Login               │ Enter credentials   │ Multi-auth methods, │ Authenticated       │
│                     │                     │ Session management  │ User session        │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Dashboard           │ Successful login    │ Quick stats,        │ Overview of         │
│                     │                     │ Recent items        │ User activity       │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Contact Management  │ Navigate to         │ CRUD operations,    │ Contacts organized  │
│                     │ contacts            │ Search & filter     │ and accessible      │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Notes Management    │ Navigate to notes   │ Rich text editing,  │ Notes organized     │
│                     │                     │ Categories & tags   │ and searchable      │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Profile Management  │ Click profile       │ Info update,        │ Profile updated     │
│                     │                     │ Security settings   │ and secured         │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Excel Operations    │ Access Excel page   │ Import/Export,      │ Data transferred    │
│                     │                     │ Template download   │ via Excel           │
├─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤
│ Logout              │ Click logout        │ Secure cleanup,     │ Session ended       │
│                     │                     │ Activity logging    │ safely              │
└─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
```

### **USER PERMISSIONS & CAPABILITIES**

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER ROLE CAPABILITIES                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ✅ ALLOWED ACTIONS:                                                 │
│ • Manage own contacts (CRUD operations)                            │
│ • Manage own notes (CRUD operations)                               │
│ • Update own profile information                                   │
│ • Change own password                                               │
│ • Import/Export own contact data                                   │
│ • Use search and filter functions                                  │
│ • Access dashboard and statistics                                  │
│ • Manage account settings                                          │
│ • View system messages                                             │
│ • Use OAuth authentication                                         │
│                                                                     │
│ ❌ RESTRICTED ACTIONS:                                              │
│ • Access other users' data                                         │
│ • Modify system settings                                           │
│ • Access admin dashboard                                           │
│ • Manage user accounts                                             │
│ • View system logs                                                 │
│ • Modify application configuration                                 │
│ • Access database directly                                         │
│ • Manage system backups                                            │
│                                                                     │
│ 🔒 SECURITY CONSTRAINTS:                                           │
│ • All data access filtered by user ID                             │
│ • Session-based authentication required                           │
│ • Rate limiting on API requests                                   │
│ • Input validation on all forms                                   │
│ • File upload restrictions (size, type)                           │
│ • XSS and CSRF protection                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This comprehensive User Activity Diagram covers all the major workflows and interactions that a regular user can perform in the Smart Contact Manager system. Each flow includes detailed steps, decision points, and security considerations specific to user-level operations.
