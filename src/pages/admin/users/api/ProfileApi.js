import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

export function updateProfileData(userUuid, data) {
  return api.addAuthenticationHeader().put(`/users/update/${userUuid}`, data);
}

export function uploadProfilePicture(userUuid, userName, formData) {
  return api.addAuthenticationHeader().put(`/users/editProfile/${userUuid}`, formData, {
    params: { userName },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function changePassword(userUuid, data) {
  return api.addAuthenticationHeader().put(`/users/changePassword/${userUuid}`, data);
}
