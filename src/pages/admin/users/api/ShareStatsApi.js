import ApiService from "@/services/ApiService";

const api = new ApiService(import.meta.env.VITE_API_URI);

export function getMyShareStats(config = {}) {
  return api.addAuthenticationHeader().get("/users/me/share-stats", config);
}
