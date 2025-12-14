import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Messages API endpoints
export function getAllMessages(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/messages${queryString}`);
}

export function getMessageById(id) {
  return api.addAuthenticationHeader().get(`/messages/${id}`);
}

export function sendMessage(data) {
  // { receiverId, content }
  return api.addAuthenticationHeader().post('/messages', data);
}

export function removeMessageById(id) {
  return api.addAuthenticationHeader().delete(`/messages/${id}`);
}

export function markMessageRead(id) {
  return api.addAuthenticationHeader().put(`/messages/${id}/read`);
}
