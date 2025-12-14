# Sebna Components Library

A comprehensive collection of reusable React components built with Tailwind CSS for the Sebna investment platform.

## Components Overview

### 1. Button Component
Versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean (default: false)
- `loading`: boolean (default: false)
- `icon`: Font Awesome icon class
- `onClick`: Click handler function
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `className`: Additional CSS classes

**Example:**
```jsx
<Button variant="primary" size="lg" icon="fa-rocket">
  Start Investing
</Button>
```

---

### 2. Input Component
Text input field with validation and icon support.

**Props:**
- `label`: Input label text
- `type`: 'text' | 'email' | 'password' | 'number' (default: 'text')
- `placeholder`: Placeholder text
- `value`: Input value
- `onChange`: Change handler function
- `error`: Error message to display
- `required`: Mark as required field
- `icon`: Font Awesome icon class
- `disabled`: Disable input
- `className`: Additional CSS classes

**Example:**
```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  icon="fa-envelope"
  required
  onChange={handleChange}
/>
```

---

### 3. Select Component
Dropdown select field with custom options.

**Props:**
- `label`: Select label text
- `options`: Array of {value, label} objects
- `value`: Selected value
- `onChange`: Change handler function
- `placeholder`: Placeholder text
- `error`: Error message
- `required`: Mark as required
- `disabled`: Disable select
- `multiple`: Allow multiple selections
- `className`: Additional CSS classes

**Example:**
```jsx
<Select
  label="Category"
  options={[
    { value: 'investment', label: 'Investment' },
    { value: 'support', label: 'Support' }
  ]}
  value={selectedValue}
  onChange={handleChange}
/>
```

---

### 4. Form Component
Wrapper component for form handling with automatic submit button.

**Props:**
- `onSubmit`: Form submission handler
- `children`: Form fields
- `loading`: Show loading state
- `submitButtonText`: Button text (default: 'Submit')
- `submitButtonVariant`: Button variant (default: 'primary')
- `showSubmitButton`: Show/hide submit button
- `className`: Additional CSS classes

**Example:**
```jsx
<Form onSubmit={handleSubmit}>
  <Input label="Name" onChange={handleChange} />
  <Input label="Email" type="email" onChange={handleChange} />
</Form>
```

---

### 5. Table Component
Data table with sorting, filtering, and row selection.

**Props:**
- `columns`: Array of column definitions [{key, label, sortable, render}]
- `data`: Array of row data
- `striped`: Alternate row colors (default: true)
- `hover`: Hover effect on rows (default: true)
- `bordered`: Show borders (default: true)
- `loading`: Show loading state
- `emptyMessage`: Message when no data
- `onRowClick`: Row click handler
- `className`: Additional CSS classes

**Example:**
```jsx
<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <Badge variant={value === 'Active' ? 'success' : 'danger'}>{value}</Badge>
    }
  ]}
  data={tableData}
  onRowClick={handleRowClick}
/>
```

---

### 6. Card Component
Container component for grouping content.

**Props:**
- `title`: Card title
- `subtitle`: Card subtitle
- `children`: Card content
- `footer`: Footer content
- `header`: Header content
- `variant`: 'default' | 'elevated' | 'outlined' (default: 'default')
- `shadow`: Show shadow (default: true)
- `onClick`: Click handler
- `className`: Additional CSS classes

**Example:**
```jsx
<Card 
  title="Investment Summary" 
  subtitle="Your portfolio overview"
  footer={<Button>View Details</Button>}
>
  <p>Card content goes here</p>
</Card>
```

---

### 7. Modal Component
Dialog component for displaying content in a modal.

**Props:**
- `isOpen`: Control modal visibility
- `onClose`: Close handler function
- `title`: Modal title
- `children`: Modal content
- `footer`: Footer content with actions
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `closeButton`: Show close button (default: true)
- `className`: Additional CSS classes

**Example:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Investment"
  footer={
    <>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

---

### 8. Badge Component
Small label component for status or tags.

**Props:**
- `variant`: 'primary' | 'success' | 'warning' | 'danger' | 'info' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `icon`: Font Awesome icon class
- `children`: Badge content
- `className`: Additional CSS classes

**Example:**
```jsx
<Badge variant="success" icon="fa-check">
  Approved
</Badge>
```

---

### 9. Alert Component
Alert/notification component with dismissible option.

**Props:**
- `variant`: 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `title`: Alert title
- `children`: Alert message
- `closeable`: Show close button (default: true)
- `icon`: Custom icon class
- `className`: Additional CSS classes

**Example:**
```jsx
<Alert variant="success" title="Success!">
  Your investment has been processed successfully.
</Alert>
```

---

### 10. Textarea Component
Multi-line text input with character count.

**Props:**
- `label`: Textarea label
- `placeholder`: Placeholder text
- `value`: Textarea value
- `onChange`: Change handler
- `error`: Error message
- `required`: Mark as required
- `rows`: Number of rows (default: 4)
- `maxLength`: Maximum character length
- `disabled`: Disable textarea
- `className`: Additional CSS classes

**Example:**
```jsx
<Textarea
  label="Message"
  placeholder="Enter your message"
  rows={5}
  maxLength={500}
  onChange={handleChange}
/>
```

---

### 11. Checkbox Component
Checkbox input with label support.

**Props:**
- `label`: Checkbox label
- `checked`: Checked state
- `onChange`: Change handler
- `error`: Error message
- `disabled`: Disable checkbox
- `className`: Additional CSS classes

**Example:**
```jsx
<Checkbox
  label="I agree to the terms and conditions"
  checked={isChecked}
  onChange={handleChange}
/>
```

---

## Usage Example

```jsx
import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Form,
  Card,
  Alert
} from '@/components';

function MyComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: ''
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
    console.log('Form submitted:', formData);
  };

  return (
    <Card title="Investment Form">
      <Alert variant="info">
        Fill out the form below to start your investment journey.
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Select
          label="Investment Type"
          name="category"
          options={[
            { value: 'education', label: 'Education' },
            { value: 'realestate', label: 'Real Estate' }
          ]}
          value={formData.category}
          onChange={handleChange}
        />
      </Form>
    </Card>
  );
}

export default MyComponent;
```

---

## Styling & Customization

All components use Tailwind CSS for styling. You can customize them by:

1. **Passing className prop**: Add additional Tailwind classes
2. **Modifying variant styles**: Edit the variant objects in component files
3. **Using CSS modules**: Import and apply custom styles

## Color Scheme

- **Primary**: Blue-900 (#1e3a8a)
- **Secondary**: Orange-600 (#ea580c)
- **Success**: Green-500 (#10b981)
- **Warning**: Yellow-500 (#f59e0b)
- **Danger**: Red-500 (#ef4444)
- **Info**: Cyan-500 (#06b6d4)

## Accessibility

All components follow WCAG accessibility guidelines:
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Sebna S.C. All rights reserved.
