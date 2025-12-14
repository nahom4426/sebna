# Sebna Components - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Import Components

```jsx
import { Button, Input, Card, Form } from '@/components';
```

### Step 2: Use in Your Component

```jsx
function MyComponent() {
  return (
    <Card title="Welcome">
      <Input label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Step 3: View the Landing Page

Navigate to `http://localhost:5173/components` to see all components in action.

---

## 📋 Component Cheat Sheet

### Button
```jsx
<Button variant="primary" size="lg" icon="fa-rocket">
  Click Me
</Button>
```
**Variants:** primary, secondary, outline, success, danger
**Sizes:** sm, md, lg

### Input
```jsx
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter email"
  icon="fa-envelope"
  required
/>
```
**Types:** text, email, password, number, tel, date

### Select
```jsx
<Select
  label="Category"
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]}
/>
```

### Form
```jsx
<Form onSubmit={handleSubmit}>
  <Input label="Name" />
  <Input label="Email" type="email" />
</Form>
```

### Table
```jsx
<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' }
  ]}
  data={tableData}
  onRowClick={handleClick}
/>
```

### Card
```jsx
<Card 
  title="Title"
  subtitle="Subtitle"
  footer={<Button>Action</Button>}
>
  Content here
</Card>
```

### Modal
```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  Modal content
</Modal>
```

### Badge
```jsx
<Badge variant="success" icon="fa-check">
  Approved
</Badge>
```
**Variants:** primary, success, warning, danger, info

### Alert
```jsx
<Alert variant="success" title="Success!">
  Your action was successful
</Alert>
```
**Variants:** success, error, warning, info

### Textarea
```jsx
<Textarea
  label="Message"
  rows={4}
  maxLength={500}
  placeholder="Enter message"
/>
```

### Checkbox
```jsx
<Checkbox
  label="I agree to terms"
  checked={isChecked}
  onChange={handleChange}
/>
```

---

## 🎨 Common Patterns

### Form with Validation
```jsx
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  // Validate
  if (!formData.email) {
    setErrors({ email: 'Email is required' });
    return;
  }
  // Submit
};

<Form onSubmit={handleSubmit}>
  <Input
    label="Email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    error={errors.email}
    required
  />
</Form>
```

### Data Table with Modal
```jsx
const [selectedRow, setSelectedRow] = useState(null);
const [isOpen, setIsOpen] = useState(false);

const handleRowClick = (row) => {
  setSelectedRow(row);
  setIsOpen(true);
};

<>
  <Table
    columns={columns}
    data={data}
    onRowClick={handleRowClick}
  />
  <Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title={selectedRow?.name}
  >
    {selectedRow && <div>{/* Details */}</div>}
  </Modal>
</>
```

### Status Badge
```jsx
<Badge 
  variant={status === 'active' ? 'success' : 'warning'}
  icon={status === 'active' ? 'fa-check' : 'fa-clock'}
>
  {status}
</Badge>
```

---

## 🎯 Common Use Cases

### Investment Form
```jsx
<Form onSubmit={submitInvestment}>
  <Input label="Full Name" required />
  <Input label="Email" type="email" required />
  <Input label="Amount" type="number" required />
  <Select label="Category" options={categories} required />
  <Textarea label="Message" rows={4} />
  <Checkbox label="I agree to terms" required />
</Form>
```

### User List
```jsx
<Card title="Users">
  <Table
    columns={[
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { 
        key: 'status', 
        label: 'Status',
        render: (value) => (
          <Badge variant={value === 'active' ? 'success' : 'danger'}>
            {value}
          </Badge>
        )
      }
    ]}
    data={users}
  />
</Card>
```

### Notification
```jsx
{success && (
  <Alert variant="success" title="Success!">
    Your action was completed successfully
  </Alert>
)}

{error && (
  <Alert variant="error" title="Error">
    Something went wrong. Please try again.
  </Alert>
)}
```

---

## 📚 Documentation

- **Full Guide**: See `COMPONENTS_GUIDE.md`
- **Component API**: See `src/components/README.md`
- **Live Demo**: Navigate to `/components` route
- **Examples**: Check `src/pages/ComponentsLanding.jsx`

---

## 🔧 Customization

### Change Colors
Edit component files and modify the color values:
```jsx
const variants = {
  primary: 'bg-blue-900 text-white', // Change to your color
};
```

### Add Custom Variant
```jsx
const variants = {
  primary: '...',
  custom: 'bg-purple-500 text-white', // New variant
};
```

### Use with Tailwind Classes
```jsx
<Button className="w-full rounded-full">
  Full Width Button
</Button>
```

---

## ❓ FAQ

**Q: How do I import components?**
A: Use barrel import: `import { Button, Input } from '@/components';`

**Q: Can I customize colors?**
A: Yes, edit the variant objects in component files or use className prop.

**Q: Are components mobile-responsive?**
A: Yes, all components are fully responsive using Tailwind CSS.

**Q: Do components support validation?**
A: Yes, use the `error` prop to display validation messages.

**Q: Can I use components with TypeScript?**
A: Yes, PropTypes are included. Add TypeScript types as needed.

---

## 🚀 Next Steps

1. ✅ Review the components in `/components` directory
2. ✅ Visit `/components` route to see live examples
3. ✅ Read `COMPONENTS_GUIDE.md` for detailed documentation
4. ✅ Start using components in your pages
5. ✅ Customize colors and styles as needed

---

## 💡 Tips

- Use barrel imports for cleaner code
- Compose components for complex layouts
- Leverage the `className` prop for custom styling
- Check the landing page for examples
- Read PropTypes for available props

---

## 📞 Support

For detailed information, refer to:
- `COMPONENTS_GUIDE.md` - Complete guide
- `src/components/README.md` - API reference
- `/components` route - Live examples

---

Happy building! 🎉
