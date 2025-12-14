# Admin Panel - Quick Reference Guide

## Overview

The admin panel provides complete management for Users, Roles, Privileges, and Institutions with a modern, consistent UI design.

---

## Admin Modules

### 1. Users Management
**Path:** `/admin/users`  
**Icon:** 👥  
**Purpose:** Manage all system users

**Features:**
- ✅ Add/Edit/Delete users
- ✅ Search by name or email
- ✅ View user role and status
- ✅ Pagination support
- ✅ Modal-based forms

**Form Fields:**
- Email (required, unique, disabled in edit)
- Password (required for add, optional for edit)
- Title
- First Name (required)
- Father Name
- Grand Father Name
- Gender (dropdown)
- Mobile Phone
- Role (required, dropdown)
- Institution (conditional, based on role)

**Table Columns:**
- Index
- First Name
- Email
- Role
- Status (green badge)
- Actions (Edit, Delete)

---

### 2. Roles Management
**Path:** `/admin/roles`  
**Icon:** 🔐  
**Purpose:** Manage user roles and permissions

**Features:**
- ✅ Add/Edit/Delete roles
- ✅ Assign privileges to roles
- ✅ Search functionality
- ✅ Pagination support

**Predefined Roles:**
- `super_admin` - Full platform access
- `company_admin` - Institution-level admin
- `company_user` - Regular institution member

**Table Columns:**
- Index
- Role Name
- Description
- Status (blue badge)
- Actions (Edit, Delete)

---

### 3. Privileges Management
**Path:** `/admin/privileges`  
**Icon:** 🛡️  
**Purpose:** Define system permissions

**Features:**
- ✅ Add/Edit/Delete privileges
- ✅ Assign to roles
- ✅ Search functionality
- ✅ Pagination support

**Example Privileges:**
- CREATE_USER
- DELETE_USER
- UPDATE_USER
- CREATE_POST
- DELETE_POST
- MANAGE_INSTITUTION
- VIEW_ANALYTICS

**Table Columns:**
- Index
- Privilege Name
- Description
- Actions (Edit, Delete)

---

### 4. Institutions Management
**Path:** `/admin/institutions`  
**Icon:** 🏢  
**Purpose:** Manage share company institutions

**Features:**
- ✅ Add/Edit/Delete institutions
- ✅ Search functionality
- ✅ Pagination support
- ✅ Modern Card-based UI

**Form Fields:**
- Institution Name (required)
- Logo URL (optional)
- Description (optional)

**Table Columns:**
- Index
- Institution Name
- Description (truncated)
- Actions (Edit, Delete)

---

## Common Features Across All Modules

### Search
- Real-time search input
- Filters data as you type
- Works across all pages

### Pagination
- Page navigation
- Items per page selector
- Total count display
- Previous/Next buttons

### Actions
- **Edit** - Opens modal with pre-filled form
- **Delete** - Shows confirmation dialog

### Loading States
- Skeleton rows while fetching
- Spinner on form submission
- Disabled inputs during loading

### Error Handling
- User-friendly error messages
- Alert component for errors
- Form validation before submission

### Modal Forms
- Centered modal overlay
- Click outside to close
- Close button in header
- Cancel and Submit buttons

---

## UI Design System

### Colors
- **Primary Blue:** #3B82F6
- **Gradient:** Blue 500 → Blue 600
- **Danger Red:** #EF4444
- **Success Green:** #10B981
- **Background Gray:** #F9FAFB

### Components
- **Card** - Form container
- **CardHeader** - Gradient header
- **CardBody** - Form content
- **Input** - Text fields
- **Select** - Dropdown fields
- **Button** - Action buttons
- **Alert** - Error messages
- **Typography** - Labels and headings

### Icons
- UserCircleIcon - Users
- ShieldCheckIcon - Roles
- BuildingOfficeIcon - Institutions
- KeyIcon - Authentication
- IdentificationIcon - Personal info
- PhoneIcon - Contact
- Heroicons from @heroicons/react/24/outline

---

## API Endpoints Summary

### Users API
```
GET    /users/all                    - List users
GET    /users/{id}                   - Get user
POST   /users/signup                 - Create user
PUT    /users/{id}                   - Update user
DELETE /users/{id}                   - Delete user
PUT    /users/{id}/status            - Change status
```

### Roles API
```
GET    /role/getAll                  - List roles
GET    /role/{id}                    - Get role
POST   /role                         - Create role
PUT    /role/{id}                    - Update role
DELETE /role/{id}                    - Delete role
PUT    /role/{id}/status             - Change status
```

### Privileges API
```
GET    /privilege/list               - List privileges
GET    /privilege/{id}               - Get privilege
POST   /privilege                    - Create privilege
PUT    /privilege/{id}               - Update privilege
DELETE /privilege/{id}               - Delete privilege
PUT    /privilege/{id}/status        - Change status
```

