# Smart Contact Manager - Notes & Excel Import Documentation

## Overview
This documentation covers the implementation of two major features:
1. **Notes System** - Complete note-taking functionality with CRUD operations
2. **Excel Bulk Import/Export** - Mass contact management through Excel files

---

## 📝 NOTES SYSTEM IMPLEMENTATION

### 1. Backend Implementation

#### 1.1 Database Entity
**File:** `src/main/java/com/scm/entities/Note.java`

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    private String id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 5, max = 5000, message = "Content must be between 5 and 5000 characters")
    private String content;
    
    private String category;
    private boolean favorite = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JsonIgnore
    private User user;
}
```

**Key Features:**
- UUID-based primary key
- Validation annotations for data integrity
- Automatic timestamp management
- User relationship for ownership
- Category and favorite functionality

#### 1.2 Repository Layer
**File:** `src/main/java/com/scm/repsitories/NoteRepo.java`

```java
@Repository
public interface NoteRepo extends JpaRepository<Note, String> {
    // Pagination support for user notes
    Page<Note> findByUser(User user, Pageable pageable);
    
    // Search functionality
    @Query("SELECT n FROM Note n WHERE n.user = :user AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Note> searchByUserAndKeyword(@Param("user") User user, 
                                     @Param("keyword") String keyword, 
                                     Pageable pageable);
    
    // Favorite notes filter
    Page<Note> findByUserAndFavoriteTrue(User user, Pageable pageable);
}
```

**Features:**
- Custom search queries with case-insensitive matching
- Pagination support for large datasets
- Favorite filtering capability

#### 1.3 Service Layer
**File:** `src/main/java/com/scm/services/NoteService.java`

```java
public interface NoteService {
    Note saveNote(Note note);
    Page<Note> getNotesByUser(User user, int page, int size, String sortBy, String sortDir);
    Page<Note> searchNotes(User user, String keyword, int page, int size, String sortBy, String sortDir);
    Page<Note> getFavoriteNotesByUser(User user, int page, int size, String sortBy, String sortDir);
    Note getNoteById(String noteId);
    Note updateNote(Note note);
    void deleteNote(String noteId);
    Note toggleFavorite(String noteId);
}
```

**File:** `src/main/java/com/scm/services/impl/NoteServiceImpl.java`

```java
@Service
public class NoteServiceImpl implements NoteService {
    @Autowired
    private NoteRepo noteRepo;
    
    private static final Logger logger = LoggerFactory.getLogger(NoteServiceImpl.class);
    
    @Override
    public Note saveNote(Note note) {
        note.setId(UUID.randomUUID().toString());
        logger.info("📝 Saving note: {}", note.getTitle());
        return noteRepo.save(note);
    }
    
    @Override
    public Page<Note> getNotesByUser(User user, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        logger.info("📋 Fetching notes for user: {} (page: {}, size: {})", 
                   user.getEmail(), page, size);
        return noteRepo.findByUser(user, pageable);
    }
    
    // ... other methods with comprehensive logging
}
```

#### 1.4 REST API Controllers

**File:** `src/main/java/com/scm/controllers/api/NotesApiController.java`

```java
@RestController
@RequestMapping("/api/notes")
public class NotesApiController {
    
