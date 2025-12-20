import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Likes API endpoints
export function getPostLikes(postId, page = 0, limit = 10) {
  return api.addAuthenticationHeader().get(`/likes/post/${postId}?page=${page}&limit=${limit}`);
}

export function getPostLikeCount(postId) {
  return api.addAuthenticationHeader().get(`/likes/post/${postId}/count`);
}

export function checkIfUserLiked(postId) {
  return api.addAuthenticationHeader().get(`/likes/post/${postId}/user-liked`);
}

export function toggleLike(postId) {
  return api.addAuthenticationHeader().post(`/likes/${postId}/toggle`, {});
}

export function getPublicPostLikeCount(postId, deviceId) {
  return api.get(`/likes/post/${postId}/count`, {
    headers: {
      'X-Device-Id': deviceId,
    },
  });
}

export function checkIfPublicUserLiked(postId, deviceId) {
  return api.get(`/likes/post/${postId}/user-liked`, {
    headers: {
      'X-Device-Id': deviceId,
    },
  });
}

export function togglePublicLike(postId, deviceId) {
  return api.post(
    `/likes/${postId}/toggle`,
    {},
    {
      headers: {
        'X-Device-Id': deviceId,
      },
    }
  );
}
