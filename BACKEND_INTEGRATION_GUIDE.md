# Backend Integration Guide - Facebook-Like Post System

## Overview
This document describes the complete integration of the backend Facebook-like post system with the React frontend. The system includes posts, comments, likes, and image uploads with full RBAC support.

## Architecture

### API Service Layer

#### Posts API (`src/pages/admin/posts/api/PostsApi.js`)
```javascript
// Endpoints
- getAllPosts(page, limit) - GET /api/v1/posts
- getInstitutionPosts(institutionId, page, limit) - GET /api/v1/posts/institution/{id}
- getUserPosts(userId, page, limit) - GET /api/v1/posts/user/{id}
- getPostById(id) - GET /api/v1/posts/{id}
- createPost(data) - POST /api/v1/posts (multipart/form-data)
- updatePostById(id, data) - PUT /api/v1/posts/{id}
- removePostById(id) - DELETE /api/v1/posts/{id}
```

#### Comments API (`src/pages/admin/comments/api/CommentsApi.js`)
```javascript
// Endpoints
- getPostComments(postId, page, limit) - GET /api/v1/comments/post/{postId}
- getCommentById(id) - GET /api/v1/comments/{id}
- createComment(data) - POST /api/v1/comments
- updateCommentById(id, data) - PUT /api/v1/comments/{id}
- deleteCommentById(id) - DELETE /api/v1/comments/{id}
```

#### Likes API (`src/pages/admin/posts/api/LikesApi.js`)
```javascript
// Endpoints
- getPostLikes(postId, page, limit) - GET /api/v1/likes/post/{postId}
- getPostLikeCount(postId) - GET /api/v1/likes/post/{postId}/count
- checkIfUserLiked(postId) - GET /api/v1/likes/post/{postId}/user-liked
- toggleLike(postId) - POST /api/v1/likes/post/{postId}/toggle
```

### Custom Hooks

#### usePosts Hook (`src/hooks/usePosts.js`)
Manages post data fetching and mutations:
```javascript
const {
  posts,           // Array of posts
  loading,         // Loading state
  error,           // Error message
  totalPages,      // Total pages for pagination
  totalElements,   // Total number of posts
  fetchPosts,      // Refetch posts
  createNewPost,   // Create post
  updatePost,      // Update post
  deletePost,      // Delete post
} = usePosts(page, limit);
```

#### useComments Hook (`src/hooks/useComments.js`)
Manages comment data fetching and mutations:
```javascript
const {
  comments,        // Array of comments
  loading,         // Loading state
  error,           // Error message
  totalPages,      // Total pages
  totalElements,   // Total comments
  fetchComments,   // Refetch comments
  addComment,      // Add comment
  updateComment,   // Update comment
  deleteComment,   // Delete comment
} = useComments(postId, page, limit);
```

#### useLikes Hook (`src/hooks/useLikes.js`)
Manages like data and toggle functionality:
```javascript
const {
  likes,           // Array of users who liked
  likeCount,       // Total like count
  isLiked,         // Whether current user liked
  loading,         // Loading state
  error,           // Error message
  fetchLikeData,   // Refetch like data
  togglePostLike,  // Toggle like
} = useLikes(postId);
```

## Frontend Components

### Posts Page (`src/pages/admin/posts/pages/Posts.jsx`)

**Features:**
- Create posts with optional image upload
- Display paginated posts feed
- Like/unlike posts
- View and add comments
- Image preview before upload
- Loading states and error handling
- Role-based action visibility

**Key Functions:**
```javascript
handleCreatePost()      // Create new post with image
handleImageUpload()     // Handle image file upload
toggleComments()        // Expand/collapse comments section
```

**State Management:**
```javascript
newPostContent          // Post text content
newPostImage           // Image preview (base64)
newPostImageFile       // Actual image file
expandedComments       // Track which posts have comments open
creatingPost           // Loading state for post creation
postError              // Error messages
```

### Post Card Component
Reusable component for displaying individual posts:
- Post header with author and timestamp
- Post content and image
- Engagement metrics (views, likes, comments)
- Like button with toggle functionality
- Comment button with expandable section
- Share button (placeholder)
- Comments list with add comment form

## Data Flow

### Creating a Post
```
User Input
  ↓
handleCreatePost()
  ↓
createNewPost(data)
  ↓
PostsApi.createPost()
  ↓
Backend: POST /api/v1/posts
  ↓
Response: PostResponse
  ↓
Update posts state
  ↓
Clear form and image
```

### Liking a Post
```
User clicks Like
  ↓
handleLike()
  ↓
togglePostLike()
  ↓
LikesApi.toggleLike()
  ↓
Backend: POST /api/v1/likes/post/{id}/toggle
  ↓
Update isLiked and likeCount
```

### Adding a Comment
```
User submits comment
  ↓
handleAddComment()
  ↓
addComment(content)
  ↓
CommentsApi.createComment()
  ↓
Backend: POST /api/v1/comments
  ↓
Update comments list
  ↓
Clear input field
```

