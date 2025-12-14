# Share Companies Platform - Database Schema

## Project Overview

This is a parent website for multiple share companies with 3 user roles and a public landing page.

### System Components:
1. **Super Admin** - Platform administrator managing all institutions
2. **Company Admin** - Institution administrator managing their company
3. **Company Users** - Institution members who view and interact with content
4. **Public Landing Page** - Displays Super Admin posts to everyone

---

## Database Tables

### 1. **users**
Stores all user accounts in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| userUuid | UUID | PRIMARY KEY | Unique user identifier |
| institutionId | UUID | FK → institutions.id | NULL for Super Admin |
| roleUuid | UUID | FK → roles.id | User's assigned role |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| title | VARCHAR(100) | | Job title or position |
| firstName | VARCHAR(100) | NOT NULL | First name |
| fatherName | VARCHAR(100) | | Father's name |
| grandFatherName | VARCHAR(100) | | Grandfather's name |
| gender | ENUM('male', 'female', 'other') | | User gender |
| mobilePhone | VARCHAR(20) | | Contact phone number |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Account status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Indexes:**
- email (UNIQUE)
- institutionId
- roleUuid
- status

---

### 2. **institutions**
Represents share company institutions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| institutionId | UUID | PRIMARY KEY | Unique institution identifier |
| name | VARCHAR(255) | NOT NULL | Company name |
| logo | VARCHAR(500) | | Logo URL |
| website | VARCHAR(255) | | Public website URL |
| description | TEXT | | Company description |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Institution status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Indexes:**
- name
- status

---

### 3. **roles**
Defines user roles in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| roleUuid | UUID | PRIMARY KEY | Unique role identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Role name (super_admin, company_admin, company_user) |
| description | TEXT | | Role description |
| scope | ENUM('global', 'institution') | | Role scope |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Role status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Predefined Roles:**
- `super_admin` - Full platform access
- `company_admin` - Institution-level admin
- `company_user` - Regular institution member

---

### 4. **privileges**
Defines system permissions/capabilities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| privilegeId | UUID | PRIMARY KEY | Unique privilege identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Privilege name (e.g., CREATE_USER, DELETE_POST) |
| description | TEXT | | Privilege description |
| scope | ENUM('global', 'institution') | | Privilege scope |
| status | ENUM('active', 'inactive') | DEFAULT 'active' | Privilege status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Example Privileges:**
- CREATE_USER
- DELETE_USER
- UPDATE_USER
- CREATE_POST
- DELETE_POST
- MANAGE_INSTITUTION
- VIEW_ANALYTICS

---

### 5. **role_privileges**
Many-to-many relationship between roles and privileges.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rolePrivilegeId | UUID | PRIMARY KEY | Unique identifier |
| roleUuid | UUID | FK → roles.id | Role reference |
| privilegeId | UUID | FK → privileges.id | Privilege reference |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Indexes:**
- (roleUuid, privilegeId) - UNIQUE

---

### 6. **posts**
User-generated content (news, announcements).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| postId | UUID | PRIMARY KEY | Unique post identifier |
| institutionId | UUID | FK → institutions.id | NULL = Super Admin post (public) |
| userId | UUID | FK → users.id | Post author |
| title | VARCHAR(255) | NOT NULL | Post title |
| content | TEXT | NOT NULL | Post content |
| image | VARCHAR(500) | | Post image URL |
| status | ENUM('published', 'draft', 'archived') | DEFAULT 'published' | Post status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Indexes:**
- institutionId
- userId
- status
- createdAt (DESC)

---

### 7. **comments**
Comments on posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| commentId | UUID | PRIMARY KEY | Unique comment identifier |
| postId | UUID | FK → posts.id | Referenced post |
| userId | UUID | FK → users.id | Comment author |
| comment | TEXT | NOT NULL | Comment text |
| status | ENUM('active', 'deleted') | DEFAULT 'active' | Comment status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updatedAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Indexes:**
- postId
- userId
- status

---

### 8. **likes**
Likes on posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| likeId | UUID | PRIMARY KEY | Unique like identifier |
| postId | UUID | FK → posts.id | Liked post |
| userId | UUID | FK → users.id | User who liked |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Indexes:**
- (postId, userId) - UNIQUE (prevent duplicate likes)

---

### 9. **messages**
Direct messages between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| messageId | UUID | PRIMARY KEY | Unique message identifier |
| senderId | UUID | FK → users.id | Message sender |
| receiverId | UUID | FK → users.id | Message recipient |
| content | TEXT | NOT NULL | Message content |
| isRead | BOOLEAN | DEFAULT FALSE | Read status |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Indexes:**
- senderId
- receiverId
- (senderId, receiverId)
- isRead

---

## Access Control Rules

### Super Admin
- ✅ Create/Edit/Delete institutions
- ✅ Create/Edit/Delete all users
- ✅ Create/Edit/Delete roles and privileges
- ✅ Post to public landing page (institutionId = NULL)
- ✅ View all analytics

### Company Admin
- ✅ Post news for their institution
- ✅ Create/Edit/Delete users within their institution
- ✅ Respond to user messages
- ❌ Cannot create institutions
- ❌ Cannot manage other institutions
- ❌ Cannot post to public landing page

### Company User
- ✅ View posts from their institution admin
- ✅ Like and comment on posts
- ✅ Send messages to admin or other users
- ❌ Cannot create posts
- ❌ Cannot manage users

---

## Key Relationships

```
institutions (1) ──── (N) users
            └─────── (N) posts

roles (1) ──── (N) users
      └─── (N) role_privileges ──── (N) privileges

users (1) ──── (N) posts
      ├──── (N) comments
      ├──── (N) likes
      ├──── (N) messages (as sender)
      └──── (N) messages (as receiver)

posts (1) ──── (N) comments
      └──── (N) likes
```

---

## API Endpoints Structure

### Users
- `GET /users/all` - List all users (paginated)
- `GET /users/{id}` - Get user details
- `POST /users/signup` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `PUT /users/{id}/status` - Change user status

### Institutions
- `GET /institutions/all` - List all institutions (paginated)
- `GET /institutions/{id}` - Get institution details
- `POST /institutions` - Create new institution
- `PUT /institutions/{id}` - Update institution
- `DELETE /institutions/{id}` - Delete institution

### Roles
- `GET /role/getAll` - List all roles
- `GET /role/{id}` - Get role details
- `POST /role` - Create new role
- `PUT /role/{id}` - Update role
- `DELETE /role/{id}` - Delete role

### Privileges
- `GET /privilege/list` - List all privileges
- `GET /privilege/{id}` - Get privilege details
- `POST /privilege` - Create new privilege
- `PUT /privilege/{id}` - Update privilege
- `DELETE /privilege/{id}` - Delete privilege

### Posts
- `GET /posts` - List posts (with institution filter)
- `GET /posts/{id}` - Get post details
- `POST /posts` - Create new post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post

### Comments
- `GET /posts/{postId}/comments` - List comments
- `POST /posts/{postId}/comments` - Add comment
- `DELETE /comments/{id}` - Delete comment

### Likes
- `POST /posts/{postId}/like` - Like a post
- `DELETE /posts/{postId}/unlike` - Unlike a post

### Messages
- `GET /messages` - List messages
- `POST /messages` - Send message
- `GET /messages/{id}` - Get message details

---

## Notes

- All UUIDs should be generated server-side
- All timestamps are in UTC
- Soft deletes can be implemented using `status` field instead of hard deletes
- Consider adding audit logs for sensitive operations
- Implement row-level security for institution data
- Use database transactions for multi-table operations
