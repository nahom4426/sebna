import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

const normalizePage = (page) => {
  const n = Number(page);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return n;
};

// Comments API endpoints
export function getPostComments(postId, page = 0, limit = 10) {
  const pageParam = normalizePage(Number(page) + 1);
  return api.addAuthenticationHeader().get(`/post-comments/post/${postId}?page=${pageParam}&limit=${limit}`);
}

export function getPublicPostComments(postId, page = 0, limit = 10, deviceId) {
  const pageParam = normalizePage(Number(page) + 1);
  return api.get(`/post-comments/post/${postId}?page=${pageParam}&limit=${limit}`, {
    headers: {
      'X-Device-Id': deviceId,
    },
  });
}

export function getCommentById(id) {
  return api.addAuthenticationHeader().get(`/post-comments/${id}`);
}

export function createComment(data) {
  return api.addAuthenticationHeader().post(`/post-comments/${data.postId}`, {
    comment: data.comment,
  });
}

export function createPublicComment(data, deviceId) {
  return api.post(
    `/post-comments/${data.postId}`,
    {
      comment: data.comment,
    },
    {
      headers: {
        'X-Device-Id': deviceId,
      },
    }
  );
}

export function updateCommentById(id, data) {
  return api.addAuthenticationHeader().put(`/post-comments/${id}`, {
    comment: data.comment,
  });
}

export function deleteCommentById(id) {
  return api.addAuthenticationHeader().delete(`/post-comments/${id}`);
}
