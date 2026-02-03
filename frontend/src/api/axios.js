import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // This points to your FastAPI backend
});

// Interceptor: Before every request, check if we have a token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;