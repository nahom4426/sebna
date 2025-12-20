import ApiService from "@/services/ApiService";

const api = new ApiService(import.meta.env.VITE_API_URI);

export function getDashboardReport(range = "week") {
  const safeRange = range === "month" ? "month" : "week";
  return api.addAuthenticationHeader().get(`/reports/dashboard?range=${safeRange}`);
}
