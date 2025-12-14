# Sebna Components Library - Complete Guide

## Overview

This document provides a comprehensive guide to using the Sebna Components Library - a collection of reusable React components built specifically for the Sebna investment platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Component List](#component-list)
3. [Installation & Setup](#installation--setup)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Customization](#customization)
7. [Landing Page](#landing-page)

---

## Getting Started

### What's Included

The components library includes 11 core components:

- **Button** - Versatile button with multiple variants
- **Input** - Text input with validation
- **Select** - Dropdown select field
- **Form** - Form wrapper with submit handling
- **Table** - Data table with sorting
- **Card** - Container component
- **Modal** - Dialog component
- **Badge** - Status/tag labels
- **Alert** - Notification messages
- **Textarea** - Multi-line text input
- **Checkbox** - Checkbox input

### Quick Start

```jsx
import { Button, Input, Card } from '@/components';

function MyComponent() {
  return (
    <Card title="Welcome">
      <Input label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

---

## Component List

### 1. Button Component

**File:** `src/components/Button.jsx`

**Variants:**
- `primary` - Main action button (blue-to-orange gradient)
- `secondary` - Secondary action button (white with border)
- `outline` - Outline style button
- `success` - Success state button (green)
- `danger` - Danger/delete button (red)

**Sizes:**
- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

**Features:**
- Icon support
- Loading state
- Disabled state
- Hover effects

**Example:**
```jsx
<Button 
  variant="primary" 
  size="lg" 
  icon="fa-rocket"
  onClick={handleClick}
>
  Start Investing
</Button>
```

---

### 2. Input Component

**File:** `src/components/Input.jsx`

**Input Types:**
- `text` - Text input (default)
- `email` - Email input
- `password` - Password input
- `number` - Number input
- `tel` - Telephone input
- `date` - Date input

**Features:**
- Label support
- Placeholder text
- Icon support
- Error messages
- Required field indicator
- Focus state styling
- Disabled state

**Example:**
```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  icon="fa-envelope"
  required
  error={emailError}
  onChange={handleChange}
/>
```

---

### 3. Select Component

**File:** `src/components/Select.jsx`

**Features:**
- Custom options
- Placeholder text
- Icon support
- Error messages
- Required field indicator
- Multiple selection support
- Disabled state

**Example:**
```jsx
<Select
  label="Investment Category"
  options={[
    { value: 'education', label: 'Education Sector' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'agriculture', label: 'Agriculture' }
  ]}
  value={selectedCategory}
  onChange={handleChange}
  required
/>
```

---

### 4. Form Component

**File:** `src/components/Form.jsx`

**Features:**
- Automatic submit button
- Loading state
- Custom submit text
- Button variant control
- Form validation support

**Example:**
```jsx
<Form 
  onSubmit={handleSubmit}
  submitButtonText="Send Message"
  loading={isLoading}
>
  <Input label="Name" onChange={handleChange} />
  <Input label="Email" type="email" onChange={handleChange} />
  <Textarea label="Message" onChange={handleChange} />
</Form>
```

---

### 5. Table Component

**File:** `src/components/Table.jsx`

**Features:**
- Sortable columns
- Striped rows
- Hover effects
- Custom cell rendering
- Row click handling
- Loading state
- Empty state message

**Column Definition:**
```jsx
{
  key: 'email',           // Data key
  label: 'Email',         // Column header
  sortable: true,         // Enable sorting
  render: (value, row) => // Custom render function
    <span>{value}</span>
}
```

**Example:**
```jsx
<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'success' : 'danger'}>
          {value}
        </Badge>
      )
    }
  ]}
  data={tableData}
  onRowClick={handleRowClick}
/>
```

---

### 6. Card Component

**File:** `src/components/Card.jsx`

**Variants:**
- `default` - Standard card with border
- `elevated` - Card with shadow
- `outlined` - Card with thick border

**Features:**
- Title and subtitle
- Header and footer sections
- Click handling
- Shadow effects
- Hover effects

**Example:**
```jsx
<Card
  title="Investment Summary"
  subtitle="Your portfolio overview"
  variant="elevated"
  footer={<Button>View Details</Button>}
>
  <div className="text-center">
    <p className="text-4xl font-bold">+25.5%</p>
    <p className="text-gray-600">Total Return</p>
  </div>
