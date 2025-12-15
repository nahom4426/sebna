# Bug Fixes Summary - December 15, 2025

## Issues Fixed

### 1. Invalid Hook Call Error
**Problem:** "Invalid hook call. Hooks can only be called inside of the body of a function component" error appearing when network errors occurred.

**Root Cause:** The `toasted()` function was being called directly in the `ApiResponseHandler.js` file, which is not a React component. This violated React's hook rules.

**Solution:**
- Wrapped `toasted()` calls in `setTimeout(..., 0)` to defer execution to the next event loop
- This ensures the toast function runs outside of the synchronous API response handling
- File: `src/services/ApiResponseHandler.js`

**Changes:**
```javascript
// Before
toasted(false, "", errMsg);

// After
setTimeout(() => {
  toasted(false, "", errMsg);
}, 0);
```

---

### 2. Duplicate API Calls
**Problem:** Every API GET request was being called twice, causing performance issues and duplicate data.

**Root Cause:** Incorrect dependency arrays in `useEffect` hooks causing infinite loops:
- `usePosts` hook had `fetchPosts` in dependency array which changed on every render
- `useComments` hook had `fetchComments` in dependency array
- `useLikes` hook had `fetchLikeData` in dependency array
- `PostsDataProvider` had `fetchPosts` in dependency array

**Solution:** 
- Removed callback functions from useEffect dependency arrays
- Used only the actual dependencies (page, limit, postId, search, perPage)
- Added `isMountedRef` to prevent state updates after unmount
- Files Modified:
  - `src/hooks/usePosts.js`
  - `src/hooks/useComments.js`
  - `src/hooks/useLikes.js`
  - `src/pages/admin/posts/component/PostsDataProvider.jsx`

**Changes Pattern:**
```javascript
// Before
useEffect(() => {
  fetchPosts();
}, [fetchPosts]); // ❌ Causes infinite loop

// After
useEffect(() => {
  fetchPosts();
}, [page, limit]); // ✅ Only actual dependencies
```

---

### 3. Toast Message Not Displaying Error Responses
**Problem:** Error responses like `{"statusCode":500,"message":"Bad credentials"}` were not being displayed in toast notifications.

**Root Cause:** 
- Import path was incorrect: `@/utils/utils` instead of `@/utils/toast`
- Toast function wasn't being called properly in error scenarios

**Solution:**
- Fixed import path in `ApiResponseHandler.js`
- Ensured error messages are extracted from response data correctly
- Added proper error message extraction logic
- File: `src/services/ApiResponseHandler.js`

**Changes:**
```javascript
// Before
import { toasted } from "@/utils/utils"; // ❌ Wrong path

// After
import { toasted } from "@/utils/toast"; // ✅ Correct path
```

---

### 4. Initial Login Redirect Loops
**Problem:** On first login in Chrome (or incognito mode), the app would redirect multiple times between `/auth/sign-in` and `/dashboard/home`.

**Root Cause:**
- Sign-in page was checking `localStorage` directly instead of waiting for auth store to be restored
- Race condition between localStorage check and auth store initialization
- No proper synchronization between auth store state and component rendering

**Solution:**
- Updated sign-in page to use `useAuthStore` instead of checking localStorage directly
- Added proper auth store initialization in login handler
- Used `auth?.accessToken` from store instead of localStorage
- File: `src/pages/auth/sign-in.jsx`

**Changes:**
```javascript
// Before
useEffect(() => {
  const userDetail = localStorage.getItem('userDetail');
  if (userDetail) {
    navigate(redirectPath); // ❌ Causes redirect loop
  }
}, [navigate, location]);

// After
useEffect(() => {
  if (auth?.accessToken) { // ✅ Uses auth store
    navigate(redirectPath, { replace: true });
  }
}, [auth?.accessToken, navigate, location]);

// Login handler also updated to set auth store
if (response.success) {
  setAuth({
    user: response.data,
    accessToken: response.data?.token || response.data?.accessToken,
  });
  navigate(redirectPath, { replace: true });
}
```

---

## Files Modified

1. **src/services/ApiResponseHandler.js**
   - Fixed import path for toast utility
   - Added setTimeout wrapper for toast calls
   - Improved error message extraction

2. **src/hooks/usePosts.js**
   - Fixed useEffect dependency array
   - Added isMountedRef to prevent state updates after unmount
   - Removed callback from dependencies

3. **src/hooks/useComments.js**
   - Fixed useEffect dependency array
   - Added isMountedRef
   - Changed dependency from `[fetchComments]` to `[postId, page, limit]`

4. **src/hooks/useLikes.js**
   - Fixed useEffect dependency array
   - Added isMountedRef
   - Changed dependency from `[fetchLikeData]` to `[postId]`

5. **src/pages/admin/posts/component/PostsDataProvider.jsx**
   - Fixed useEffect dependency array
   - Added isMountedRef
   - Removed `fetchPosts` from dependencies

6. **src/pages/auth/sign-in.jsx**
   - Added useAuthStore import
   - Changed from localStorage check to auth store check
   - Updated login handler to properly set auth store
   - Added `{ replace: true }` to navigation to prevent history issues

---

## Testing Recommendations

### 1. Test Invalid Hook Call Fix
- Open browser console
- Trigger a network error (e.g., disconnect network)
- Verify no "Invalid hook call" error appears
- Verify toast notification displays error message

### 2. Test Duplicate API Calls Fix
- Open Network tab in DevTools
- Navigate to any page with API calls
- Verify each GET request is called only once
- Check that pagination works correctly

### 3. Test Toast Message Display
- Try logging in with wrong credentials
- Verify error message displays in toast
- Try various API errors
- Verify all error types display correctly

### 4. Test Login Redirect Loop Fix
- Clear all browser data (cookies, localStorage, cache)
- Open app in incognito/private mode
- Navigate to login page
- Login with valid credentials
- Verify single redirect to dashboard (no loops)
- Refresh page and verify still logged in
- Close and reopen browser
- Verify still logged in

---

## Performance Impact

- **Reduced API calls**: Each endpoint now called once instead of twice
- **Reduced memory usage**: No more infinite hook dependencies
- **Faster initial load**: Single redirect instead of multiple redirects
- **Better error handling**: Proper async error display

---

## Backward Compatibility

All changes are backward compatible:
- No breaking changes to component APIs
- No changes to data structures
- No changes to routing logic
- All existing functionality preserved

---

## Future Improvements

1. Add request debouncing for rapid API calls
2. Implement request caching to reduce API calls
3. Add loading skeletons for better UX
4. Add retry logic for failed requests
5. Implement proper error boundaries
