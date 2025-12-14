import ApiService from "@/service/ApiService";
import { getQueryFormObject } from "@/utils/utils.js";

const api = new ApiService();
const path = "/users";

export function getAllPrivilege(query = {}) {
  const qr = getQueryFormObject(query);
  return api.addAuthenticationHeader().get(`${path}/privilege/all${qr}`);
}
export function createPrivilege(data) {
  return api.addAuthenticationHeader().post(`${path}/privilege`, data);
}

export function deletePrivilege(id) {
  return api.addAuthenticationHeader().delete(`${path}/privilege/${id}`);
}
export function getPrivilegeById(id) {
  return api.addAuthenticationHeader().get(`${path}/privilege/${id}`);
}
export function updatePrivilege(id, data) {
  return api.addAuthenticationHeader().put(`${path}/privilege/${id}`, data);
}

export function changePrivilegeStatus(privilegeId, status) {
  return api
    .addAuthenticationHeader()
    .put(`${path}/${privilegeId}/status`, null, {
      params: { status },
    });
}