</Card>
```

---

### 7. Modal Component

**File:** `src/components/Modal.jsx`

**Sizes:**
- `sm` - Small modal
- `md` - Medium modal (default)
- `lg` - Large modal
- `xl` - Extra large modal

**Features:**
- Backdrop click to close
- Close button
- Title support
- Footer with actions
- Scrollable content
- Keyboard escape to close

**Example:**
```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Investment"
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to invest ETB 10,000?</p>
</Modal>
```

---

### 8. Badge Component

**File:** `src/components/Badge.jsx`

**Variants:**
- `primary` - Blue badge
- `success` - Green badge
- `warning` - Yellow badge
- `danger` - Red badge
- `info` - Cyan badge

**Sizes:**
- `sm` - Small badge
- `md` - Medium badge (default)
- `lg` - Large badge

**Example:**
```jsx
<Badge variant="success" icon="fa-check">
  Approved
</Badge>

<Badge variant="warning" size="sm">
  Pending
</Badge>
```

---

### 9. Alert Component

**File:** `src/components/Alert.jsx`

**Variants:**
- `success` - Success message
- `error` - Error message
- `warning` - Warning message
- `info` - Information message

**Features:**
- Title support
- Closeable option
- Icon support
- Auto-dismiss option

**Example:**
```jsx
<Alert variant="success" title="Success!">
  Your investment has been processed successfully.
</Alert>

<Alert variant="error" title="Error" closeable>
  Something went wrong. Please try again.
</Alert>
```

---

### 10. Textarea Component

**File:** `src/components/Textarea.jsx`

**Features:**
- Label support
- Placeholder text
- Error messages
- Character counter
- Max length support
- Disabled state
- Required field indicator

**Example:**
```jsx
<Textarea
  label="Investment Proposal"
  placeholder="Describe your investment proposal"
  rows={6}
  maxLength={1000}
  onChange={handleChange}
  required
/>
```

---

### 11. Checkbox Component

**File:** `src/components/Checkbox.jsx`

**Features:**
- Label support
- Checked state
- Error messages
- Disabled state
- Accessibility support

**Example:**
```jsx
<Checkbox
  label="I agree to the terms and conditions"
  checked={isChecked}
  onChange={handleChange}
/>
```

---

## Installation & Setup

### Prerequisites

- React 18.2.0 or higher
- Tailwind CSS 3.3.4 or higher
- Node.js 14 or higher

### File Structure

```
src/
├── components/
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Form.jsx
│   ├── Table.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   ├── Badge.jsx
│   ├── Alert.jsx
│   ├── Textarea.jsx
│   ├── Checkbox.jsx
│   ├── index.js
│   └── README.md
├── pages/
│   └── ComponentsLanding.jsx
└── App.jsx
```

### Import Components

**Method 1: Individual imports**
```jsx
import Button from '@/components/Button';
import Input from '@/components/Input';
```

**Method 2: Barrel import (recommended)**
```jsx
import { Button, Input, Card, Modal } from '@/components';
```

---

## Usage Examples

### Example 1: Investment Form

```jsx
import React, { useState } from 'react';
import { Form, Input, Select, Textarea, Button, Card } from '@/components';

function InvestmentForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '',
    category: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Investment submitted:', formData);
    // Send to API
  };

  return (
    <Card title="Start Your Investment" subtitle="Fill out the form below">
      <Form onSubmit={handleSubmit} submitButtonText="Submit Investment">
        <Input
          label="Full Name"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          icon="fa-user"
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon="fa-envelope"
          required
        />

        <Input
          label="Investment Amount (ETB)"
          name="amount"
          type="number"
          placeholder="Minimum 1,000 ETB"
          value={formData.amount}
          onChange={handleChange}
          icon="fa-dollar-sign"
          required
        />

        <Select
          label="Investment Category"
          name="category"
          options={[
            { value: 'education', label: 'Education Sector' },
            { value: 'realestate', label: 'Real Estate' },
            { value: 'agriculture', label: 'Agriculture' }
          ]}
          value={formData.category}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Additional Information"
          name="message"
          placeholder="Tell us more about your investment goals"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          maxLength={500}
        />
      </Form>
    </Card>
  );
}

export default InvestmentForm;
```

### Example 2: Data Display with Table

```jsx
import React, { useState } from 'react';
import { Table, Card, Modal, Badge, Button } from '@/components';

