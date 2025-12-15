import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Comments API endpoints
export function getPostComments(postId, page = 0, limit = 10) {
  return api.addAuthenticationHeader().get(`/api/v1/comments/post/${postId}?page=${page}&limit=${limit}`);
}

export function getCommentById(id) {
  return api.addAuthenticationHeader().get(`/api/v1/comments/${id}`);
}

export function createComment(data) {
  return api.addAuthenticationHeader().post('/api/v1/comments', {
    postId: data.postId,
    content: data.content,
  });
}

export function updateCommentById(id, data) {
  return api.addAuthenticationHeader().put(`/api/v1/comments/${id}`, {
    content: data.content,
  });
}

export function deleteCommentById(id) {
  return api.addAuthenticationHeader().delete(`/api/v1/comments/${id}`);
}
