import ApiService from '@/services/ApiService';
import { useAuthStore } from '@/stores/authStore';
import { isSuperAdmin } from '@/utils/rbacUtils';

const api = new ApiService(import.meta.env.VITE_API_URI);

const normalizePage = (page) => {
  const n = Number(page);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return n;
};

const normalizeCategory = (category) => {
  const v = String(category || '').trim();
  const lower = v.toLowerCase();
  if (lower === 'investment') return 'INVESTMENT_NEWS';
  if (lower === 'market') return 'MARKET_NEWS';
  if (lower === 'company') return 'COMPANY_NEWS';
  return v;
};

// Posts API endpoints
export function getAllPosts(page = 0, limit = 10) {
  const pageParam = normalizePage(Number(page) + 1);
  return api.addAuthenticationHeader().get(`/posts/landing?page=${pageParam}&limit=${limit}`);
}

export function getLandingPosts({ category, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  params.append('page', String(normalizePage(Number(page) + (Number(page) === 0 ? 1 : 0))));
  params.append('limit', String(limit));

  if (category && category !== 'all') {
    params.append('category', normalizeCategory(category));
  }

  return api.get(`/posts/landing?${params.toString()}`);
}

export function getInstitutionPosts(institutionId, page = 0, limit = 10) {
  const pageParam = normalizePage(Number(page) + 1);
  return api.addAuthenticationHeader().get(`/posts/institution/${institutionId}?page=${pageParam}&limit=${limit}`);
}

export function getUserPosts(userId, page = 0, limit = 10) {
  const pageParam = normalizePage(Number(page) + 1);
  return api.addAuthenticationHeader().get(`/posts/user/${userId}?page=${pageParam}&limit=${limit}`);
}

export function getPostById(id) {
  return api.addAuthenticationHeader().get(`/posts/${id}`);
}

export function getPublicPostById(id) {
  return api.get(`/posts/${id}`);
}

export function createPost(data) {
  const auth = useAuthStore.getState()?.auth;
  const roleName = auth?.user?.roleName;

  const formData = new FormData();
  formData.append('title', data?.title || '');
  formData.append('content', data?.content || '');
  formData.append('category', normalizeCategory(data?.category));

  const institutionId =
    data?.institutionId ||
    data?.institutionUuid ||
    (!isSuperAdmin(roleName) ? (auth?.user?.institutionId || auth?.user?.institutionUuid) : undefined);

  if (!isSuperAdmin(roleName) && !institutionId) {
    return Promise.reject(new Error('You are not assigned to an institution'));
  }
  if (institutionId) {
    formData.append('institutionId', institutionId);
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
  const auth = useAuthStore.getState()?.auth;
  const roleName = auth?.user?.roleName;

  const formData = new FormData();
  formData.append('title', data?.title || '');
  formData.append('content', data?.content || '');
  formData.append('category', normalizeCategory(data?.category));

  const institutionId =
    data?.institutionId ||
    data?.institutionUuid ||
    (!isSuperAdmin(roleName) ? (auth?.user?.institutionId || auth?.user?.institutionUuid) : undefined);
  if (!isSuperAdmin(roleName) && !institutionId) {
    return Promise.reject(new Error('You are not assigned to an institution'));
  }
  if (institutionId) {
    formData.append('institutionId', institutionId);
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
