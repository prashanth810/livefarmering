import axios from "axios";

const BaseUrl = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token to every request
BaseUrl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle authentication errors
BaseUrl.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token missing / expired / invalid
            localStorage.removeItem("token");

            // Optional: redirect to login
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default BaseUrl;