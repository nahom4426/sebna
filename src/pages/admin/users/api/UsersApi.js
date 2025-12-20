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
  return api.addAuthenticationHeader().post('/users/signUp', data, {
    validateStatus: (status) => status === 200 || status === 400,
  });
}

export function updateUserById(id, data) {
  return api.addAuthenticationHeader().put(`/users/update/${id}`, data);
}

export function removeUserById(id) {
  return api.addAuthenticationHeader().delete(`/users/delete/${id}`);
}

export function resendWelcomePasswordEmail(userUuid) {
  return api.addAuthenticationHeader().post(`/users/admin/resend-welcome-password/${userUuid}`, null, {
    validateStatus: (status) => status === 200 || status === 400,
  });
}

export function adminResetPassword(userUuid) {
  return api.addAuthenticationHeader().post(`/users/admin/reset-password/${userUuid}`);
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
