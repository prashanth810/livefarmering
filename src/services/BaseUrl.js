import axios from "axios";

const createApiClient = (baseURL) => axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Each client reads the env var set in .env.production (committed) or Vercel dashboard.
// The hardcoded strings are the real production URLs and act as a last-resort fallback.
const authApi     = createApiClient(import.meta.env.VITE_AUTH_API_URL     || "https://ecommerce-authservice.onrender.com");
const productApi  = createApiClient(import.meta.env.VITE_PRODUCT_API_URL  || "https://ecommerce-productservice.onrender.com");
const categoryApi = createApiClient(import.meta.env.VITE_CATEGORY_API_URL || "https://ecommerce-productservice.onrender.com");
const cartApi     = createApiClient(import.meta.env.VITE_CART_API_URL     || "https://ecommerce-cartservice.onrender.com");
// Address service always points to its own dedicated Render service (never the payment service).
const addressApi  = createApiClient(import.meta.env.VITE_ADDRESS_API_URL);
const orderApi    = createApiClient(import.meta.env.VITE_ORDER_API_URL    || "https://ecommerce-payment-jakh.onrender.com");


const attachInterceptors = (api) => {
    api.interceptors.request.use(
        (config) => {
            const token = sessionStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                sessionStorage.removeItem("token");
                window.location.href = "/login";
            }

            return Promise.reject(error);
        }
    );
};

attachInterceptors(authApi);
attachInterceptors(productApi);
attachInterceptors(categoryApi);
attachInterceptors(cartApi);
attachInterceptors(addressApi);
attachInterceptors(orderApi);


export { authApi, productApi, categoryApi, cartApi, addressApi, orderApi };
export default authApi;