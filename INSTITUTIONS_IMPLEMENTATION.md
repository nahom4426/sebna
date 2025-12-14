# Institutions Management - Complete Implementation

## Overview

The Institutions Management module is now fully implemented with a modern, user-friendly interface matching the Users management system. It provides complete CRUD (Create, Read, Update, Delete) operations for managing share company institutions.

---

## File Structure

```
src/pages/admin/institutions/
├── api/
│   └── InstitutionsApi.js          ← API endpoints
├── component/
│   ├── InstitutionForm.jsx         ← Reusable Add/Edit form
│   └── InstitutionsDataProvider.jsx ← Data fetching & pagination
├── pages/
│   └── Institutions.jsx            ← Main page with table
├── store/                          ← For future state management
└── index.js                        ← Exports
```

---

## API Endpoints

### Base URL
```
http://localhost:8989/api/sebna/institutions
```

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/institutions/all` | List all institutions (paginated) |
| GET | `/institutions/{id}` | Get institution details |
| POST | `/institutions` | Create new institution |
| PUT | `/institutions/{id}` | Update institution |
| DELETE | `/institutions/{id}` | Delete institution |

### Request/Response Format

**Create/Update Institution:**
```json
{
  "name": "string",
  "logo": "string (URL)",
  "description": "string"
}
```

**API Response Format:**
```json
{
  "totalPages": 1,
  "totalElements": 5,
  "pageNumber": 0,
  "response": [
    {
      "id": "uuid",
      "name": "Institution Name",
      "logo": "https://example.com/logo.png",
      "description": "Institution description",
      "createdAt": "2025-12-12T12:00:00Z",
      "updatedAt": "2025-12-12T12:00:00Z"
    }
  ]
}
```

---

## Components

### 1. InstitutionForm.jsx (Reusable)

**Purpose:** Handles both Add and Edit operations for institutions

**Features:**
- ✅ Dual-mode (Add/Edit)
- ✅ Modern Card-based UI with gradient header
- ✅ Icon integration (BuildingOfficeIcon, XMarkIcon)
- ✅ Section-based layout
- ✅ Form validation
- ✅ Loading states with spinner
- ✅ Error handling and display
- ✅ Modal integration

**Props:**
```jsx
<InstitutionForm
  institution={null}      // null for Add, institution object for Edit
  onSuccess={() => {}}    // Callback after successful save
/>
```

**Form Fields:**
- **Institution Name** (required) - Text input
- **Logo URL** (optional) - URL input
- **Description** (optional) - Textarea (4 rows)

**UI Sections:**
1. **Header** - Gradient background with icon and close button
2. **Institution Information** - All form fields grouped
3. **Action Buttons** - Cancel and Create/Update buttons

### 2. InstitutionsDataProvider.jsx

**Purpose:** Manages data fetching, pagination, and search

**Features:**
- ✅ Automatic API calls
- ✅ Pagination support (page, perPage)
- ✅ Search functionality
- ✅ Loading states
- ✅ Error handling
- ✅ Response format handling (new and old formats)

**Provides:**
```javascript
{
  institutions,      // Array of institution objects
  pending,          // Loading state
  error,            // Error message
  page,             // Current page
  perPage,          // Items per page
  totalElements,    // Total count
  totalPages,       // Total pages
  onPageChange,     // Page change handler
  onPerPageChange,  // Items per page change handler
  onNext,           // Next page handler
  onPrevious,       // Previous page handler
  refresh,          // Manual refresh function
}
```

### 3. Institutions.jsx (Main Page)

**Purpose:** Main page for institution management

**Features:**
- ✅ Add Institution button in header
- ✅ Search functionality
- ✅ Responsive table with pagination
- ✅ Edit button - opens InstitutionForm in edit mode
- ✅ Delete button - with confirmation dialog
- ✅ Loading skeleton rows
- ✅ Error display
- ✅ Refresh on success

**Table Columns:**
1. Index
2. Institution Name
3. Description (truncated to 50 chars)
4. Actions (Edit, Delete)

---

## Usage Examples

### Opening Add Institution Modal

```jsx
import { useModal } from '@/context/ModalContext';
import InstitutionForm from '@/pages/admin/institutions/component/InstitutionForm';

function MyComponent() {
  const { openModal } = useModal();

  const handleAdd = () => {
    openModal(
      <InstitutionForm
        onSuccess={() => {
          // Refresh table or perform other actions
        }}
      />
    );
  };

  return <button onClick={handleAdd}>Add Institution</button>;
}
```

### Opening Edit Institution Modal

```jsx
const handleEdit = (institution) => {
  openModal(
    <InstitutionForm
      institution={institution}
      onSuccess={() => {
        // Refresh table
      }}
    />
  );
};
```

### Using InstitutionsDataProvider

```jsx
import InstitutionsDataProvider from '@/pages/admin/institutions/component/InstitutionsDataProvider';

function MyComponent() {
  return (
    <InstitutionsDataProvider search={searchTerm}>
      {({ institutions, pending, error, page, totalPages, onPageChange }) => (
        <>
          {/* Render institutions */}
          {institutions.map((inst) => (
            <div key={inst.id}>{inst.name}</div>
          ))}
          
          {/* Pagination */}
          <button onClick={() => onPageChange(page + 1)}>Next</button>
        </>
      )}
    </InstitutionsDataProvider>
  );
}
```

---

## Routing

### Route Configuration

**Path:** `/admin/institutions`

**Protected:** Yes (requires authentication)

**Required Privileges:** `['PRIVILEGE_MANAGEMENT', 'create_user']`

**Route Definition:**
```jsx
<Route
  path="/admin/institutions"
  element={
    <ProtectedRoute
      element={<Institutions />}
      requiredPrivileges={['PRIVILEGE_MANAGEMENT','create_user']}
    />
  }
