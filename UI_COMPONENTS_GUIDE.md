# UI Components Guide - Admin Panel

## Overview

This guide documents all reusable UI components used in the admin panel with examples and best practices.

---

## Form Components

### UserForm Component

**Location:** `src/pages/admin/users/component/UserForm.jsx`

**Purpose:** Reusable form for adding and editing users

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│  [Icon] Edit User              [X Close]   │  ← Header (Gradient)
├─────────────────────────────────────────────┤
│                                             │
│  [Error Alert if any]                       │
│                                             │
│  ┌─ Authentication ─────────────────────┐  │
│  │ Email *        [____________]        │  │
│  │ Password *     [____________]        │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─ Personal Information ────────────────┐ │
│  │ Title          [____________]         │ │
│  │ First Name *   [____________]         │ │
│  │ Father Name    [____________]         │ │
│  │ Grand Father   [____________]         │ │
│  │ Gender         [Dropdown]             │ │
│  │ Mobile Phone   [____________]         │ │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─ Role & Permissions ──────────────────┐ │
│  │ User Role *    [Dropdown]             │ │
│  │ Institution *  [Dropdown] (if needed) │ │
│  └─────────────────────────────────────┘  │
│                                             │
│                [Cancel]  [Create User]     │  ← Action Buttons
│                                             │
└─────────────────────────────────────────────┘
```

**Usage:**
```jsx
import UserForm from '@/pages/admin/users/component/UserForm';
import { useModal } from '@/context/ModalContext';

function MyComponent() {
  const { openModal } = useModal();

  // Add new user
  const handleAdd = () => {
    openModal(
      <UserForm
        onSuccess={() => {
          // Refresh table
        }}
      />
    );
  };

  // Edit existing user
  const handleEdit = (user) => {
    openModal(
      <UserForm
        user={user}
        onSuccess={() => {
          // Refresh table
        }}
      />
    );
  };

  return (
    <>
      <button onClick={handleAdd}>Add User</button>
      <button onClick={() => handleEdit(userData)}>Edit</button>
    </>
  );
}
```

**Props:**
- `user` (Object|null) - User data for edit mode, null for add
- `onSuccess` (Function) - Callback after successful save

**Features:**
- ✅ Dual-mode (Add/Edit)
- ✅ Email disabled in edit mode
- ✅ Password optional in edit mode
- ✅ Conditional institution field
- ✅ Role dropdown with API integration
- ✅ Full form validation
- ✅ Loading states
- ✅ Error handling

---

### InstitutionForm Component

**Location:** `src/pages/admin/institutions/component/InstitutionForm.jsx`

**Purpose:** Reusable form for adding and editing institutions

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│  [Icon] New Institution        [X Close]   │  ← Header (Gradient)
├─────────────────────────────────────────────┤
│                                             │
│  [Error Alert if any]                       │
│                                             │
│  ┌─ Institution Information ─────────────┐ │
│  │ Institution Name * [____________]     │ │
│  │ Logo URL         [____________]       │ │
│  │ Description      [_____________]      │ │
│  │                  [_____________]      │ │
│  │                  [_____________]      │ │
│  └─────────────────────────────────────┘  │
│                                             │
│                [Cancel]  [Create]          │  ← Action Buttons
│                                             │
└─────────────────────────────────────────────┘
```

**Usage:**
```jsx
import InstitutionForm from '@/pages/admin/institutions/component/InstitutionForm';
import { useModal } from '@/context/ModalContext';

function MyComponent() {
  const { openModal } = useModal();

  const handleAdd = () => {
    openModal(
      <InstitutionForm
        onSuccess={() => {
          // Refresh table
        }}
      />
    );
  };

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

  return (
    <>
      <button onClick={handleAdd}>Add Institution</button>
      <button onClick={() => handleEdit(data)}>Edit</button>
    </>
  );
}
```

**Props:**
- `institution` (Object|null) - Institution data for edit mode
- `onSuccess` (Function) - Callback after successful save

