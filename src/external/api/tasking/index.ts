import axios from 'axios';

export const taskingApiClient = axios.create({
  baseURL: process.env.TASKING_API_URL || 'http://localhost:8000',
});

taskingApiClient.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith('/')) {
    config.url += '/';
  }

  return config;
});