### Institutions API
```
GET    /institutions/all             - List institutions
GET    /institutions/{id}            - Get institution
POST   /institutions                 - Create institution
PUT    /institutions/{id}            - Update institution
DELETE /institutions/{id}            - Delete institution
PUT    /institutions/{id}/status     - Change status
```

---

## Form Validation Rules

### Users
- Email: Required, unique, valid format
- Password: Required for add, optional for edit
- First Name: Required
- Role: Required
- Institution: Required if role is company_admin or company_user

### Roles
- Name: Required, unique
- Description: Optional

### Privileges
- Name: Required, unique
- Description: Optional

### Institutions
- Name: Required
- Logo: Optional, must be valid URL
- Description: Optional

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Esc | Close modal |
| Enter | Submit form (when focused on submit button) |
| Tab | Navigate between form fields |

---

## Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

All admin pages are fully responsive and work on all device sizes.

---

## Authentication & Authorization

### Protected Routes
All admin routes require:
- Valid authentication token
- Specific privileges

### Required Privileges
- Users: `create_user`
- Roles: `ROLE_MANAGEMENT`, `create_user`
- Privileges: `PRIVILEGE_MANAGEMENT`, `create_user`
- Institutions: `PRIVILEGE_MANAGEMENT`, `create_user`

### Token Management
- Tokens are stored in localStorage
- Automatically included in API headers
- Refreshed on login

---

## Common Tasks

### Add a New User
1. Go to `/admin/users`
2. Click **"+ Add User"** button
3. Fill in required fields
4. Select role and institution (if needed)
5. Click **"Create User"**

### Edit a User
1. Go to `/admin/users`
2. Find user in table
3. Click **"Edit"** button
4. Modify fields
5. Click **"Update User"**

### Delete a User
1. Go to `/admin/users`
2. Find user in table
3. Click **"Delete"** button
4. Confirm deletion
5. User is removed

### Search Users
1. Go to `/admin/users`
2. Type in search field
3. Table filters automatically
4. Results update in real-time

### Change Pagination
1. Go to any admin page
2. Use pagination controls at bottom
3. Select items per page
4. Navigate between pages

---

## Troubleshooting

### Modal not opening
- Check browser console for errors
- Verify ModalProvider is in app layout
- Clear browser cache

### Form not submitting
- Check all required fields are filled
- Verify API endpoint is correct
- Check network tab for API errors

### Data not loading
- Check API response format
- Verify authentication token is valid
- Check network connectivity

### Styles not applying
- Clear browser cache
- Verify Tailwind CSS is configured
- Check class names are correct

---

## File Structure

```
src/pages/admin/
├── api/
│   └── AdminApi.js                 (Central API)
├── users/
│   ├── api/UsersApi.js
│   ├── component/
│   │   ├── UserForm.jsx
│   │   └── UsersDataProvider.jsx
│   └── pages/Users.jsx
├── roles/
│   ├── api/RolesApi.js
│   ├── component/
│   │   ├── RoleForm.jsx
│   │   └── RolesDataProvider.jsx
│   └── pages/Roles.jsx
├── privileges/
│   ├── api/PrivilegesApi.js
│   ├── component/
│   │   ├── PrivilegeForm.jsx
│   │   └── PrivilegesDataProvider.jsx
│   └── pages/Privileges.jsx
├── institutions/
│   ├── api/InstitutionsApi.js
│   ├── component/
│   │   ├── InstitutionForm.jsx
│   │   └── InstitutionsDataProvider.jsx
│   └── pages/Institutions.jsx
└── index.js                        (Exports)
```

---

## Performance Tips

1. **Search Debouncing** - Search is debounced to reduce API calls
2. **Pagination** - Load only needed data per page
3. **Lazy Loading** - Forms load on demand in modals
4. **Caching** - Consider implementing response caching
5. **Skeleton Loaders** - Show placeholders while loading

---

## Future Enhancements

- [ ] Bulk operations (bulk delete, bulk export)
- [ ] Advanced filtering
- [ ] Custom column selection
- [ ] Export to CSV/Excel
- [ ] Import from CSV
- [ ] Audit logs
- [ ] Role-based dashboards
- [ ] Activity history
- [ ] Batch operations

---

## Support & Documentation

- **Database Schema:** See `DATABASE_SCHEMA.md`
- **Implementation Guide:** See `IMPLEMENTATION_GUIDE.md`
- **Users Module:** See `SHARE_COMPANIES_SETUP.md`
- **Institutions Module:** See `INSTITUTIONS_IMPLEMENTATION.md`

---

**Last Updated:** December 12, 2025  
**Version:** 1.0  
**Status:** ✅ Complete & Ready for Use
