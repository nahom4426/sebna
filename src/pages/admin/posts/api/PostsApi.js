import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Posts API endpoints
export function getAllPosts(page = 0, limit = 10) {
  return api.addAuthenticationHeader().get(`/api/v1/posts?page=${page}&limit=${limit}`);
}

export function getInstitutionPosts(institutionId, page = 0, limit = 10) {
  return api.addAuthenticationHeader().get(`/api/v1/posts/institution/${institutionId}?page=${page}&limit=${limit}`);
}

export function getUserPosts(userId, page = 0, limit = 10) {
  return api.addAuthenticationHeader().get(`/api/v1/posts/user/${userId}?page=${page}&limit=${limit}`);
}

export function getPostById(id) {
  return api.addAuthenticationHeader().get(`/api/v1/posts/${id}`);
}

export function createPost(data) {
  const formData = new FormData();
  formData.append('content', data.content || '');
  
  if (data.institutionId) {
    formData.append('institutionId', data.institutionId);
  }
  if (data.imageFile instanceof File) {
    formData.append('image', data.imageFile);
  }

  return api.addAuthenticationHeader().post('/api/v1/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updatePostById(id, data) {
  const formData = new FormData();
  formData.append('content', data.content || '');
  
  if (data.institutionId) {
    formData.append('institutionId', data.institutionId);
  }
  if (data.imageFile instanceof File) {
    formData.append('image', data.imageFile);
  }

  return api.addAuthenticationHeader().put(`/api/v1/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function removePostById(id) {
  return api.addAuthenticationHeader().delete(`/api/v1/posts/${id}`);
}
