import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import SignIn from '@/pages/auth/sign-in';
import SignUp from '@/pages/auth/sign-up';
import { Home, Profile, Tables, Notifications } from '@/features/dashboard';
import { Users, Roles, Privileges, Institutions, Posts, Messages, Comments } from '@/pages/admin';
import SebnaLanding from '@/pages/SebnaLanding';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '@/constants/roles';

const AppRouter = () => {
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
          element={<ProtectedRoute element={<Home />} />}
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
                ROLES.CREATE_USER,
                ROLES.UPDATE_USER,
                ROLES.DELETE_USER,
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
                ROLES.CREATE_ROLE,
                ROLES.UPDATE_ROLE,
                ROLES.DELETE_ROLE,
                ROLES.READ_ROLE,
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
                ROLES.CREATE_PRIVILEGE,
                ROLES.UPDATE_PRIVILEGE,
                ROLES.DELETE_PRIVILEGE,
                ROLES.READ_PRIVILEGE,
              ]}
            />
          }
        />

        {/* Admin Routes - Institutions Management */}
        <Route
          path="/admin/institutions"
          element={
            <ProtectedRoute
              element={<Institutions />}
              requiredRoles={[
                ROLES.READ_INSTITUTIONS,
                ROLES.CREATE_INSTITUTION,
                ROLES.UPDATE_INSTITUTION,
                ROLES.DELETE_INSTITUTION,
                ROLES.READ_INSTITUTION,
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
                ROLES.CREATE_POST,
                ROLES.UPDATE_POST,
                ROLES.DELETE_POST,
                ROLES.READ_POST,
                ROLES.LIKE_POST,
                ROLES.UNLIKE_POST,
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
                ROLES.SEND_MESSAGE,
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
                ROLES.CREATE_COMMENT,
                ROLES.DELETE_COMMENT,
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

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
};

export default AppRouter;
