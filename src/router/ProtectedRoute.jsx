import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useBreadcrumbStore } from '@/stores/breadcrumbStore';
import { canAccess } from '@/utils/rbacUtils';

const ProtectedRoute = ({ element, requiredRoles = [], requiredPrivileges = [] }) => {
  const auth = useAuthStore((state) => state.auth);
  const location = useLocation();
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    const pathSegments = location.pathname
      .split('/')
      .filter((segment) => segment && segment !== 'dashboard');

    const breadcrumbs = pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: '/' + pathSegments.slice(0, index + 1).join('/'),
    }));

    setBreadcrumbs([{ name: 'Dashboard', path: '/dashboard' }, ...breadcrumbs]);
  }, [location.pathname, setBreadcrumbs]);

  if (!auth?.accessToken) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  const userPrivileges = auth?.user?.privileges || [];
  const userRole = auth?.user?.roleName;

  if (userRole === 'Super Admin' || userPrivileges.includes('All Privileges')) {
    return element;
  }

  const rolesToCheck = requiredRoles.length > 0 ? requiredRoles : requiredPrivileges;

  if (rolesToCheck.length > 0) {
    const hasAccess = rolesToCheck.some((role) => userPrivileges.includes(role));

    if (!hasAccess) {
      return <Navigate to="/dashboard/home" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