**Features:**
- ✅ Dual-mode (Add/Edit)
- ✅ Modern Card UI
- ✅ Section-based layout
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

---

## Table Components

### Table Component

**Location:** `src/components/Table.jsx`

**Purpose:** Reusable table for displaying data with pagination support

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Index │ Column 1 │ Column 2 │ Column 3 │ Actions       │
├─────────────────────────────────────────────────────────┤
│   1   │ Data     │ Data     │ Data     │ [Edit][Delete]│
│   2   │ Data     │ Data     │ Data     │ [Edit][Delete]│
│   3   │ Data     │ Data     │ Data     │ [Edit][Delete]│
├─────────────────────────────────────────────────────────┤
│ Page 1 of 5 │ Items: 1-10 of 50 │ [Prev] [1][2][3] [Next]│
└─────────────────────────────────────────────────────────┘
```

**Usage:**
```jsx
import Table from '@/components/Table';
import TableSkeletonRow from '@/components/TableSkeletonRow';

function MyComponent() {
  const headers = {
    head: ['Name', 'Email', 'Role', 'Actions'],
    row: ['name', 'email', 'role']
  };

  const renderRow = (row, index, page, perPage) => (
    <tr key={row.id}>
      <td>{(page - 1) * perPage + index + 1}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.role}</td>
      <td>
        <button onClick={() => handleEdit(row)}>Edit</button>
        <button onClick={() => handleDelete(row.id)}>Delete</button>
      </td>
    </tr>
  );

  return (
    <Table
      headers={headers}
      rows={data}
      loading={pending}
      renderRow={renderRow}
      page={page}
      perPage={perPage}
      placeholder="No data found"
      SkeletonRow={TableSkeletonRow}
      lastCol
    />
  );
}
```

**Props:**
- `headers` (Object) - Column definitions
- `rows` (Array) - Data rows
- `loading` (Boolean) - Loading state
- `renderRow` (Function) - Custom row renderer
- `page` (Number) - Current page
- `perPage` (Number) - Items per page
- `placeholder` (String) - Empty state message
- `SkeletonRow` (Component) - Loading skeleton
- `lastCol` (Boolean) - Show actions column

---

## Data Provider Components

### UsersDataProvider

**Location:** `src/pages/admin/users/component/UsersDataProvider.jsx`

**Purpose:** Manages user data fetching, pagination, and search

**Usage:**
```jsx
import UsersDataProvider from '@/pages/admin/users/component/UsersDataProvider';

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <UsersDataProvider search={searchTerm}>
      {({
        users,
        pending,
        error,
        page,
        perPage,
        totalElements,
        totalPages,
        onPageChange,
        onPerPageChange,
        onNext,
        onPrevious,
        refresh
      }) => (
        <>
          {error && <div className="error">{error}</div>}
          
          <Table
            rows={users}
            loading={pending}
            page={page}
            perPage={perPage}
            // ... other props
          />
          
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            // ... other props
          />
        </>
      )}
    </UsersDataProvider>
  );
}
```

**Provides:**
- `users` - Array of user objects
- `pending` - Loading state
- `error` - Error message
- `page` - Current page
- `perPage` - Items per page
- `totalElements` - Total count
- `totalPages` - Total pages
- `onPageChange` - Page change handler
- `onPerPageChange` - Items per page handler
- `onNext` - Next page handler
- `onPrevious` - Previous page handler
- `refresh` - Manual refresh function

---

### InstitutionsDataProvider

**Location:** `src/pages/admin/institutions/component/InstitutionsDataProvider.jsx`

**Purpose:** Manages institution data fetching, pagination, and search

**Usage:** Same pattern as UsersDataProvider

---

## Modal Components

### ModalContext

**Location:** `src/context/ModalContext.jsx`

**Purpose:** Global modal management

**Usage:**
```jsx
import { useModal } from '@/context/ModalContext';

