import axios from "axios";

// Admin API has its own base URL (set VITE_ADMIN_API_URL in .env)
export const ADMIN_API_URL =
    import.meta.env.VITE_ADMIN_API_URL || "http://localhost:2005";

// When not "false", the admin screens run on local mock data (no backend needed)
export const ADMIN_USE_MOCK = import.meta.env.VITE_ADMIN_USE_MOCK !== "false";

export const adminApi = axios.create({
    baseURL: ADMIN_API_URL,
    headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("adminToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
        }
        return Promise.reject(error);
    }
);

export default adminApi;
