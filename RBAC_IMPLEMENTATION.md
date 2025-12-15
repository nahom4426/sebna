# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the comprehensive Role-Based Access Control (RBAC) system implemented in the Sebna dashboard application. The system includes 33 distinct roles that control access to various features and admin functionalities.

## Architecture

### Core Components

#### 1. **Role Constants** (`src/constants/roles.js`)
Defines all 33 roles used throughout the application:
- User Management: `ROLE_create_user`, `ROLE_read_users`, `ROLE_update_user`, `ROLE_delete_user`, `ROLE_read_user`
- Role Management: `ROLE_create_role`, `ROLE_read_roles`, `ROLE_update_role`, `ROLE_delete_role`, `ROLE_read_role`
- Privilege Management: `ROLE_create_privilege`, `ROLE_read_privileges`, `ROLE_update_privilege`, `ROLE_delete_privilege`, `ROLE_read_privilege`
- Institution Management: `ROLE_create_institution`, `ROLE_read_institutions`, `ROLE_update_institution`, `ROLE_delete_institution`, `ROLE_read_institution`
- Post Management: `ROLE_create_post`, `ROLE_read_posts`, `ROLE_update_post`, `ROLE_delete_post`, `ROLE_read_post`, `ROLE_like_post`, `ROLE_unlike_post`
- Message Management: `ROLE_read_messages`, `ROLE_send_message`
- Comment Management: `ROLE_create_comment`, `ROLE_read_comments`, `ROLE_delete_comment`
- System Management: `ROLE_read_logs`

#### 2. **RBAC Utilities** (`src/utils/rbacUtils.js`)
Helper functions for privilege checking:
- `checkUserPrivilege()`: Checks if user has required privileges
- `checkUserRole()`: Checks if user has required role
- `isSuperAdmin()`: Identifies super admin users
- `hasAllPrivileges()`: Checks for all privileges access
- `canAccess()`: Comprehensive access check
- `formatRoleName()`: Formats role names for display

#### 3. **Protected Route** (`src/router/ProtectedRoute.jsx`)
Route wrapper that enforces RBAC:
- Checks authentication status
- Validates user privileges against required roles
- Redirects unauthorized users to dashboard
- Supports Super Admin bypass
- Generates breadcrumbs for navigation

#### 4. **Router Configuration** (`src/router/index.jsx`)
Comprehensive routing with role-based access control:
- Public routes: Landing, Sign In, Sign Up
- Protected dashboard routes: Home, Profile, Tables, Notifications
- Admin routes with specific role requirements:
  - `/admin/users` - User management
  - `/admin/roles` - Role management
  - `/admin/privileges` - Privilege management
  - `/admin/institutions` - Institution management
  - `/admin/posts` - Post management
  - `/admin/messages` - Message management
  - `/admin/comments` - Comment management
  - `/admin/logs` - System logs

#### 5. **Sidebar Navigation** (`src/components/Sidebar.jsx`)
Dynamic navigation menu that:
- Filters menu items based on user privileges
- Shows/hides admin sections based on access
- Displays all 8 admin modules with appropriate icons
- Supports collapsible admin panel
- Responsive design for mobile and desktop

## Admin Modules

### 1. Users Management (`/admin/users`)
**Required Roles:**
- `ROLE_read_users`
- `ROLE_create_user`
- `ROLE_update_user`
- `ROLE_delete_user`

**Features:**
- View all users
- Create new users
- Update user information
- Delete users

### 2. Roles Management (`/admin/roles`)
**Required Roles:**
- `ROLE_read_roles`
- `ROLE_create_role`
- `ROLE_update_role`
- `ROLE_delete_role`
- `ROLE_read_role`

**Features:**
- View all roles
- Create new roles
- Update role details
- Delete roles

### 3. Privileges Management (`/admin/privileges`)
**Required Roles:**
- `ROLE_read_privileges`
- `ROLE_create_privilege`
- `ROLE_update_privilege`
- `ROLE_delete_privilege`
- `ROLE_read_privilege`

**Features:**
- View all privileges
- Create new privileges
- Update privilege details
- Delete privileges

### 4. Institutions Management (`/admin/institutions`)
**Required Roles:**
- `ROLE_read_institutions`
- `ROLE_create_institution`
- `ROLE_update_institution`
- `ROLE_delete_institution`
- `ROLE_read_institution`

**Features:**
- View all institutions
- Create new institutions
- Update institution information
- Delete institutions

### 5. Posts Management (`/admin/posts`)
**Required Roles:**
- `ROLE_read_posts`
- `ROLE_create_post`
- `ROLE_update_post`
- `ROLE_delete_post`
- `ROLE_read_post`
- `ROLE_like_post`
- `ROLE_unlike_post`

