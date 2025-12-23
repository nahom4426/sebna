import { ROLES } from '@/constants/roles';

export const checkUserPrivilege = (userPrivileges, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!userPrivileges || userPrivileges.length === 0) {
    return false;
  }

  return requiredRoles.some((role) => userPrivileges.includes(role));
};

export const checkUserRole = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!userRole) {
    return false;
  }

  return requiredRoles.includes(userRole);
};

export const isSuperAdmin = (userRole) => {
  if (!userRole) return false;
  const normalized = String(userRole).trim();
  return normalized === 'Super Admin' || normalized === 'SUPER_ADMIN' || normalized === 'super_admin';
};

export const hasAllPrivileges = (userPrivileges) => {
  return userPrivileges?.includes('All Privileges');
};

export const canAccess = (auth, requiredRoles = []) => {
  if (!auth?.user) {
    return false;
  }

  const { roleName, privileges = [] } = auth.user;

  if (isSuperAdmin(roleName) || hasAllPrivileges(privileges)) {
    return true;
  }

  return checkUserPrivilege(privileges, requiredRoles);
};

export const getDefaultRouteForRole = (userRole) => {
  const role = String(userRole || '').trim();
  if (role === 'super_admin' || role === 'SUPER_ADMIN' || role === 'Super Admin') {
    return '/admin/users';
  }
  if (role === 'shareholders' || role === 'SHAREHOLDERS' || role === 'Shareholders') {
    return '/dashboard/shareholder';
  }
  return '/dashboard/home';
};

export const formatRoleName = (role) => {
  if (!role) return '';
  return role
    .replace(/^ROLE_/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
