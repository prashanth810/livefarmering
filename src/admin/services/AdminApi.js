import { adminApi, ADMIN_USE_MOCK } from "./AdminBaseUrl";
import {
    mockDashboard,
    mockAnalytics,
    mockVendors,
    mockApprovals,
    mockProducts,
    mockOrders,
    mockUsers,
} from "../constants/mockData";

const base = "/api/admin/v1";

// Returns data in the same shape axios does: { data: { data } }
const mock = (data, ms = 350) =>
    new Promise((resolve) => setTimeout(() => resolve({ data: { data } }), ms));

// ---- dashboard + analytics ----
export const getDashboard = (range = "30d") =>
    ADMIN_USE_MOCK ? mock(mockDashboard) : adminApi.get(`${base}/dashboard`, { params: { range } });

export const getAnalytics = (range = "30d") =>
    ADMIN_USE_MOCK ? mock(mockAnalytics) : adminApi.get(`${base}/analytics`, { params: { range } });

// ---- vendors ----
export const getVendors = () =>
    ADMIN_USE_MOCK ? mock(mockVendors) : adminApi.get(`${base}/vendors`);

export const patchVendorStatus = ({ id, status }) =>
    ADMIN_USE_MOCK ? mock({ id, status }, 250) : adminApi.patch(`${base}/vendors/${id}/status`, { status });

// ---- vendor approvals ----
export const getApprovals = () =>
    ADMIN_USE_MOCK ? mock(mockApprovals) : adminApi.get(`${base}/vendors/approvals`);

export const patchApproval = ({ id, status }) =>
    ADMIN_USE_MOCK ? mock({ id, status }, 250) : adminApi.patch(`${base}/vendors/approvals/${id}`, { status });

// ---- products ----
export const getProducts = () =>
    ADMIN_USE_MOCK ? mock(mockProducts) : adminApi.get(`${base}/products`);

export const patchProductStatus = ({ id, status }) =>
    ADMIN_USE_MOCK ? mock({ id, status }, 250) : adminApi.patch(`${base}/products/${id}/status`, { status });

// ---- orders ----
export const getOrders = () =>
    ADMIN_USE_MOCK ? mock(mockOrders) : adminApi.get(`${base}/orders`);

// ---- users ----
export const getUsers = () =>
    ADMIN_USE_MOCK ? mock(mockUsers) : adminApi.get(`${base}/users`);
