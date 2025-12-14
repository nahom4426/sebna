import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Posts API endpoints
export function getAllPosts(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/posts${queryString}`);
}

export function getPostById(id) {
  return api.addAuthenticationHeader().get(`/posts/${id}`);
}

export function createPost(data) {
  // Use multipart/form-data for image upload
  const formData = new FormData();
  formData.append('title', data.title || '');
  formData.append('content', data.content || '');
  if (data.institutionId) {
    formData.append('institutionId', data.institutionId);
  }
  if (data.status) {
    formData.append('status', data.status);
  }
  if (data.imageFile instanceof File) {
    formData.append('image', data.imageFile);
  }

  return api.addAuthenticationHeader().post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updatePostById(id, data) {
  const formData = new FormData();
  formData.append('title', data.title || '');
  formData.append('content', data.content || '');
  if (data.institutionId) {
    formData.append('institutionId', data.institutionId);
  }
  if (data.status) {
    formData.append('status', data.status);
  }
  if (data.imageFile instanceof File) {
    formData.append('image', data.imageFile);
  }

  return api.addAuthenticationHeader().put(`/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function removePostById(id) {
  return api.addAuthenticationHeader().delete(`/posts/${id}`);
}
