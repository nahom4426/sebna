import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Messages API endpoints
export function getAllMessages(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/messages/inbox${queryString}`);
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

export function getMessageContacts() {
  return api.addAuthenticationHeader().get('/messages/contacts');
}

export function getMessageThread(otherUserUuid, page = 0, limit = 20) {
  return api
    .addAuthenticationHeader()
    .get(`/messages/thread/${otherUserUuid}?page=${page}&limit=${limit}`);
}

export function sendTextMessage(receiverUserUuid, content) {
  return api.addAuthenticationHeader().post('/messages', {
    receiverUserUuid,
    content,
  });
}

export function sendMultipartMessage({ receiverUserUuid, type, content, file }) {
  const formData = new FormData();
  formData.append('receiverUserUuid', receiverUserUuid);
  if (type) formData.append('type', type);
  if (content != null) formData.append('content', content);
  if (file instanceof File || file instanceof Blob) {
    formData.append('file', file);
  }

  return api.addAuthenticationHeader().post('/messages/send', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function downloadMessageAttachment(messageId) {
  return api.addAuthenticationHeader().get(`/messages/${messageId}/attachment`, {
    responseType: 'blob',
  });
}
