import api from './api';

export const getAISuggestions = async (query) => {
  const response = await api.post('/ai/suggest', { query });
  return response.data;
};