    @GetMapping
    public ResponseEntity<Page<Note>> getUserNotes(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "updatedAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction,
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "favorites", defaultValue = "false") boolean favorites,
            Authentication authentication) {
        // Implementation with security checks
    }
    
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note noteData, Authentication authentication);
    
    @PutMapping("/{noteId}")
    public ResponseEntity<Note> updateNote(@PathVariable String noteId, @RequestBody Note noteData);
    
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@PathVariable String noteId);
    
    @PutMapping("/{noteId}/favorite")
    public ResponseEntity<Note> toggleFavorite(@PathVariable String noteId);
}
```

### 2. Frontend Implementation

#### 2.1 Notes List Page
**File:** `src/pages/user/NotesPage.jsx`

```jsx
const NotesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  
  const fetchNotes = async () => {
    try {
      const params = {
        page: currentPage,
        size: 10,
        sortBy: 'updatedAt',
        direction: 'desc',
        keyword: searchKeyword,
        favorites: showFavorites
      };
      
      const response = await axiosInstance.get('/user/notes', { params });
      setNotes(response.data.content || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };
  
  // Search, pagination, and CRUD operations
};
```

#### 2.2 Add/Edit Note Page
**File:** `src/pages/user/AddEditNotePage.jsx`

```jsx
const AddEditNotePage = () => {
  const { noteId } = useParams();
  const isEdit = Boolean(noteId);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    favorite: false
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        await axiosInstance.post(`/user/notes/edit/${noteId}`, formData);
      } else {
        await axiosInstance.post('/user/notes/add', formData);
      }
      
      toast.success('Note saved successfully! 📝✨');
      navigate('/user/notes');
    } catch (error) {
      toast.error('Error saving note');
    }
  };
};
```

---

## 📊 EXCEL BULK IMPORT/EXPORT IMPLEMENTATION

### 1. Dependencies Added

#### 1.1 Backend Dependencies (Maven)
**File:** `pom.xml`

```xml
<!-- Apache POI for Excel processing -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>5.2.4</version>
</dependency>

<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.4</version>
</dependency>
```

#### 1.2 Frontend Dependencies (npm)
```bash
npm install react-toastify
```

**Purpose:** Toast notifications for user feedback during import/export operations.

### 2. Backend Implementation

#### 2.1 Excel Service Interface
**File:** `src/main/java/com/scm/services/ExcelService.java`

```java
public interface ExcelService {
    List<Contact> importContactsFromExcel(MultipartFile file, User user) throws Exception;
    boolean validateExcelFile(MultipartFile file);
    InputStream getTemplateFile() throws Exception;
    byte[] exportContactsToExcel(List<Contact> contacts) throws Exception;
}
```

#### 2.2 Excel Service Implementation
**File:** `src/main/java/com/scm/services/impl/ExcelServiceImpl.java`

```java
@Service
public class ExcelServiceImpl implements ExcelService {
    
    @Autowired
    private ContactRepo contactRepo;
    
    // Excel column indices
    private static final int NAME_COLUMN = 0;
    private static final int EMAIL_COLUMN = 1;
    private static final int PHONE_COLUMN = 2;
    private static final int ADDRESS_COLUMN = 3;
    
