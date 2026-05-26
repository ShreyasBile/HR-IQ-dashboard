import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // FastAPI default port
});

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics/');
  return response.data;
};

export const getPredictiveScores = async () => {
  const response = await api.get('/predictive/scores');
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/alerts/');
  return response.data;
};

export const sendChatMessage = async (message: string) => {
  const response = await api.post('/chat/', { message });
  return response.data;
};

export const getBenchmarks = async (industry: string) => {
  const response = await api.get(`/benchmarks/?industry=${industry}`);
  return response.data;
};

export const generateReport = async (sections: string[]) => {
  const response = await api.post('/reports/', { sections }, { responseType: 'blob' });
  return response.data;
};
