import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = '/users';

export function signup(data, config = {}) {
  return api.post(`${path}/signUp`, data, config);
}

export function login(data, config = {}) {
  return api.post(`${path}/signIn`, data, config);
}

export function forgotPassword(data, config = {}) {
  return api.post(`${path}/forgot-password`, data, config);
}

export function resetPassword(data, config = {}) {
  return api.put(`${path}/password/resetPassword`, data, config);
}

export function verifyResetCode(data, config = {}) {
  return api.post(`${path}/verify-reset-code`, data, config);
}
