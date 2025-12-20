import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);
const path = '/users';

export function signup(data, config = {}) {
  return api.post(`${path}/signUp`, data, config);
}

export function login(data, config = {}) {
  return api.post(`${path}/signIn`, data, config);
}

export function sendResetCode(email, config = {}) {
  const safeEmail = encodeURIComponent(String(email || '').trim());
  return api.put(`${path}/password/sendResetCode/${safeEmail}`, undefined, config);
}

export function checkResetCode({ email, verificationCode }, config = {}) {
  const safeEmail = encodeURIComponent(String(email || '').trim());
  const safeCode = encodeURIComponent(String(verificationCode || '').trim());
  return api.post(`${path}/password/checkResetCode?verificationCode=${safeCode}&email=${safeEmail}`, '', config);
}

export function resetPassword(data, config = {}) {
  return api.put(`${path}/resetPassword`, data, config);
}
