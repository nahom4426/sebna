# Sebna Application - Routing Guide

## 🗺️ Application Routes Overview

### Route Structure

```
/                          → Components Landing Page (HOME)
├── /components           → Components Landing Page (same as /)
├── /dashboard/*          → Dashboard Section
│   ├── /dashboard/home   → Dashboard Home
│   ├── /dashboard/profile → User Profile
│   ├── /dashboard/tables → Data Tables
│   └── /dashboard/notifications → Notifications
├── /auth/*              → Authentication Section
│   ├── /auth/sign-in    → Sign In Page
│   └── /auth/sign-up    → Sign Up Page
└── *                    → Redirect to / (Home)
```

---

## 📄 File Structure

```
src/
├── App.jsx                          # Main app with routing
├── pages/
│   ├── index.js                     # Page exports
│   ├── ComponentsLanding.jsx        # Home page (displayed first)
│   ├── dashboard/
│   │   ├── index.js                 # Dashboard page exports
│   │   ├── home.jsx
│   │   ├── profile.jsx
│   │   ├── tables.jsx
│   │   └── notifications.jsx
│   └── auth/
│       ├── index.js                 # Auth page exports
│       ├── sign-in.jsx
│       └── sign-up.jsx
└── layouts/
    ├── Dashboard.jsx                # Dashboard layout
    └── Auth.jsx                     # Auth layout
```

---

## 🚀 First Page Display

When users visit the website for the first time:

1. **URL:** `http://localhost:5173/` or `http://localhost:5173/components`
2. **Page Displayed:** `ComponentsLanding.jsx`
3. **Content:** 
   - Navigation bar with links to Dashboard and Sign In
   - Components showcase
   - Interactive examples
   - Call-to-action buttons

---

## 🧭 Navigation Flow

### From Home (ComponentsLanding)

```
ComponentsLanding (/)
├── Click "Go to Dashboard" → /dashboard/home
├── Click "Sign In" → /auth/sign-in
└── Click "Dashboard" (nav) → /dashboard/home
```

### From Dashboard

```
Dashboard (/dashboard/*)
├── Home (/dashboard/home)
├── Profile (/dashboard/profile)
├── Tables (/dashboard/tables)
└── Notifications (/dashboard/notifications)
```

### From Auth

```
Auth (/auth/*)
├── Sign In (/auth/sign-in)
└── Sign Up (/auth/sign-up)
```

---

## 📝 Route Configuration

### App.jsx Routes

```jsx
<Routes>
  {/* Home page - Components Landing */}
  <Route path="/" element={<ComponentsLanding />} />
  <Route path="/components" element={<ComponentsLanding />} />
  
  {/* Dashboard pages */}
  <Route path="/dashboard/*" element={<Dashboard />} />
  
  {/* Auth pages */}
  <Route path="/auth/*" element={<Auth />} />
  
  {/* Default redirect - if no route matches, go to home */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Key Points

- **Home Page:** `/` displays `ComponentsLanding.jsx`
- **Fallback:** Any unmatched route redirects to `/`
- **Dashboard:** Uses layout wrapper for consistent UI
- **Auth:** Uses layout wrapper for authentication pages

---

## 🔗 Navigation Links

### In ComponentsLanding.jsx

**Navigation Bar (Top)**
```jsx
<Button onClick={() => navigate('/auth/sign-in')}>
  Sign In
</Button>

<Button onClick={() => navigate('/dashboard/home')}>
  Dashboard
</Button>
```

**CTA Section (Bottom)**
```jsx
<Button onClick={() => navigate('/dashboard/home')}>
  Go to Dashboard
</Button>

<Button onClick={() => navigate('/auth/sign-in')}>
  Sign In
