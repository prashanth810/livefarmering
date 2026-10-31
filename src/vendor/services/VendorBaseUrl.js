import axios from "axios";

// Vendor dashboard has its own base URL (set VITE_VENDOR_API_URL in .env)
export const VENDOR_API_URL = import.meta.env.VITE_VENDOR_API_URL || "http://localhost:2006";

// When not "false", the vendor screens run on local mock data (no backend needed)
export const VENDOR_USE_MOCK = import.meta.env.VITE_VENDOR_USE_MOCK !== "false";

export const vendorApi = axios.create({
    baseURL: VENDOR_API_URL,
    headers: { "Content-Type": "application/json" },
});

vendorApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

vendorApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem("token");
            window.location.href = "/vendor-login";
        }
        return Promise.reject(error);
    }
);

export default vendorApi;
