import api from './api';

export const fetchPricing = async () => {
  try {
    const response = await api.get('/api/pricing');
    return response.data; // { country, currency, price }
  } catch (error) {
    throw error;
  }
};