## Image Handling

### Upload Process
1. User selects image file
2. File size validation (max 5MB)
3. Create FileReader for preview
4. Store both preview (base64) and file
5. Send as multipart/form-data to backend
6. Backend compresses and stores image
7. Response includes base64 encoded image

### Display Process
1. Backend returns image as base64
2. Frontend displays as: `data:image/jpeg;base64,{image}`
3. Image rendered in post card

## Error Handling

### API Errors
- Network errors caught and displayed
- User-friendly error messages
- Error state persists until resolved
- Retry capability through refetch functions

### Validation
- Image size validation (5MB limit)
- Content length validation
- Required field validation
- File type validation (images only)

## Loading States

### Post Creation
- Disable textarea and buttons during creation
- Show "Posting..." text
- Prevent multiple submissions

### Post Fetching
- Skeleton loaders for posts
- Loading spinner indication
- Disable pagination during load

### Comment Addition
- Disable input and button during submission
- Show "..." text while loading

## Role-Based Access Control

### Post Actions
- **CREATE_POST**: Create new posts
- **UPDATE_POST**: Edit own posts
- **DELETE_POST**: Delete own posts
- **READ_POSTS**: View posts (implicit)

### Comment Actions
- **CREATE_COMMENT**: Add comments
- **READ_COMMENTS**: View comments (implicit)
- **UPDATE_COMMENT**: Edit own comments
- **DELETE_COMMENT**: Delete own comments

### Like Actions
- **LIKE_POST**: Like/unlike posts
- **READ_LIKES**: View who liked (implicit)

## API Request/Response Examples

### Create Post
```javascript
// Request
POST /api/v1/posts
Content-Type: multipart/form-data

{
  content: "Post content text",
  institutionId: "123",
  image: <File>
}

// Response
{
  id: 1,
  content: "Post content text",
  user: {
    id: 1,
    firstName: "John",
    lastName: "Doe"
  },
  institution: {
    id: 123,
    name: "Institution Name"
  },
  image: "base64encodedimage...",
  views: 0,
  commentCount: 0,
  createdAt: "2025-12-15T09:00:00Z"
}
```

### Get Posts
```javascript
// Request
GET /api/v1/posts?page=0&limit=10

// Response
{
  content: [
    {
      id: 1,
      content: "Post content",
      user: {...},
      image: "base64...",
      views: 100,
      commentCount: 5,
      createdAt: "2025-12-15T09:00:00Z"
    }
  ],
  totalPages: 5,
  totalElements: 50,
  currentPage: 0
}
```

### Add Comment
```javascript
// Request
POST /api/v1/comments
Content-Type: application/json

{
  postId: 1,
  content: "Great post!"
}

// Response
{
  id: 1,
  content: "Great post!",
  user: {
    id: 2,
    firstName: "Jane",
    lastName: "Smith"
  },
  post: {
    id: 1
  },
  createdAt: "2025-12-15T09:30:00Z"
}
```

### Toggle Like
```javascript
// Request
POST /api/v1/likes/post/1/toggle

// Response
{
  liked: true,
  count: 42
}
```

## Configuration

### Environment Variables
```env
VITE_API_URI=http://localhost:8080
```

### API Base URL
All endpoints use `/api/v1/` prefix as defined in backend.

## Testing Checklist

- [ ] Create post without image
- [ ] Create post with image
- [ ] Image size validation (>5MB)
- [ ] Update post content
- [ ] Delete post (creator only)
- [ ] Like/unlike post
- [ ] View like count
- [ ] Add comment to post
- [ ] View comments list
- [ ] Update own comment
- [ ] Delete own comment
- [ ] Pagination works correctly
- [ ] Loading states display
- [ ] Error messages show
- [ ] Role-based access enforced
- [ ] Images display correctly
- [ ] Timestamps format correctly

## Troubleshooting

### Image Not Displaying
- Check if image is base64 encoded
- Verify image format: `data:image/jpeg;base64,{image}`
- Check browser console for errors

### Comments Not Loading
- Verify postId is passed correctly
- Check API endpoint: `/api/v1/comments/post/{postId}`
- Ensure user has READ_COMMENTS privilege

### Like Toggle Not Working
- Check user has LIKE_POST privilege
- Verify postId is valid
- Check network tab for API errors

### Posts Not Fetching
- Verify authentication token is valid
- Check API endpoint: `/api/v1/posts`
- Ensure page and limit parameters are correct

## Future Enhancements

- [ ] Real-time updates using WebSocket
- [ ] Post editing with image replacement
- [ ] Comment editing UI
- [ ] Nested replies to comments
- [ ] Post sharing functionality
- [ ] Search posts by content
- [ ] Filter posts by date range
- [ ] User mentions in comments
- [ ] Emoji reactions
- [ ] Post scheduling
