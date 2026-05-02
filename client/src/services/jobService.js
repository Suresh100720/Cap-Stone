import api from './api';

export const getJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};
