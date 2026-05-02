import api from './api';

export const getCandidates = async () => {
  const response = await api.get('/candidates');
  return response.data;
};
