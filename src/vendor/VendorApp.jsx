import { Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import VendorStore from "./redux/VendorStore";
import VendorLayout from "./layout/VendorLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReviewsPage from "./pages/ReviewsPage";
import SettingsPage from "./pages/SettingsPage";

// Mounted at /vendor/* in the main App.jsx. Uses its own Redux store.
export default function VendorApp() {
    return (
        <Provider store={VendorStore}>
            <Routes>
                <Route element={<VendorLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/vendor" replace />} />
                </Route>
            </Routes>
        </Provider>
    );
}