function MyComponent() {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <div>
        <h2>Modal Content</h2>
        <button onClick={closeModal}>Close</button>
      </div>
    );
  };

  return <button onClick={handleOpenModal}>Open Modal</button>;
}
```

**Features:**
- ✅ Single modal instance
- ✅ Click outside to close
- ✅ Prevents multiple modals
- ✅ Global state management

---

## Input Components

### Material Tailwind Input

**Usage:**
```jsx
import { Input } from '@material-tailwind/react';

<Input
  type="email"
  label="Email"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  disabled={loading}
  className="!border-gray-300 focus:!border-blue-500"
  labelProps={{ className: 'hidden' }}
  placeholder="Enter email"
  required
/>
```

**Props:**
- `type` - Input type (text, email, password, tel, url, etc.)
- `label` - Label text
- `name` - Input name
- `value` - Input value
- `onChange` - Change handler
- `disabled` - Disabled state
- `className` - CSS classes
- `placeholder` - Placeholder text
- `required` - Required attribute

---

### Material Tailwind Select

**Usage:**
```jsx
import { Select, Option } from '@material-tailwind/react';

<Select
  label="Role"
  value={formData.roleUuid}
  onChange={(value) => handleSelectChange('roleUuid', value)}
  disabled={loading}
  className="!border-gray-300 focus:!border-blue-500"
  labelProps={{ className: 'hidden' }}
>
  <Option value="">Select Role</Option>
  {roles.map((role) => (
    <Option key={role.id} value={role.id}>
      {role.name}
    </Option>
  ))}
</Select>
```

**Props:**
- `label` - Label text
- `value` - Selected value
- `onChange` - Change handler
- `disabled` - Disabled state
- `className` - CSS classes
- `children` - Option elements

---

## Alert Components

### Material Tailwind Alert

**Usage:**
```jsx
import { Alert } from '@material-tailwind/react';

<Alert
  color="red"
  variant="filled"
  className="mb-4 py-2 text-sm"
>
  Error message here
</Alert>
```

**Props:**
- `color` - Alert color (red, green, blue, yellow, etc.)
- `variant` - Alert variant (filled, outlined, gradient)
- `className` - CSS classes
- `children` - Alert content

---

## Button Components

### Material Tailwind Button

**Usage:**
```jsx
import { Button } from '@material-tailwind/react';

// Primary Button
<Button
  type="submit"
  disabled={loading}
  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600"
>
  Submit
</Button>

// Secondary Button
<Button
  variant="text"
  color="blue-gray"
  onClick={handleCancel}
  className="px-4 py-2 text-sm"
>
  Cancel
</Button>

// Icon Button
<Button
  variant="text"
  className="text-white hover:bg-white/10 p-1 h-8 w-8 min-w-0"
  onClick={closeModal}
>
  <XMarkIcon className="h-5 w-5" />