    @Override
    public List<Contact> importContactsFromExcel(MultipartFile file, User user) throws Exception {
        logger.info("📁 Starting Excel import for user: {}", user.getEmail());
        
        List<Contact> importedContacts = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip header row (row 0)
            for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;
                
                try {
                    Contact contact = createContactFromRow(row, user, rowIndex);
                    if (contact != null) {
                        // Check for duplicate email
                        if (contactRepo.findByEmailAndUser(contact.getEmail(), user).isPresent()) {
                            errors.add("Row " + (rowIndex + 1) + ": Email " + contact.getEmail() + " already exists");
                            continue;
                        }
                        
                        Contact savedContact = contactRepo.save(contact);
                        importedContacts.add(savedContact);
                    }
                } catch (Exception e) {
                    errors.add("Row " + (rowIndex + 1) + ": " + e.getMessage());
                }
            }
        }
        
        logger.info("📊 Excel import completed. Success: {}, Errors: {}", 
                   importedContacts.size(), errors.size());
        
        return importedContacts;
    }
    
    private Contact createContactFromRow(Row row, User user, int rowIndex) {
        // Validate required fields
        String name = getCellValueAsString(row.getCell(NAME_COLUMN));
        String email = getCellValueAsString(row.getCell(EMAIL_COLUMN));
        String phone = getCellValueAsString(row.getCell(PHONE_COLUMN));
        String address = getCellValueAsString(row.getCell(ADDRESS_COLUMN));
        
        // Validation logic
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        
        // Email validation
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format: " + email);
        }
        
        // Phone validation (10 digits)
        String cleanPhone = phone.replaceAll("[^0-9]", "");
        if (cleanPhone.length() != 10) {
            throw new IllegalArgumentException("Phone number must be 10 digits: " + phone);
        }
        
        // Create and populate contact
        Contact contact = new Contact();
        contact.setId(UUID.randomUUID().toString());
        contact.setName(name.trim());
        contact.setEmail(email.trim().toLowerCase());
        contact.setPhoneNumber(cleanPhone);
        contact.setAddress(address.trim());
        contact.setUser(user);
        
        // Set default picture
        contact.setPicture("https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png");
        contact.setCloudinaryImagePublicId("default");
        
        return contact;
    }
}
```

**Key Features:**
- Row-by-row processing with error collection
- Data validation for each field
- Duplicate email detection
- Comprehensive logging for debugging
- Default values for optional fields

#### 2.3 Template Generation
```java
@Override
public InputStream getTemplateFile() throws Exception {
    try (Workbook workbook = new XSSFWorkbook()) {
        Sheet sheet = workbook.createSheet("Contacts");
        
        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "Name*", "Email*", "Phone*", "Address*", "Description", 
            "Website Link", "LinkedIn Link", "Favorite (true/false)"
        };
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }
        
        // Add sample data row
        Row sampleRow = sheet.createRow(1);
        sampleRow.createCell(0).setCellValue("John Doe");
        sampleRow.createCell(1).setCellValue("john.doe@example.com");
        sampleRow.createCell(2).setCellValue("9876543210");
        sampleRow.createCell(3).setCellValue("123 Main St, City, State");
        
        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        return new ByteArrayInputStream(outputStream.toByteArray());
    }
}
```

#### 2.4 REST API Controller
**File:** `src/main/java/com/scm/controllers/api/ExcelApiController.java`

```java
@RestController
@RequestMapping("/api/excel")
public class ExcelApiController {
    
    @GetMapping("/template")
    public ResponseEntity<InputStreamResource> downloadTemplate();
    
    @PostMapping("/import")
    public ResponseEntity<ImportResult> importContacts(@RequestParam("file") MultipartFile file);
    
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportContacts(@RequestParam(value = "favorites", defaultValue = "false") boolean favoritesOnly);
    
    @GetMapping("/stats")
    public ResponseEntity<ContactStats> getContactStats();
}
```

### 3. Frontend Implementation

#### 3.1 Excel Management Page
**File:** `src/pages/user/ExcelPage.jsx`

```jsx
const ExcelPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [totalContacts, setTotalContacts] = useState(0);
  
  // File validation
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert to MB
      const fileName = file.name.toLowerCase();
      
      if (fileSize > 5) {
        toast.error('File size must be less than 5MB');
        event.target.value = '';
        return;
      }
      
      if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        toast.error('Please select a valid Excel file (.xlsx or .xls)');
        event.target.value = '';
        return;
      }
      
      setSelectedFile(file);
    }
  };
  
  // Import functionality
  const handleImport = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an Excel file to import');
      return;
    }

    setImporting(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axiosInstance.post('/api/excel/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(response.data.message + ' 🎉');
        setSelectedFile(null);
        document.getElementById('excelFile').value = '';
        fetchContactStats(); // Refresh stats
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      toast.error('Error importing contacts. Please check your file format.');
    } finally {
      setImporting(false);
    }
  };
};
```

### 4. Database Schema Changes

#### 4.1 Contact Entity Updates
**File:** `src/main/java/com/scm/entities/Contact.java`

```java
@Entity
public class Contact {
    @Id
    private String id;
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String picture; // Made optional
    @Column(length = 1000)
    private String description;
    private boolean favorite = false;
    private String websiteLink;
    private String linkedInLink;
    private String cloudinaryImagePublicId;
    