**Features:**
- View all posts
- Create new posts
- Update post content
- Delete posts
- Like/Unlike posts

### 6. Messages Management (`/admin/messages`)
**Required Roles:**
- `ROLE_read_messages`
- `ROLE_send_message`

**Features:**
- View all messages
- Send new messages
- Message history

### 7. Comments Management (`/admin/comments`)
**Required Roles:**
- `ROLE_read_comments`
- `ROLE_create_comment`
- `ROLE_delete_comment`

**Features:**
- View all comments
- Create new comments
- Delete comments
- Moderation tools

### 8. Logs Management (`/admin/logs`)
**Required Roles:**
- `ROLE_read_logs`

**Features:**
- View system logs
- Filter logs by type (login, create, update, delete)
- Monitor user activities
- Track system changes

## Access Control Flow

```
User Request
    ↓
Authentication Check (ProtectedRoute)
    ↓
Is Authenticated? → No → Redirect to Sign In
    ↓ Yes
Is Super Admin? → Yes → Grant Access
    ↓ No
Has All Privileges? → Yes → Grant Access
    ↓ No
Check Required Roles
    ↓
Has Required Role? → Yes → Grant Access
    ↓ No
Redirect to Dashboard
```

## User Privilege Storage

User privileges are stored in the auth store with the following structure:
```javascript
{
  user: {
    firstName: string,
    roleName: string,
    privileges: [
      'ROLE_read_users',
      'ROLE_create_user',
      // ... other roles
    ]
  }
}
```

## Super Admin Access

Users with the following are granted full access:
- `roleName === 'Super Admin'`
- `privileges.includes('All Privileges')`

## Sidebar Navigation Structure

The sidebar dynamically displays:
1. **Dashboard** - Always visible
2. **Admin Panel** - Shows only if user has any admin privileges
   - Users (if has user management roles)
   - Roles (if has role management roles)
   - Privileges (if has privilege management roles)
   - Institutions (if has institution management roles)
   - Posts (if has post management roles)
   - Messages (if has message management roles)
   - Comments (if has comment management roles)
   - Logs (if has log reading role)
3. **Profile** - Always visible
4. **Tables** - Always visible
5. **Notifications** - Always visible

## Implementation Files

### Created Files
- `src/constants/roles.js` - Role constants and descriptions
- `src/utils/rbacUtils.js` - RBAC utility functions
- `src/pages/admin/comments/pages/Comments.jsx` - Comments management page
- `src/pages/admin/logs/pages/Logs.jsx` - Logs management page

### Modified Files
- `src/router/index.jsx` - Updated with comprehensive routing
- `src/router/ProtectedRoute.jsx` - Enhanced with RBAC logic
- `src/components/Sidebar.jsx` - Updated with all admin routes
- `src/pages/admin/index.js` - Added Comments and Logs exports

## Usage Examples

### Checking User Access in Components
```javascript
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';

const MyComponent = () => {
  const auth = useAuthStore((state) => state.auth);
  const userPrivileges = auth?.user?.privileges || [];

  const canCreateUser = userPrivileges.includes(ROLES.CREATE_USER);

  return (
    {canCreateUser && <CreateUserButton />}
  );
};
```

### Using RBAC Utilities
```javascript
import { canAccess } from '@/utils/rbacUtils';
import { ROLES } from '@/constants/roles';

const hasAccess = canAccess(auth, [ROLES.READ_USERS]);
```

## Testing Checklist

- [ ] Super Admin can access all routes
- [ ] Users with specific roles can access corresponding admin modules
- [ ] Users without required roles are redirected to dashboard
- [ ] Sidebar correctly filters menu items based on privileges
- [ ] All 8 admin modules load without errors
- [ ] Role-based buttons/features show/hide correctly
- [ ] Breadcrumbs generate correctly for all routes
- [ ] Mobile navigation works with role filtering

## Security Notes

1. **Frontend Validation**: This RBAC system provides frontend access control for UX
2. **Backend Validation**: Always validate privileges on the backend before processing requests
3. **Token Validation**: Ensure access tokens are validated on every API request
4. **Privilege Refresh**: Consider refreshing user privileges periodically
5. **Audit Logging**: Log all privilege-based access decisions

## Future Enhancements

- [ ] Dynamic role creation and assignment
- [ ] Granular permission management
- [ ] Role hierarchy implementation
- [ ] Audit trail for privilege changes
- [ ] Real-time privilege updates
- [ ] Role templates for quick setup