</Button>
```

**Props:**
- `type` - Button type (button, submit, reset)
- `disabled` - Disabled state
- `onClick` - Click handler
- `className` - CSS classes
- `variant` - Button variant (filled, outlined, text, gradient)
- `color` - Button color
- `children` - Button content

---

## Icon Components

### Heroicons

**Location:** `@heroicons/react/24/outline`

**Available Icons:**
```javascript
import {
  UserCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  KeyIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  XMarkIcon,
  UserIcon,
  ExclamationTriangleIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
```

**Usage:**
```jsx
<UserCircleIcon className="h-6 w-6 text-white" />
<ShieldCheckIcon className="h-5 w-5 text-blue-500" />
<BuildingOfficeIcon className="h-4 w-4 text-gray-600" />
```

**Size Classes:**
- `h-3 w-3` - Extra small (12px)
- `h-4 w-4` - Small (16px)
- `h-5 w-5` - Medium (20px)
- `h-6 w-6` - Large (24px)
- `h-8 w-8` - Extra large (32px)

---

## Typography Components

### Material Tailwind Typography

**Usage:**
```jsx
import { Typography } from '@material-tailwind/react';

<Typography variant="h5" className="text-white font-semibold">
  Form Title
</Typography>

<Typography variant="h6" color="blue-gray" className="font-semibold">
  Section Title
</Typography>

<Typography variant="small" color="blue-gray" className="font-medium">
  Label Text
</Typography>

<Typography variant="small" color="gray" className="text-xs">
  Helper Text
</Typography>
```

**Variants:**
- `h1` - Heading 1
- `h2` - Heading 2
- `h3` - Heading 3
- `h4` - Heading 4
- `h5` - Heading 5
- `h6` - Heading 6
- `lead` - Lead text
- `paragraph` - Paragraph
- `small` - Small text

---

## Card Components

### Material Tailwind Card

**Usage:**
```jsx
import {
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';

<Card className="w-full max-w-2xl shadow-xl">
  <CardHeader
    shadow={false}
    className="rounded-t-xl bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6"
  >
    <Typography variant="h5" className="text-white font-semibold">
      Card Title
    </Typography>
  </CardHeader>
  
  <CardBody className="p-6">
    {/* Card content */}
  </CardBody>
</Card>
```

**Props:**
- `className` - CSS classes
- `shadow` - Shadow effect
- `rounded` - Border radius

---

## Pagination Component

**Location:** `src/composables/Pagination.jsx`

**Usage:**
```jsx
import Pagination from '@/composables/Pagination';

<Pagination
  page={page}
  totalPages={totalPages}
  totalElements={totalElements}
  perPage={perPage}
  rowsCount={rows.length}
  onPageChange={onPageChange}
  onPerPageChange={onPerPageChange}
  onNext={onNext}
  onPrevious={onPrevious}
  loading={pending}
/>
```

**Props:**
- `page` - Current page
- `totalPages` - Total pages
- `totalElements` - Total items
- `perPage` - Items per page
- `rowsCount` - Current page rows
- `onPageChange` - Page change handler
- `onPerPageChange` - Items per page handler
- `onNext` - Next page handler
- `onPrevious` - Previous page handler
- `loading` - Loading state

---

## Color Palette

### Primary Colors
- **Blue 500:** `#3B82F6`
- **Blue 600:** `#2563EB`
- **Blue 700:** `#1D4ED8`

### Semantic Colors
- **Success Green:** `#10B981`
- **Danger Red:** `#EF4444`
- **Warning Yellow:** `#F59E0B`
- **Info Blue:** `#3B82F6`

### Neutral Colors
- **Gray 50:** `#F9FAFB`
- **Gray 100:** `#F3F4F6`
- **Gray 300:** `#D1D5DB`
- **Gray 600:** `#4B5563`
- **Gray 800:** `#1F2937`

---

## Responsive Breakpoints

```javascript
// Tailwind CSS Breakpoints
sm: 640px    // Mobile
md: 768px    // Tablet
lg: 1024px   // Desktop
xl: 1280px   // Large Desktop
2xl: 1536px  // Extra Large
```

**Usage:**
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

---

## Best Practices

### 1. Form Validation
```jsx
const validateForm = () => {
  if (!formData.email) {
    setError('Email is required');
    return false;
  }
  if (!formData.firstName) {
    setError('First name is required');
    return false;
  }
  return true;
};
```

### 2. Error Handling
```jsx
try {
  await submitForm();
  closeModal();
  onSuccess();
} catch (err) {
  setError(err?.response?.data?.message || 'Failed to save');
}
```

### 3. Loading States
```jsx
<button disabled={loading}>
  {loading ? (
    <span className="flex items-center gap-2">
      <Spinner />
      Saving...
    </span>
  ) : (
    'Save'
  )}
</button>
```

### 4. Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input />
  <Input />
</div>
```

### 5. Accessibility
```jsx
<label htmlFor="email" className="font-medium">
  Email *
</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-label="Email address"
/>
```

---

## Summary

The admin panel uses a consistent set of reusable components built with:
- **Material Tailwind** for UI components
- **Heroicons** for icons
- **Tailwind CSS** for styling
- **React Hooks** for state management
- **Context API** for global state

All components follow Material Design principles and are fully responsive.

---

**Last Updated:** December 12, 2025  
**Version:** 1.0
