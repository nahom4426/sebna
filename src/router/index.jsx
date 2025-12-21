import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import SignIn from '@/pages/auth/sign-in';
import SignUp from '@/pages/auth/sign-up';
import { Home, Profile, Tables, Notifications } from '@/features/dashboard';
import { Users, Roles, Privileges, Posts, Messages, Comments, Logs } from '@/pages/admin';
import EditRole from '@/pages/admin/roles/pages/EditRole';
import CreateRole from '@/pages/admin/roles/pages/CreateRole';
import EditPrivilege from '@/pages/admin/privileges/pages/EditPrivilege';
import CreatePrivilege from '@/pages/admin/privileges/pages/CreatePrivilege';
import SebnaLanding from '@/pages/SebnaLanding';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '@/constants/roles';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRole } from '@/utils/rbacUtils';

const AppRouter = () => {
  const auth = useAuthStore((state) => state.auth);
  const defaultRoute = auth?.accessToken ? getDefaultRouteForRole(auth?.user?.roleName) : '/auth/sign-in';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SebnaLanding />} />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />

      {/* Protected Dashboard Routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/dashboard/home"
          element={
            <ProtectedRoute
              element={<Home />}
              requiredRoles={[ROLES.READ_REPORTS]}
            />
          }
        />
        <Route
          path="/dashboard/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/dashboard/tables"
          element={<ProtectedRoute element={<Tables />} />}
        />
        <Route
          path="/dashboard/notifications"
          element={<ProtectedRoute element={<Notifications />} />}
        />

        {/* Admin Routes - Users Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              element={<Users />}
              requiredRoles={[
                ROLES.READ_USERS,
              ]}
            />
          }
        />

        {/* Admin Routes - Roles Management */}
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute
              element={<Roles />}
              requiredRoles={[
                ROLES.READ_ROLES,
              ]}
            />
          }
        />
        <Route
          path="/admin/roles/edit/:roleUuid"
          element={
            <ProtectedRoute
              element={<EditRole />}
              requiredRoles={[
                ROLES.UPDATE_ROLE,
                ROLES.READ_ROLE,
              ]}
            />
          }
        />
        <Route
          path="/admin/roles/create"
          element={
            <ProtectedRoute
              element={<CreateRole />}
              requiredRoles={[
                ROLES.CREATE_ROLE,
              ]}
            />
          }
        />

        {/* Admin Routes - Privileges Management */}
        <Route
          path="/admin/privileges"
          element={
            <ProtectedRoute
              element={<Privileges />}
              requiredRoles={[
                ROLES.READ_PRIVILEGES,
              ]}
            />
          }
        />
        <Route
          path="/admin/privileges/edit/:privilegeUuid"
          element={
            <ProtectedRoute
              element={<EditPrivilege />}
              requiredRoles={[
                ROLES.UPDATE_PRIVILEGE,
                ROLES.READ_PRIVILEGE,
              ]}
            />
          }
        />
        <Route
          path="/admin/privileges/create"
          element={
            <ProtectedRoute
              element={<CreatePrivilege />}
              requiredRoles={[
                ROLES.CREATE_PRIVILEGE,
              ]}
            />
          }
        />

        {/* Admin Routes - Posts Management */}
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute
              element={<Posts />}
              requiredRoles={[
                ROLES.READ_POSTS,
              ]}
            />
          }
        />

        {/* Admin Routes - Messages Management */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute
              element={<Messages />}
              requiredRoles={[
                ROLES.READ_MESSAGES,
              ]}
            />
          }
        />

        {/* Admin Routes - Comments Management */}
        <Route
          path="/admin/comments"
          element={
            <ProtectedRoute
              element={<Comments />}
              requiredRoles={[
                ROLES.READ_COMMENTS,
              ]}
            />
          }
        />

        {/* Admin Routes - Logs Management */}
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute
              element={<Logs />}
              requiredRoles={[ROLES.READ_LOGS]}
            />
          }
        />
      </Route>

      {/* Catch all - redirect based on auth/role */}
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
};

export default AppRouter;
