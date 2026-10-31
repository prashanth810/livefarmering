import { vendorApi, VENDOR_USE_MOCK } from "./VendorBaseUrl";
import {
    mockDashboard,
    mockProducts,
    mockOrders,
    mockCustomers,
    mockAnalytics,
    mockReviews,
} from "../constants/mockData";

const base = "/api/vendor/v1";

// Returns data in the same shape axios does: { data: { data } }
const mock = (data, ms = 350) =>
    new Promise((resolve) => setTimeout(() => resolve({ data: { data } }), ms));

// ---- dashboard + analytics ----
export const getDashboard = (range = "week") =>
    VENDOR_USE_MOCK ? mock(mockDashboard) : vendorApi.get(`${base}/dashboard`, { params: { range } });

export const getAnalytics = (range = "week") =>
    VENDOR_USE_MOCK ? mock(mockAnalytics) : vendorApi.get(`${base}/analytics`, { params: { range } });

// ---- products ----
export const getProducts = () =>
    VENDOR_USE_MOCK ? mock(mockProducts) : vendorApi.get(`${base}/products`);

export const postProduct = (data) =>
    VENDOR_USE_MOCK
        ? mock({ ...data, id: `P-${Date.now()}`, sold: 0, status: "Active" }, 300)
        : vendorApi.post(`${base}/products`, data);

export const patchProductStatus = ({ id, status }) =>
    VENDOR_USE_MOCK ? mock({ id, status }, 250) : vendorApi.patch(`${base}/products/${id}/status`, { status });

// ---- orders ----
export const getOrders = () =>
    VENDOR_USE_MOCK ? mock(mockOrders) : vendorApi.get(`${base}/orders`);

export const patchOrderStatus = ({ id, status }) =>
    VENDOR_USE_MOCK ? mock({ id, status }, 250) : vendorApi.patch(`${base}/orders/${encodeURIComponent(id)}/status`, { status });

// ---- customers ----
export const getCustomers = () =>
    VENDOR_USE_MOCK ? mock(mockCustomers) : vendorApi.get(`${base}/customers`);

// ---- reviews ----
export const getReviews = () =>
    VENDOR_USE_MOCK ? mock(mockReviews) : vendorApi.get(`${base}/reviews`);
