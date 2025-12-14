# Sebna Components - Hierarchy & Relationships

## 📊 Component Hierarchy

```
Components Library
│
├── Form Components (Input/Output)
│   ├── Button
│   │   ├── Variants: primary, secondary, outline, success, danger
│   │   ├── Sizes: sm, md, lg
│   │   └── States: normal, loading, disabled
│   │
│   ├── Input
│   │   ├── Types: text, email, password, number, tel, date
│   │   ├── Features: label, placeholder, icon, error, required
│   │   └── States: normal, focused, error, disabled
│   │
│   ├── Select
│   │   ├── Features: options, placeholder, icon, error, required
│   │   ├── Modes: single, multiple
│   │   └── States: normal, focused, error, disabled
│   │
│   ├── Textarea
│   │   ├── Features: label, placeholder, error, required
│   │   ├── Options: rows, maxLength, character counter
│   │   └── States: normal, focused, error, disabled
│   │
│   ├── Checkbox
│   │   ├── Features: label, error
│   │   └── States: checked, unchecked, disabled
│   │
│   └── Form (Wrapper)
│       ├── Contains: Input, Select, Textarea, Checkbox
│       ├── Features: auto submit button, loading state
│       └── Handlers: onSubmit
│
├── Display Components (Content)
│   ├── Card
│   │   ├── Variants: default, elevated, outlined
│   │   ├── Sections: header, title, content, footer
│   │   └── Features: shadow, hover effects
│   │
│   ├── Badge
│   │   ├── Variants: primary, success, warning, danger, info
│   │   ├── Sizes: sm, md, lg
│   │   └── Features: icon support
│   │
│   ├── Alert
│   │   ├── Variants: success, error, warning, info
│   │   ├── Features: title, closeable, icon
│   │   └── States: visible, dismissed
│   │
│   └── Table
│       ├── Features: sortable columns, striped rows, hover
│       ├── Rendering: custom cell render functions
│       ├── Interactions: row click, sorting
│       └── States: loading, empty
│
└── Container Components (Layout)
    ├── Modal
    │   ├── Sizes: sm, md, lg, xl
    │   ├── Sections: header, content, footer
    │   ├── Features: close button, backdrop click
    │   └── States: open, closed
    │
    └── Form (as container)
        └── Contains: all form components
```

---

## 🔗 Component Relationships

### Form Workflow
```
Form (Container)
  ├── Input (Text fields)
  ├── Select (Dropdowns)
  ├── Textarea (Long text)
  ├── Checkbox (Agreements)
  └── Button (Submit) - Auto-generated
```

### Data Display Workflow
```
Card (Container)
  ├── Title & Subtitle
  ├── Content
  │   └── Table (Data)
  │       └── Badge (Status in cells)
  └── Footer
      └── Button (Actions)
```

### Notification Workflow
```
Alert (Notification)
  ├── Icon (Auto or custom)
  ├── Title
  ├── Message
  └── Close Button (Optional)
```

### Modal Workflow
```
Modal (Container)
  ├── Header
  │   ├── Title
  │   └── Close Button
  ├── Content
  │   └── Any component (Form, Card, etc.)
  └── Footer
      └── Buttons (Actions)
```

---

## 📦 Component Composition Examples

### Simple Form
```
Form
├── Input (Name)
├── Input (Email)
└── Button (Submit) [Auto]
```

### Investment Form
```
Form
├── Input (Full Name)
├── Input (Email)
├── Input (Amount)
├── Select (Category)
├── Textarea (Message)
├── Checkbox (Agreement)
└── Button (Submit) [Auto]
```

### Data Dashboard
```
Card
├── Title: "Investors"
├── Table
│   ├── Column: Name
│   ├── Column: Email
│   ├── Column: Status (Badge)
│   └── Column: Amount
└── Footer
    └── Button (View More)
```

### Confirmation Dialog
```
Modal
├── Title: "Confirm Investment"
├── Content
│   └── Alert (Warning)
└── Footer
    ├── Button (Cancel)
    └── Button (Confirm)
```

---

## 🎯 Component Dependencies

### No Dependencies
- Button
- Badge
- Alert
- Checkbox

### Minimal Dependencies
- Input (standalone)
- Select (standalone)
- Textarea (standalone)

### Container Dependencies
- Form (contains: Input, Select, Textarea, Checkbox, Button)
- Card (can contain: any component)
- Modal (can contain: any component)
- Table (uses: Badge for status cells)

### Composition Dependencies
- Landing Page (uses: all components)

---

## 🔄 Data Flow

### Form Component Flow
```
User Input
    ↓
Input/Select/Textarea onChange
    ↓
State Update
    ↓
Form onSubmit
    ↓
Validation
    ↓
API Call / Action
```

### Table Component Flow
```
Data Array
    ↓
Column Definition
    ↓
Sorting/Filtering
    ↓
Render Rows
    ↓
Row Click
    ↓
Handler (e.g., Open Modal)
```

### Modal Component Flow
```
State (isOpen)
    ↓
Modal Renders
    ↓
User Interaction
    ↓
onClose Handler
    ↓
State Update
    ↓
Modal Closes
```

---

## 🎨 Styling Hierarchy

