import ApiService from '@/services/ApiService';

const api = new ApiService(import.meta.env.VITE_API_URI);

export function getPricePerShare(config = {}) {
  return api.addAuthenticationHeader().get('/settings/price-per-share', config);
}

export function getPricePerSharePublic(config = {}) {
  return api.get('/settings/price-per-share', config);
}

export function updatePricePerShare(pricePerShare, config = {}) {
  return api.addAuthenticationHeader().put(
    '/settings/price-per-share',
    { pricePerShare },
    config
  );
}
