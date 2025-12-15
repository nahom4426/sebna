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
  return userRole === 'Super Admin' || userRole === 'SUPER_ADMIN';
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

export const formatRoleName = (role) => {
  if (!role) return '';
  return role
    .replace(/^ROLE_/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