/>
```

### Sidebar Menu

The Institutions menu item is added to the Admin section:

```javascript
{
  name: 'Institutions',
  icon: '🏢',
  path: '/admin/institutions',
  privilege: ['PRIVILEGE_MANAGEMENT','create_user'],
}
```

---

## Form Validation

### InstitutionForm Validation Rules

```javascript
✓ Institution Name is required
✓ Logo URL must be valid URL format (optional)
✓ Description is optional
```

### Error Handling

- Validation errors shown above form
- API errors displayed in Alert component
- Error messages clear on input change
- Form prevents submission if validation fails

---

## Styling & Design

### Color Scheme
- **Primary Blue:** #3B82F6 (buttons, headers)
- **Gradient:** Blue 500 to Blue 600 (header background)
- **Danger Red:** #EF4444 (delete buttons)
- **Background:** #F9FAFB (page background)

### UI Components Used
- **Card** - Form container
- **CardHeader** - Gradient header with icon
- **CardBody** - Form content
- **Input** - Text fields
- **Button** - Action buttons
- **Typography** - Labels and headings
- **Alert** - Error messages
- **Icons** - BuildingOfficeIcon, XMarkIcon from Heroicons

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Responsive font sizes
- Touch-friendly buttons
- Adaptive layout

---

## State Management

### Component State

```javascript
// Institutions Page
const [searchTerm, setSearchTerm] = useState('');
const [refreshKey, setRefreshKey] = useState(0);

// InstitutionForm
const [formData, setFormData] = useState({
  name: '',
  logo: '',
  description: '',
});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

### Refresh Pattern

After Add/Edit/Delete operations:
```javascript
setRefreshKey((prev) => prev + 1);
```

This causes `InstitutionsDataProvider` to remount and refetch data automatically.

---

## Features

### Add Institution
1. Click **"+ Add Institution"** button in header
2. Modal opens with empty InstitutionForm
3. Fill in required fields (name)
4. Click **"Create"** button
5. Form validates and submits to API
6. On success, modal closes and table refreshes

### Edit Institution
1. Click **"Edit"** button in institution row
2. Modal opens with InstitutionForm pre-filled
3. Modify fields as needed
4. Click **"Update"** button
5. Form submits to API
6. On success, modal closes and table refreshes

### Delete Institution
1. Click **"Delete"** button in institution row
2. Confirmation dialog appears
3. Click **"OK"** to confirm deletion
4. Institution is deleted from database
5. Table automatically refreshes

### Search Institutions
1. Type in search input field
2. Table automatically filters results
3. Pagination updates based on search results

### Pagination
1. Navigate between pages using pagination controls
2. Change items per page using dropdown
3. View total count and current page info

---

## Error Handling

### API Errors
- Caught in try-catch blocks
- User-friendly error messages displayed
- Errors logged to console for debugging
- Form remains open for correction

### Validation Errors
- Validation errors shown above form
- Clear on input change
- Prevent submission if validation fails

### Delete Errors
- Show confirmation dialog
- Alert user if deletion fails
- Table remains unchanged on error

---

## Loading States

### Form Loading
- Submit button shows spinner and "Saving..." text
- Form fields disabled during submission
- Cancel button remains enabled

### Table Loading
- Skeleton rows displayed while fetching
- Search input disabled
- Pagination controls disabled

---

## Testing Checklist

- [ ] Add institution with all fields
- [ ] Add institution with minimal fields
- [ ] Edit institution and verify changes
- [ ] Delete institution with confirmation
- [ ] Search institutions by name
- [ ] Pagination works correctly
- [ ] Modal closes on success
- [ ] Error messages display
- [ ] Loading states work
- [ ] Responsive on mobile
- [ ] Form validation prevents invalid submissions
- [ ] API calls use correct endpoints

---

## Troubleshooting

### Issue: Modal not opening
**Solution:** Ensure `ModalProvider` wraps your app in `main.jsx`

### Issue: Form not submitting
**Solution:** Check API endpoint, verify authentication headers, check validation

### Issue: Data not loading
**Solution:** Check API response format, verify pagination composable, check network tab

### Issue: Styles not applying
**Solution:** Verify Tailwind CSS config, check class names, clear browser cache

---

## Next Steps

1. **Add Institution Logo Preview** - Display logo image in form
2. **Bulk Operations** - Add bulk delete/export functionality
3. **Institution Details Page** - Show detailed institution information
4. **Institution Users** - Manage users within an institution
5. **Institution Analytics** - Display institution statistics
6. **Institution Settings** - Configure institution-specific settings

---

## API Integration Notes

The InstitutionsApi.js file handles all API communication:

```javascript
// Get all institutions (paginated)
getAllInstitution(query)

// Get single institution
getInstitutionById(id)

// Create new institution
createInstitution(data)

// Update institution
updateInstitutionById(id, data)

// Delete institution
removeInstitutionById(id)

// Change institution status
changeInstitutionStatus(id, status)
```

All endpoints include authentication headers automatically.

---

## Summary

✅ **Completed:**
- Institution management page with full CRUD
- Reusable InstitutionForm component
- Modern UI design with Card and Icons
- Search and pagination
- Full validation and error handling
- Modal integration
- Responsive design
- Complete documentation

🚀 **Ready to:**
- Manage institutions through the admin panel
- Integrate with backend API
- Extend with additional features

---

**Last Updated:** December 12, 2025
**Version:** 1.0
**Status:** ✅ Complete & Ready for Use