</Button>
```

---

## 📊 Page Hierarchy

### Level 1: Root
- `/` - Components Landing (HOME PAGE)

### Level 2: Main Sections
- `/dashboard/*` - Dashboard Section
- `/auth/*` - Authentication Section
- `/components` - Components Landing (alias)

### Level 3: Subsections
- `/dashboard/home` - Dashboard Home
- `/dashboard/profile` - User Profile
- `/dashboard/tables` - Data Tables
- `/dashboard/notifications` - Notifications
- `/auth/sign-in` - Sign In
- `/auth/sign-up` - Sign Up

---

## 🎯 User Journey

### First-Time Visitor

```
1. Visit website
   ↓
2. Land on ComponentsLanding (/)
   ↓
3. View components showcase
   ↓
4. Click "Sign In" → /auth/sign-in
   ↓
5. Sign in successfully
   ↓
6. Redirect to /dashboard/home
```

### Returning User

```
1. Visit website
   ↓
2. Land on ComponentsLanding (/)
   ↓
3. Click "Dashboard" button
   ↓
4. Go to /dashboard/home
```

### Direct Navigation

```
1. Type URL directly
   ↓
2. Route to appropriate page
   ↓
3. If invalid route → redirect to /
```

---

## 🔄 Route Transitions

### Using useNavigate Hook

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  // Navigate to dashboard
  const goToDashboard = () => {
    navigate('/dashboard/home');
  };
  
  // Navigate to sign in
  const goToSignIn = () => {
    navigate('/auth/sign-in');
  };
  
  // Go back
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <>
      <button onClick={goToDashboard}>Dashboard</button>
      <button onClick={goToSignIn}>Sign In</button>
      <button onClick={goBack}>Back</button>
    </>
  );
}
```

### Using Link Component

```jsx
import { Link } from 'react-router-dom';

<Link to="/dashboard/home">Go to Dashboard</Link>
<Link to="/auth/sign-in">Sign In</Link>
```

---

## 🛡️ Protected Routes (Optional)

If you want to protect dashboard routes:

```jsx
// Create a ProtectedRoute component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  return children;
}

// Use in App.jsx
<Route 
  path="/dashboard/*" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 📱 Mobile Navigation

The ComponentsLanding page includes:
- Sticky navigation bar
- Mobile-responsive design
- Easy-to-tap buttons
- Clear navigation flow

---

## 🔍 Route Parameters

### Current Routes (No Parameters)

All current routes are simple paths without parameters.

### Adding Parameters (Future)

If you need dynamic routes:

```jsx
// Route definition
<Route path="/dashboard/user/:id" element={<UserProfile />} />

// Navigation
navigate(`/dashboard/user/${userId}`);

// Access parameter
const { id } = useParams();
```

---

## 🚨 Error Handling

### Invalid Routes

Any route that doesn't match will redirect to `/`:

```jsx
<Route path="*" element={<Navigate to="/" replace />} />
```

### Examples
- `/invalid` → redirects to `/`
- `/dashboard/invalid` → handled by Dashboard layout
- `/auth/invalid` → handled by Auth layout

---

## 📋 Checklist

- ✅ Home page displays ComponentsLanding
- ✅ Navigation bar added to home page
- ✅ Links to Dashboard and Sign In
- ✅ Routes configured in App.jsx
- ✅ Page exports organized
- ✅ Fallback redirect to home
- ✅ Mobile responsive navigation

---

## 🎯 Quick Reference

| Action | Route | Component |
|--------|-------|-----------|
| View Components | `/` or `/components` | ComponentsLanding |
| Go to Dashboard | `/dashboard/home` | Dashboard Layout |
| Sign In | `/auth/sign-in` | Auth Layout |
| Sign Up | `/auth/sign-up` | Auth Layout |
| Invalid Route | `*` | Redirect to `/` |

---

## 🔧 Customization

### Change Home Page

To change the home page, modify `App.jsx`:

```jsx
// Change this:
<Route path="/" element={<ComponentsLanding />} />

// To this:
<Route path="/" element={<Dashboard />} />
```

### Add New Route

```jsx
<Route path="/new-page" element={<NewPage />} />
```

### Add Route Parameters

```jsx
<Route path="/user/:id" element={<UserPage />} />
```

---

## 📚 Related Files

- `src/App.jsx` - Main routing configuration
- `src/pages/index.js` - Page exports
- `src/pages/ComponentsLanding.jsx` - Home page
- `src/layouts/Dashboard.jsx` - Dashboard layout
- `src/layouts/Auth.jsx` - Auth layout

---

## 🎓 Learning Resources

- [React Router Documentation](https://reactrouter.com/)
- `QUICK_START.md` - Quick start guide
- `COMPONENTS_GUIDE.md` - Components guide
- `/components` - Live component examples

---

## Summary

✅ **Home Page:** ComponentsLanding displays first
✅ **Navigation:** Clear links to Dashboard and Auth
✅ **Routes:** All configured and working
✅ **Fallback:** Invalid routes redirect to home
✅ **Mobile:** Responsive navigation included

The application is now set up with proper routing! 🚀
