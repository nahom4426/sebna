import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Likes API endpoints
export function getPostLikes(postId, page = 0, limit = 10) {
  return api.addAuthenticationHeader().get(`/api/v1/likes/post/${postId}?page=${page}&limit=${limit}`);
}

export function getPostLikeCount(postId) {
  return api.addAuthenticationHeader().get(`/api/v1/likes/post/${postId}/count`);
}

export function checkIfUserLiked(postId) {
  return api.addAuthenticationHeader().get(`/api/v1/likes/post/${postId}/user-liked`);
}

export function toggleLike(postId) {
  return api.addAuthenticationHeader().post(`/api/v1/likes/post/${postId}/toggle`, {});
}
