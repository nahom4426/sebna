import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useBreadcrumbStore } from '@/stores/breadcrumbStore';

const ProtectedRoute = ({ element, requiredPrivileges = [] }) => {
  const auth = useAuthStore((state) => state.auth);
  const location = useLocation();
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    // Generate breadcrumbs from location pathname
    const pathSegments = location.pathname
      .split('/')
      .filter((segment) => segment && segment !== 'dashboard');

    const breadcrumbs = pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: '/' + pathSegments.slice(0, index + 1).join('/'),
    }));

    setBreadcrumbs([{ name: 'Dashboard', path: '/dashboard' }, ...breadcrumbs]);
  }, [location.pathname, setBreadcrumbs]);

  // Check if user is authenticated
  if (!auth?.accessToken) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // Check if user is Super Admin or has All Privileges
  if (
    auth?.user?.privileges?.includes('All Privileges') ||
    auth?.user?.roleName === 'Super Admin'
  ) {
    return element;
  }

  // Check if route requires specific privileges
  if (requiredPrivileges && requiredPrivileges.length > 0) {
    if (!auth?.user?.privileges || auth.user.privileges.length === 0) {
      return <Navigate to="/dashboard/home" replace />;
    }

    const hasRequiredPrivilege = requiredPrivileges.some((privilege) =>
      auth.user.privileges.includes(`ROLE_${privilege}`)
    );

    if (!hasRequiredPrivilege) {
      return <Navigate to="/dashboard/home" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
