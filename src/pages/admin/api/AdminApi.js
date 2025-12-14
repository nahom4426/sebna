import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// User API endpoints
export function getAllUser(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/users/all${queryString}`);
}

export function getUserById(id) {
  return api.addAuthenticationHeader().get(`/users/${id}`);
}

export function createUser(data) {
  return api.addAuthenticationHeader().post('/users/signup', data);
}

export function updateUserById(id, data) {
  return api.addAuthenticationHeader().put(`/users/${id}`, data);
}

export function removeUserById(id) {
  return api.addAuthenticationHeader().delete(`/users/${id}`);
}

export function changeUserStatus(userId, status) {
  return api.addAuthenticationHeader().put(`/users/${userId}/status`, null, {
    params: { status },
  });
}

// Role API endpoints
export function getAllRole(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/role/getAll${queryString}`);
}

export function getRoleById(id) {
  return api.addAuthenticationHeader().get(`/role/${id}`);
}

export function createRole(data) {
  return api.addAuthenticationHeader().post('/role', data);
}

export function updateRoleById(id, data) {
  return api.addAuthenticationHeader().put(`/role/${id}`, data);
}

export function removeRoleById(id) {
  return api.addAuthenticationHeader().delete(`/role/${id}`);
}

export function changeRoleStatus(roleId, status) {
  return api.addAuthenticationHeader().put(`/role/${roleId}/status`, null, {
    params: { status },
  });
}

// Privilege API endpoints
export function getAllPrivilege(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/privilege/list${queryString}`);
}

export function getPrivilegeById(id) {
  return api.addAuthenticationHeader().get(`/privilege/${id}`);
}

export function createPrivilege(data) {
  return api.addAuthenticationHeader().post('/privilege', data);
}

export function updatePrivilege(id, data) {
  return api.addAuthenticationHeader().put(`/privilege/${id}`, data);
}

export function deletePrivilege(id) {
  return api.addAuthenticationHeader().delete(`/privilege/${id}`);
}

export function changePrivilegeStatus(privilegeId, status) {
  return api.addAuthenticationHeader().put(`/privilege/${privilegeId}/status`, null, {
    params: { status },
  });
}

// Institution API endpoints
export function getAllInstitution(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/institutions/all${queryString}`);
}

export function getInstitutionById(id) {
  return api.addAuthenticationHeader().get(`/institutions/${id}`);
}

export function createInstitution(data) {
  return api.addAuthenticationHeader().post('/institutions', data);
}

export function updateInstitutionById(id, data) {
  return api.addAuthenticationHeader().put(`/institutions/${id}`, data);
}

export function removeInstitutionById(id) {
  return api.addAuthenticationHeader().delete(`/institutions/${id}`);
}
