# Share Companies Platform - Implementation Guide

## Project Structure Overview

```
src/
├── pages/
│   └── admin/
│       ├── api/
│       │   └── AdminApi.js (Central API endpoints)
│       ├── users/
│       │   ├── api/
│       │   │   └── UsersApi.js
│       │   ├── component/
│       │   │   ├── UserForm.jsx (Reusable Add/Edit form)
│       │   │   ├── UsersDataProvider.jsx
│       │   │   └── ... other components
│       │   ├── pages/
│       │   │   └── Users.jsx (Main page with table)
│       │   ├── store/
│       │   └── index.js
│       ├── institutions/
│       │   ├── api/
│       │   │   └── InstitutionsApi.js
│       │   ├── component/
│       │   │   ├── InstitutionForm.jsx (Reusable Add/Edit form)
│       │   │   ├── InstitutionsDataProvider.jsx
│       │   │   └── ... other components
│       │   ├── pages/
│       │   │   └── Institutions.jsx (Main page with table)
│       │   └── index.js
│       ├── roles/
│       │   ├── api/
│       │   ├── component/
│       │   ├── pages/
│       │   └── index.js
│       └── privileges/
│           ├── api/
│           ├── component/
│           ├── pages/
│           └── index.js
├── components/
│   ├── Form.jsx (Reusable form wrapper)
│   ├── Table.jsx (Reusable table component)
│   ├── TableSkeletonRow.jsx (Loading skeleton)
│   └── ... other shared components
├── context/
│   └── ModalContext.jsx (Modal management)
└── composables/
    ├── usePagination.js
    └── Pagination.jsx
```

---

## Key Features Implemented

### 1. **Reusable Form Component** (`Form.jsx`)
- Wraps form submission logic
- Supports loading states
- Customizable submit button text and variant
- Handles form validation

**Usage:**
```jsx
<Form
  onSubmit={handleSubmit}
  loading={loading}
  submitButtonText="Save"
  showSubmitButton={true}
>
  {/* Form fields */}
</Form>
```

### 2. **UserForm Component** (`UserForm.jsx`)
- **Dual-mode**: Works for both Add and Edit operations
- **Smart field handling**:
  - Email is disabled in edit mode
  - Password is optional in edit mode
  - Institution field appears conditionally based on role
- **Validation**: Checks required fields and role-specific requirements
- **Role-based UI**: Shows institution selector only for company roles
- **API Integration**: Calls `createUser()` or `updateUserById()`

**Props:**
```jsx
<UserForm
  user={null}  // null for Add, user object for Edit
  onSuccess={() => {}} // Callback after successful save
/>
```

### 3. **InstitutionForm Component** (`InstitutionForm.jsx`)
- Similar to UserForm but for institutions
- Fields: name, logo, description
- Dual-mode (Add/Edit)
- Modal integration

### 4. **Modal Integration** (`ModalContext.jsx`)
- Global modal management
- Used to open Add/Edit forms
- Prevents multiple modals
- Click outside to close

**Usage:**
```jsx
const { openModal, closeModal } = useModal();

// Open modal with form
openModal(<UserForm onSuccess={callback} />);

// Close modal
closeModal();
```

### 5. **Data Providers**
- `UsersDataProvider.jsx` - Fetches and manages user data
- `InstitutionsDataProvider.jsx` - Fetches and manages institution data
- Handles pagination, search, and error states
- Supports new API response format: `{ totalPages, totalElements, pageNumber, response: [...] }`

### 6. **Table Component** (`Table.jsx`)
- Reusable table with custom row rendering
- Supports loading states with skeleton rows
- Pagination controls
- Responsive design
- Action buttons support

---

## API Endpoints

### Users API (`UsersApi.js`)
```javascript
getAllUser(query)           // GET /users/all
getUserById(id)             // GET /users/{id}
createUser(data)            // POST /users/signup
updateUserById(id, data)    // PUT /users/{id}
removeUserById(id)          // DELETE /users/{id}
changeUserStatus(id, status) // PUT /users/{id}/status
getAllRole(query)           // GET /role/getAll
getAllInstitution(query)    // GET /institutions/all
```

### Institutions API (`InstitutionsApi.js`)
```javascript
getAllInstitution(query)         // GET /institutions/all
getInstitutionById(id)           // GET /institutions/{id}
createInstitution(data)          // POST /institutions
updateInstitutionById(id, data)  // PUT /institutions/{id}
removeInstitutionById(id)        // DELETE /institutions/{id}
changeInstitutionStatus(id, status) // PUT /institutions/{id}/status
```

---

## User Form Fields