### Color System
```
Primary Colors
├── Primary: Blue-900
├── Secondary: Orange-600
└── Neutral: Gray scale

Status Colors
├── Success: Green-500
├── Warning: Yellow-500
├── Danger: Red-500
└── Info: Cyan-500
```

### Size System
```
Spacing
├── xs: 0.25rem
├── sm: 0.5rem
├── md: 1rem
├── lg: 1.5rem
├── xl: 2rem
├── 2xl: 3rem
├── 3xl: 4rem
└── 4xl: 6rem

Component Sizes
├── Button: sm, md, lg
├── Badge: sm, md, lg
└── Modal: sm, md, lg, xl
```

### Typography
```
Font Family: Inter (system fallback)

Font Weights
├── 400: Regular
├── 500: Medium
├── 600: Semibold
├── 700: Bold
├── 800: Extra Bold
└── 900: Black

Font Sizes
├── xs: 0.75rem
├── sm: 0.875rem
├── base: 1rem
├── lg: 1.125rem
├── xl: 1.25rem
├── 2xl: 1.5rem
├── 3xl: 1.875rem
├── 4xl: 2.25rem
└── 5xl: 3rem
```

---

## 🔀 Component Variants

### Button Variants
```
Button
├── primary (Blue-Orange gradient)
├── secondary (White with border)
├── outline (Transparent with border)
├── success (Green)
└── danger (Red)
```

### Card Variants
```
Card
├── default (Border only)
├── elevated (With shadow)
└── outlined (Thick border)
```

### Badge Variants
```
Badge
├── primary (Blue)
├── success (Green)
├── warning (Yellow)
├── danger (Red)
└── info (Cyan)
```

### Alert Variants
```
Alert
├── success (Green)
├── error (Red)
├── warning (Yellow)
└── info (Blue)
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
```
- Single column layouts
- Full-width components
- Stacked form fields
- Scrollable tables
- Full-screen modals
```

### Tablet (768px - 1024px)
```
- Two column layouts
- Optimized spacing
- Responsive tables
- Medium modals
```

### Desktop (> 1024px)
```
- Multi-column layouts
- Full spacing
- Sortable tables
- Standard modals
```

---

## 🎯 Use Case Mapping

### Investment Form
```
Form
├── Input (Name)
├── Input (Email)
├── Input (Amount)
├── Select (Category)
├── Textarea (Message)
├── Checkbox (Agreement)
└── Button (Submit)
```

### Investor Dashboard
```
Card
├── Table (Investors)
│   └── Badge (Status)
└── Button (Actions)
```

### Confirmation Dialog
```
Modal
├── Alert (Message)
├── Form (Optional)
└── Button (Confirm/Cancel)
```

### Notification System
```
Alert (Success/Error/Warning)
├── Title
├── Message
└── Close Button
```

---

## 🔧 Customization Points

### Per Component
```
Button
├── variant (5 options)
├── size (3 options)
├── icon (any Font Awesome)
└── className (custom styles)

Input
├── type (6 options)
├── icon (any Font Awesome)
├── error (custom message)
└── className (custom styles)

Card
├── variant (3 options)
├── shadow (boolean)
└── className (custom styles)
```

### Global
```
Colors (Edit in components)
├── Primary
├── Secondary
├── Success
├── Warning
├── Danger
└── Info

Spacing (Tailwind config)
├── Padding
├── Margin
├── Gap
└── Sizing

Typography (Tailwind config)
├── Font family
├── Font sizes
├── Font weights
└── Line heights
```

---

## 📊 Component Complexity

### Simple (Single Purpose)
- Button
- Badge
- Checkbox
- Alert

### Medium (Multiple Features)
- Input
- Select
- Textarea
- Card

### Complex (Multiple Interactions)
- Form
- Table
- Modal

---

## 🚀 Implementation Order

### Phase 1: Basic Components
1. Button
2. Input
3. Select
4. Badge

### Phase 2: Form Components
5. Textarea
6. Checkbox
7. Form

### Phase 3: Display Components
8. Card
9. Alert

### Phase 4: Advanced Components
10. Table
11. Modal

### Phase 5: Integration
12. Landing Page
13. Routes

---

## 🎓 Learning Path

### Beginner
- Button
- Input
- Card

### Intermediate
- Select
- Textarea
- Badge
- Alert

### Advanced
- Form
- Table
- Modal
- Composition

---

## 📈 Scalability

### Adding New Components
```
1. Create component file
2. Add PropTypes
3. Export from index.js
4. Add to landing page
5. Document in README
```

### Extending Existing Components
```
1. Add new variant
2. Update PropTypes
3. Test thoroughly
4. Update documentation
```

### Customizing Styles
```
1. Modify color values
2. Adjust spacing
3. Update typography
4. Test responsiveness
```

---

## 🔐 Component Stability

### Stable (No Changes Expected)
- Button
- Input
- Select
- Badge
- Alert

### Stable (Minor Updates)
- Card
- Textarea
- Checkbox
- Form

### Stable (Enhancement Ready)
- Table
- Modal

---

## 📝 Summary

The Sebna Components Library is organized into:

1. **Form Components** - For user input
2. **Display Components** - For content display
3. **Container Components** - For layout

All components are:
- ✅ Reusable
- ✅ Customizable
- ✅ Well-documented
- ✅ Production-ready
- ✅ Accessible
- ✅ Responsive

Start with simple components and build up to complex compositions! 🚀
