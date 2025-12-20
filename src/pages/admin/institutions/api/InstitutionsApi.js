import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

// Institution API endpoints
export function getAllInstitution(query = {}) {
  const params = new URLSearchParams(query).toString();
  const queryString = params ? `?${params}` : '';
  return api.addAuthenticationHeader().get(`/institutions${queryString}`);
}

export function getInstitutionById(id) {
  return api.addAuthenticationHeader().get(`/institutions/${id}`);
}

export function createInstitution(data) {
  // Convert to FormData for multipart file upload
  const formData = new FormData();
  
  // Add text fields
  formData.append('name', data.name || '');
  formData.append('description', data.description || '');
  formData.append('website', data.website || '');
  
  // Add logo file if it exists and is a File object
  if (data.logoFile instanceof File) {
    formData.append('logo', data.logoFile);
  }
  
  return api.addAuthenticationHeader().post('/institutions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateInstitutionById(id, data) {
  // Convert to FormData for multipart file upload
  const formData = new FormData();
  
  // Add text fields
  formData.append('name', data.name || '');
  formData.append('description', data.description || '');
  formData.append('website', data.website || '');
  
  // Add logo file if it exists and is a File object
  if (data.logoFile instanceof File) {
    formData.append('logo', data.logoFile);
  }
  
  return api.addAuthenticationHeader().put(`/institutions/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function removeInstitutionById(id) {
  return api.addAuthenticationHeader().delete(`/institutions/${id}`);
}

export function changeInstitutionStatus(institutionId, status) {
  return api.addAuthenticationHeader().put(`/institutions/${institutionId}/status`, null, {
    params: { status },
  });
}

export function getMyInstitutionMembership() {
  return api.addAuthenticationHeader().get('/institution-memberships/my');
}