### Input Fields
```javascript
{
  email: "string",              // Required, unique
  password: "string",           // Required for Add, optional for Edit
  title: "string",              // Optional
  firstName: "string",          // Required
  fatherName: "string",         // Optional
  grandFatherName: "string",    // Optional
  gender: "enum",               // male, female, other
  mobilePhone: "string",        // Optional
  roleUuid: "string",           // Required
  institutionId: "string"       // Required if role is company_admin or company_user
}
```

### Role-Based Logic
- **super_admin**: No institution required
- **company_admin**: Institution required
- **company_user**: Institution required

---

## Users Page Features

### Header Section
- Title: "Users Management"
- Add User button (opens modal with UserForm)

### Search & Filter
- Real-time search input
- Filters users by name, email, or role

### Table Display
- Index column
- First Name
- Email
- Role Name
- Status (green badge)
- Actions (Edit, Delete)

### Pagination
- Page navigation
- Items per page selector
- Total count display

### Actions
- **Edit**: Opens UserForm in edit mode with user data
- **Delete**: Shows confirmation dialog, then deletes user

---

## Institutions Page Features

### Header Section
- Title: "Institutions Management"
- Add Institution button (opens modal with InstitutionForm)

### Search & Filter
- Real-time search input
- Filters institutions by name or description

### Table Display
- Index column
- Institution Name
- Description (truncated)
- Actions (Edit, Delete)

### Actions
- **Edit**: Opens InstitutionForm in edit mode
- **Delete**: Shows confirmation dialog, then deletes institution

---

## Form Validation

### UserForm Validation
```javascript
- Email: Required
- Password: Required for Add, optional for Edit
- First Name: Required
- Role: Required
- Institution: Required if role is company_admin or company_user
```

### InstitutionForm Validation
```javascript
- Name: Required
```

---

## Error Handling

### API Errors
- Caught in try-catch blocks
- Display user-friendly error messages
- Log errors to console for debugging

### Form Errors
- Validation errors shown above form
- Clear on input change
- Prevent submission if validation fails

### Delete Errors
- Show confirmation dialog
- Alert user if deletion fails
- Refresh table on success

---

## State Management

### Component State
```javascript
// Users Page
const [searchTerm, setSearchTerm] = useState('');
const [refreshKey, setRefreshKey] = useState(0);

// UserForm
const [formData, setFormData] = useState({...});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [roles, setRoles] = useState([]);
```

### Refresh Pattern
- After Add/Edit/Delete, increment `refreshKey`
- `UsersDataProvider` uses `key={refreshKey}` to remount
- Automatically refetches data

---

## Styling

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Danger**: Red (#EF4444)
- **Success**: Green (#10B981)
- **Background**: Gray (#F9FAFB)

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Responsive font sizes and padding

### Status Badges
- Active: Green background with green text
- Inactive: Gray background with gray text

---

## Next Steps

### To Complete the Platform:

1. **Roles Management Page**
   - Similar structure to Users and Institutions
   - Add role-privilege assignment
   - Manage role permissions

2. **Privileges Management Page**
   - List all system privileges
   - Create/Edit/Delete privileges
   - Assign privileges to roles

3. **Posts Management**
   - Create post form with image upload
   - List posts by institution
   - Edit/Delete posts
   - Comment and like functionality

4. **Messages System**
   - Message list view
   - Send message form
   - Real-time notifications

5. **Landing Page**
   - Display Super Admin posts
   - Public access (no login required)
   - Comment/Like functionality

6. **Authentication**
   - Login page
   - Token management
   - Protected routes

---

## Testing Checklist

- [ ] Add User form validation
- [ ] Edit User with pre-filled data
- [ ] Delete User with confirmation
- [ ] Search users by name/email
- [ ] Pagination works correctly
- [ ] Add Institution
- [ ] Edit Institution
- [ ] Delete Institution
- [ ] Role dropdown loads correctly
- [ ] Institution field shows for company roles
- [ ] Modal closes on success
- [ ] Error messages display correctly
- [ ] Loading states work
- [ ] Responsive design on mobile

---

## Troubleshooting

### Modal not opening
- Check `ModalProvider` is wrapping the app
- Verify `useModal()` hook is imported correctly

### Form not submitting
- Check API endpoint is correct
- Verify authentication headers are set
- Check form validation passes

### Data not loading
- Check API response format matches expectations
- Verify pagination composable handles response
- Check network tab for API errors

### Styles not applying
- Verify Tailwind CSS is configured
- Check class names are correct
- Clear browser cache

---

## Code Quality

- ✅ Reusable components
- ✅ DRY principle followed
- ✅ Proper error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Clear variable naming
- ✅ Proper prop validation

