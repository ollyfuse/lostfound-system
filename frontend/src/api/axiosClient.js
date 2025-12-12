import axios from 'axios';

// Simple cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Dynamic base URL based on environment and host
const getBaseURL = () => {
  // Always use environment variable first
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Increase timeout to 30 seconds
});

// Request interceptor for caching
axiosClient.interceptors.request.use((config) => {
  if (config.method === 'get') {
    const cacheKey = `${config.url}?${JSON.stringify(config.params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      });
    }
  }
  return config;
});

// Response interceptor for caching
axiosClient.interceptors.response.use((response) => {
  if (response.config.method === 'get') {
    const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params)}`;
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
  }
  return response;
});

export default axiosClient;
