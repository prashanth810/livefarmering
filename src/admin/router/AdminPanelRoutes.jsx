import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import DashboardPage from "../pages/DashboardPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import VendorsPage from "../pages/VendorsPage";
import VendorApprovalsPage from "../pages/VendorApprovalsPage";
import ProductMonitoringPage from "../pages/ProductMonitoringPage";
import OrdersPage from "../pages/OrdersPage";
import UsersPage from "../pages/UsersPage";
import SettingsPage from "../pages/SettingsPage";

// Every page inside the admin panel (sidebar + topbar layout).
// These paths are relative to /admin, for example "vendors" = /admin/vendors
// To add a new admin page: create the page, then add one <Route> here and one item in constants/navItems.js
export default function AdminPanelRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="vendor-approvals" element={<VendorApprovalsPage />} />
                <Route path="products" element={<ProductMonitoringPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
        </Routes>
    );
}