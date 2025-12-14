# Share Companies Platform - Setup & Quick Start

## What Was Built

A complete **Share Companies Platform** for managing multiple share company institutions with 3 user roles and a public landing page.

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  SHARE COMPANIES PLATFORM                │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         SUPER ADMIN (Platform Admin)             │   │
│  │  • Manage institutions                           │   │
│  │  • Create/manage all users                       │   │
│  │  • Manage roles & privileges                     │   │
│  │  • Post to public landing page                   │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │    COMPANY ADMIN (Institution Admin)             │   │
│  │  • Post news for their institution               │   │
│  │  • Manage users within institution               │   │
│  │  • Respond to user messages                      │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │    COMPANY USERS (Institution Members)           │   │
│  │  • View institution posts                        │   │
│  │  • Like & comment on posts                       │   │
│  │  • Send messages to admin/users                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │    PUBLIC LANDING PAGE (No Login Required)       │   │
│  │  • Display Super Admin posts                     │   │
│  │  • Platform announcements                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Files Created

### 📁 User Management Module
```
src/pages/admin/users/
├── api/
│   └── UsersApi.js                    ← User API endpoints
├── component/
│   ├── UserForm.jsx                   ← Add/Edit form (REUSABLE)
│   └── UsersDataProvider.jsx          ← Data fetching
└── pages/
    └── Users.jsx                      ← Main page (UPDATED)
```

### 📁 Institution Management Module
```
src/pages/admin/institutions/
├── api/
│   └── InstitutionsApi.js             ← Institution API endpoints
├── component/
│   ├── InstitutionForm.jsx            ← Add/Edit form (REUSABLE)
│   └── InstitutionsDataProvider.jsx   ← Data fetching
├── pages/
│   └── Institutions.jsx               ← Main page
└── index.js                           ← Exports
```

### 📄 Documentation
```
DATABASE_SCHEMA.md                      ← Complete database design
IMPLEMENTATION_GUIDE.md                 ← Developer guide
SHARE_COMPANIES_SETUP.md               ← This file
```

---

## Key Components

### 1. **UserForm.jsx** (Reusable)
A smart form that handles both Add and Edit operations.

**Features:**
- ✅ Dual-mode (Add/Edit)
- ✅ Email disabled in edit mode
- ✅ Password optional in edit mode
- ✅ Conditional institution field based on role
- ✅ Role dropdown with API integration
- ✅ Full validation
- ✅ Modal integration

**Usage:**
```jsx
import UserForm from '@/pages/admin/users/component/UserForm';
import { useModal } from '@/context/ModalContext';

function MyComponent() {
  const { openModal } = useModal();
  
  // Add new user
  const handleAdd = () => {
    openModal(<UserForm onSuccess={() => refresh()} />);
  };
  
  // Edit existing user
  const handleEdit = (user) => {
    openModal(<UserForm user={user} onSuccess={() => refresh()} />);
  };
  
  return (
    <>
      <button onClick={handleAdd}>Add User</button>
      <button onClick={() => handleEdit(userData)}>Edit</button>
    </>
  );
}
```

### 2. **InstitutionForm.jsx** (Reusable)
Similar to UserForm but for institutions.

**Fields:**
- Institution Name (required)
- Logo URL (optional)
- Description (optional)

**Usage:**
```jsx
import InstitutionForm from '@/pages/admin/institutions/component/InstitutionForm';

// Add or Edit institutions
openModal(<InstitutionForm onSuccess={() => refresh()} />);
openModal(<InstitutionForm institution={data} onSuccess={() => refresh()} />);
```

### 3. **Users Page** (Updated)
Main page for user management with full CRUD operations.

**Features:**
- ✅ Add User button in header
- ✅ Search functionality
- ✅ Pagination
- ✅ Edit user (opens UserForm modal)
- ✅ Delete user (with confirmation)
- ✅ Status display
- ✅ Loading states

### 4. **Institutions Page** (New)
Main page for institution management.

**Features:**
- ✅ Add Institution button
- ✅ Search functionality
- ✅ Pagination
- ✅ Edit institution
- ✅ Delete institution
- ✅ Loading states

---

## User Form Fields

When creating or editing a user, the form includes:

```javascript
{
  email: "user@example.com",           // Required, unique
  password: "securePassword123",       // Required for Add, optional for Edit
  title: "Manager",                    // Optional
  firstName: "John",                   // Required
  fatherName: "Ahmed",                 // Optional
  grandFatherName: "Hassan",           // Optional
  gender: "male",                      // male, female, or other
  mobilePhone: "+966501234567",        // Optional
  roleUuid: "uuid-of-role",            // Required
  institutionId: "uuid-of-institution" // Required for company_admin/company_user
}
```

### Role-Based Logic
- **super_admin**: No institution required
- **company_admin**: Institution required
- **company_user**: Institution required

---

## API Endpoints

### Users API
```javascript
import { 
  getAllUser,           // GET /users/all
  getUserById,          // GET /users/{id}
  createUser,           // POST /users/signup
  updateUserById,       // PUT /users/{id}
  removeUserById,       // DELETE /users/{id}
  changeUserStatus,     // PUT /users/{id}/status
  getAllRole            // GET /role/getAll
} from '@/pages/admin/users/api/UsersApi';
```

