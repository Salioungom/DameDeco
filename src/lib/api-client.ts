import axios from 'axios';

// Client Axios unifié avec configuration centralisée
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Gestion automatique des cookies HTTP-Only
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  // Ajouter le token depuis localStorage
  const token = typeof window !== 'undefined' 
    ? (localStorage.getItem('token') || localStorage.getItem('accessToken'))
    : null;
    
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Intercepteur pour logger les requêtes (développement)
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use((config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  apiClient.interceptors.response.use((response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  });
}

export default apiClient;