    @ManyToOne
    @JsonIgnore
    private User user;
}
```

#### 4.2 Repository Enhancement
**File:** `src/main/java/com/scm/repsitories/ContactRepo.java`

```java
@Repository
public interface ContactRepo extends JpaRepository<Contact, String> {
    Page<Contact> findByUser(User user, Pageable pageable);
    
    // Added for duplicate detection during import
    Optional<Contact> findByEmailAndUser(String email, User user);
    
    // Existing methods...
}
```

### 5. Routing Configuration

#### 5.1 React Router Setup
**File:** `src/App.jsx`

```jsx
// Protected Routes
<Route element={<PrivateRoute />}>
  <Route path="/user/notes" element={<NotesPage />} />
  <Route path="/user/notes/add" element={<AddEditNotePage />} />
  <Route path="/user/notes/edit/:noteId" element={<AddEditNotePage />} />
  <Route path="/user/excel" element={<ExcelPage />} />
</Route>
```

#### 5.2 Navigation Updates
**File:** `src/components/user/UserSidebar.jsx`

```jsx
// Added Notes navigation
<Link to="/user/notes" className="flex items-center p-2...">
  <i className="fa-solid fa-sticky-note"></i>
  <span className="ms-3">My Notes</span>
</Link>

// Added Excel import/export navigation
<Link to="/user/excel" className="flex items-center p-2...">
  <i className="fa-solid fa-file-excel text-green-600"></i>
  <span className="ms-3">Import/Export</span>
</Link>
```

---

## 🔧 CONFIGURATION & SETUP

### 1. Application Properties
**File:** `src/main/resources/application.properties`

```properties
# File upload configuration for Excel imports
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

# Database configuration (existing)
spring.datasource.url=jdbc:mysql://localhost:3306/scm2
spring.datasource.username=root
spring.datasource.password=admin
spring.jpa.hibernate.ddl-auto=update
```

### 2. Security Configuration
Excel and Notes endpoints are protected by JWT authentication configured in existing security setup.

### 3. Error Handling
- **Frontend**: 401 errors redirect to login page
- **Backend**: Comprehensive logging with emoji indicators
- **Validation**: Client and server-side validation
- **File Handling**: Size and format validation

---

## 📋 USAGE INSTRUCTIONS

### Notes System
1. **Creating Notes**: Navigate to "My Notes" → "Add Note"
2. **Managing Notes**: Search, filter by favorites, sort by date/title
3. **Categories**: Organize notes with custom categories
4. **Favorites**: Mark important notes with star icon

### Excel Import/Export
1. **Template Download**: Get properly formatted Excel template
2. **Import Process**:
   - Fill template with contact data
   - Upload file (max 5MB)
   - System validates and imports with error reporting
3. **Export Options**:
   - Export all contacts
   - Export only favorite contacts
   - Downloads Excel file with all contact details

### Data Validation Rules
- **Names**: 3-200 characters
- **Emails**: Valid email format, unique per user
- **Phone**: Exactly 10 digits
- **Address**: Required field
- **File Size**: Maximum 5MB for Excel files

---

## 🔍 TESTING & DEBUGGING

### Logging Features
- **JWT**: Comprehensive authentication flow logging
- **Notes**: Creation, update, delete operations tracked
- **Excel**: Import/export progress with success/error counts
- **Emoji Indicators**: 📝✅❌🔍 for easy log scanning

### Error Handling
- **Duplicate Detection**: Prevents duplicate contact imports
- **Validation Errors**: Clear user feedback for invalid data
- **Authentication**: Automatic redirect on session expiry
- **File Validation**: Size and format checks before processing

This implementation provides a robust, user-friendly system for both note-taking and bulk contact management with comprehensive error handling and logging throughout.
