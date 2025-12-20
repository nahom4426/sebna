import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

// Create a new API service instance with the specific base URL
const api = new ApiService(import.meta.env.v_API_URI);
const path = "/users";

export function CreateUser(data) {
  const formattedData = {
    ...data,
    gender: data.gender?.toLowerCase(),
  };

  return api
    .addAuthenticationHeader()
    .post(`${path}/signUp`, formattedData)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to create user. Server error.",
        data: null,
      };
    });
}
export function getAllUser(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/all${qr}`);
}
export function getUserById(id) {
  return api.addAuthenticationHeader().get(`${path}/${id}`);
}
export function updateUserById(id, data) {
  const formattedData = {
    ...data,
    gender: data.gender?.toLowerCase(), // Ensure gender is lowercase for API
  };

  return api
    .addAuthenticationHeader()
    .put(`${path}/update/${id}`, formattedData)
    .catch((error) => {
      return {
        success: false,
        error: error.message || "Failed to update user. Server error.",
        data: null,
      };
    });
}
export function removeUserById(id) {
  return api.addAuthenticationHeader().delete(`${path}/${id}`);
}
export function fetchUserFilesView() {
  return api.addAuthenticationHeader().get(`${path}`);
}

export function fetchUserFiles() {
  return api.addAuthenticationHeader().get(`${path}`);
}
export function changeUserStatus(providerId, status) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${providerId}/status`, null, {
      params: { status },
    });
}
