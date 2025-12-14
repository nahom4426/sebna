import ApiService from "@/service/ApiService";

const api = new ApiService();
const path = "/auth/users";

export function approveUser(id, status = true) {
  return api
    .addAuthenticationHeader()
    .patch(`${path}/approveUser/${id}?approved=${status}`);
}