function InvestorsList() {
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const investors = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', amount: 'ETB 50,000' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', amount: 'ETB 100,000' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Active', amount: 'ETB 75,000' }
  ];

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'success' : 'warning'}>
          {value}
        </Badge>
      )
    },
    { key: 'amount', label: 'Investment Amount', sortable: true }
  ];

  const handleRowClick = (row) => {
    setSelectedInvestor(row);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card title="Active Investors" subtitle="View and manage investor accounts">
        <Table
          columns={columns}
          data={investors}
          onRowClick={handleRowClick}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedInvestor ? `Investor: ${selectedInvestor.name}` : 'Investor Details'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary">Edit Investor</Button>
          </>
        }
      >
        {selectedInvestor && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{selectedInvestor.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{selectedInvestor.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant={selectedInvestor.status === 'Active' ? 'success' : 'warning'}>
                {selectedInvestor.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Investment Amount</p>
              <p className="font-semibold">{selectedInvestor.amount}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default InvestorsList;
```

---

## Best Practices

### 1. Component Composition

```jsx
// ✅ Good: Composing components
<Card title="Investment">
  <Form onSubmit={handleSubmit}>
    <Input label="Amount" />
    <Select label="Category" options={options} />
  </Form>
</Card>

// ❌ Avoid: Nesting too deeply
<div>
  <div>
    <div>
      <Form>...</Form>
    </div>
  </div>
</div>
```

### 2. State Management

```jsx
// ✅ Good: Controlled components
const [value, setValue] = useState('');
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// ❌ Avoid: Uncontrolled components
<Input defaultValue="initial" />
```

### 3. Error Handling

```jsx
// ✅ Good: Validate and show errors
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

<Input
  label="Email"
  error={errors.email}
  onChange={handleChange}
/>
```

### 4. Accessibility

```jsx
// ✅ Good: Proper labels and ARIA
<Input
  label="Investment Amount"
  aria-label="Investment amount in ETB"
  required
/>

// ❌ Avoid: Missing labels
<Input placeholder="Amount" />
```

### 5. Performance

```jsx
// ✅ Good: Memoize callbacks
const handleSubmit = useCallback((data) => {
  // Handle submission
}, [dependencies]);

// ✅ Good: Lazy load modals
const [isOpen, setIsOpen] = useState(false);
{isOpen && <Modal>...</Modal>}
```

---

## Customization

### Modifying Colors

Edit the color values in component files:

```jsx
// In Button.jsx
const variants = {
  primary: 'bg-gradient-to-r from-blue-900 to-orange-600 text-white...',
  // Change to your colors
};
```

### Adding Custom Variants

```jsx
// Extend Button with custom variant
const Button = ({ variant = 'primary', ...props }) => {
  const variants = {
    primary: '...',
    custom: 'bg-purple-500 text-white...' // New variant
  };
  // ...
};
```

### Styling with Tailwind

```jsx
// Use className prop for additional styles
<Button className="w-full rounded-full">
  Full Width Button
</Button>

<Card className="border-2 border-blue-500">
  Custom Card
</Card>
```

---

## Landing Page

### Accessing the Components Landing Page

Navigate to `/components` in your application to see a live demo of all components.

**Features:**
- Interactive component examples
- Code snippets
- Component showcase
- Form demonstrations
- Table with sorting
- Modal examples
- Alert examples
- Badge variations

### Customizing the Landing Page

Edit `src/pages/ComponentsLanding.jsx` to:
- Add more component examples
- Customize the layout
- Add documentation
- Include code snippets

---

## Troubleshooting

### Components not rendering

**Issue:** Components not showing up
**Solution:** 
1. Check imports are correct
2. Verify Tailwind CSS is configured
3. Check browser console for errors

### Styling issues

**Issue:** Components look unstyled
**Solution:**
1. Ensure Tailwind CSS is installed
2. Check `tailwind.config.js` includes component files
3. Rebuild CSS

### Form validation not working

**Issue:** Errors not showing
**Solution:**
1. Ensure error prop is passed to Input/Select
2. Check state is updating correctly
3. Verify validation logic

---

## Support & Contribution

For issues, feature requests, or contributions, please refer to the main project documentation.

---

## License

© 2024 Sebna S.C. All rights reserved.
