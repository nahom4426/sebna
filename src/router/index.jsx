import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import SignIn from '@/pages/auth/sign-in';
import SignUp from '@/pages/auth/sign-up';
import { Home, Profile, Tables, Notifications } from '@/features/dashboard';
import { Users, Roles, Privileges, Institutions, Posts, Messages } from '@/pages/admin';
import SebnaLanding from '@/pages/SebnaLanding';
import ProtectedRoute from './ProtectedRoute';

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

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                element={<Users />}
                requiredPrivileges={['create_user']}
              />
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute
                element={<Roles />}
                requiredPrivileges={['ROLE_MANAGEMENT','create_user']}
              />
            }
          />
          <Route
            path="/admin/privileges"
            element={
              <ProtectedRoute
                element={<Privileges />}
                requiredPrivileges={['PRIVILEGE_MANAGEMENT','create_user']}
              />
            }
          />
          <Route
            path="/admin/institutions"
            element={
              <ProtectedRoute
                element={<Institutions />}
                requiredPrivileges={['PRIVILEGE_MANAGEMENT','create_user']}
              />
            }
          />
          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute
                element={<Posts />}
                requiredPrivileges={['CREATE_POST']}
              />
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute
                element={<Messages />}
                requiredPrivileges={['SEND_MESSAGE']}
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
