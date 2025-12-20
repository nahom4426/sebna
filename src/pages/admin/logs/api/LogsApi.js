import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

export function getLoginLogs(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/logs/login${queryString}`);
}