### Institutions API
```javascript
import {
  getAllInstitution,         // GET /institutions/all
  getInstitutionById,        // GET /institutions/{id}
  createInstitution,         // POST /institutions
  updateInstitutionById,     // PUT /institutions/{id}
  removeInstitutionById,     // DELETE /institutions/{id}
  changeInstitutionStatus    // PUT /institutions/{id}/status
} from '@/pages/admin/institutions/api/InstitutionsApi';
```

---

## How It Works

### Adding a User
1. Click **"+ Add User"** button in header
2. Modal opens with empty UserForm
3. Fill in required fields (email, password, firstName, role)
4. If role is company_admin or company_user, select institution
5. Click **"Create User"**
6. Form validates and submits to API
7. On success, modal closes and table refreshes

### Editing a User
1. Click **"Edit"** button in user row
2. Modal opens with UserForm pre-filled with user data
3. Email field is disabled (can't change email)
4. Password field is optional (leave empty to keep current)
5. Modify other fields as needed
6. Click **"Update User"**
7. Form submits to API
8. On success, modal closes and table refreshes

### Deleting a User
1. Click **"Delete"** button in user row
2. Confirmation dialog appears
3. Click **"OK"** to confirm deletion
4. User is deleted from database
5. Table automatically refreshes

### Similar Flow for Institutions
- Add Institution
- Edit Institution
- Delete Institution

---

## Form Validation

### UserForm Validation
```javascript
✓ Email is required
✓ Password is required for new users
✓ Password is optional when editing
✓ First Name is required
✓ Role is required
✓ Institution is required if role is company_admin or company_user
```

### InstitutionForm Validation
```javascript
✓ Institution Name is required
```

---

## State Management Pattern

The platform uses a **refresh key pattern** for data updates:

```javascript
const [refreshKey, setRefreshKey] = useState(0);

// After Add/Edit/Delete
setRefreshKey((prev) => prev + 1);

// DataProvider remounts with new key
<UsersDataProvider key={refreshKey} search={searchTerm}>
  {/* Table content */}
</UsersDataProvider>
```

This ensures:
- ✅ Fresh data is fetched after operations
- ✅ No manual refresh button needed
- ✅ Automatic table update
- ✅ Clean and simple pattern

---

## Modal Context Integration

The platform uses `ModalContext` for global modal management:

```javascript
import { useModal } from '@/context/ModalContext';

function MyComponent() {
  const { openModal, closeModal } = useModal();
  
  // Open modal
  openModal(<UserForm onSuccess={closeModal} />);
  
  // Close modal (called automatically on success)
  closeModal();
}
```

**Features:**
- ✅ Single modal instance
- ✅ Click outside to close
- ✅ Prevents multiple modals
- ✅ Global state management

---

## Styling & Design

### Color Scheme
- **Primary Blue**: #3B82F6 (buttons, links)
- **Danger Red**: #EF4444 (delete buttons)
- **Success Green**: #10B981 (status badges)
- **Background Gray**: #F9FAFB (page background)

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Responsive font sizes
- Touch-friendly buttons

### Status Badges
- Active: Green background
- Inactive: Gray background

---

## Next Steps to Complete Platform

### 1. Roles Management Page
- List all roles
- Create/Edit/Delete roles
- Assign privileges to roles

### 2. Privileges Management Page
- List all privileges
- Create/Edit/Delete privileges
- Manage privilege scopes

### 3. Posts Management
- Create post form with image upload
- List posts by institution
- Edit/Delete posts
- Comment and like functionality

### 4. Messages System
- Message list view
- Send message form
- Real-time notifications

### 5. Landing Page
- Display Super Admin posts
- Public access (no login)
- Comment/Like functionality

### 6. Authentication
- Login page
- Token management
- Protected routes

---

## Testing Checklist

- [ ] Add user with all fields
- [ ] Add user with minimal fields
- [ ] Edit user and verify changes
- [ ] Delete user with confirmation
- [ ] Search users by name/email
- [ ] Pagination works correctly
- [ ] Add institution
- [ ] Edit institution
- [ ] Delete institution
- [ ] Role dropdown loads
- [ ] Institution field shows for company roles
- [ ] Modal closes on success
- [ ] Error messages display
- [ ] Loading states work
- [ ] Responsive on mobile

---

## Troubleshooting

### Issue: Modal not opening
**Solution:** Ensure `ModalProvider` wraps your app in `main.jsx` or `App.jsx`

### Issue: Form not submitting
**Solution:** Check API endpoint, verify authentication headers, check validation

### Issue: Data not loading
**Solution:** Check API response format, verify pagination composable, check network tab

### Issue: Styles not applying
**Solution:** Verify Tailwind CSS config, check class names, clear browser cache

---

## Database Schema

See `DATABASE_SCHEMA.md` for complete database design including:
- All table structures
- Relationships and foreign keys
- Indexes and constraints
- Access control rules
- API endpoint mappings

---

## Implementation Guide

See `IMPLEMENTATION_GUIDE.md` for:
- Detailed component documentation
- Code examples
- State management patterns
- Error handling strategies
- Testing guidelines

---

## Summary

✅ **Completed:**
- User management with Add/Edit/Delete
- Institution management with Add/Edit/Delete
- Reusable form components
- Modal integration
- Search and pagination
- Full validation
- Error handling
- Responsive design
- Complete documentation

🚀 **Ready to extend with:**
- Roles & Privileges management
- Posts & Comments system
- Messages system
- Landing page
- Authentication

---

**Last Updated:** December 12, 2025
**Version:** 1.0
**Status:** ✅ Complete & Ready for Use
