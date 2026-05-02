import api from './api';

export const searchCandidates = async (q, useAI = false, filters = {}) => {
  const response = await api.get('/search', { 
    params: { 
      q, 
      useAI,
      experience: filters.experience?.join(','),
      skills: filters.skills?.join(','),
      roles: filters.roles?.join(',')
    } 
  });
  return response.data;
};
