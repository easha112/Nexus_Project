import axios from "axios";

const API = axios.create({
    baseURL: "https://noble-spirit-production-f5f4.up.railway.app/api"
});

// Request Interceptor: Attach token automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Global Error Handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default API;