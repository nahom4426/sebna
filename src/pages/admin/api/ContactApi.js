import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

export function sendContactMessage(payload, config = {}) {
  return api.post('/contact', payload, config);
}
