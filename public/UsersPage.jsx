import { configureStore } from "@reduxjs/toolkit";
import DashboardSlice from "./slices/DashboardSlice";
import AnalyticsSlice from "./slices/AnalyticsSlice";
import VendorsSlice from "./slices/VendorsSlice";
import ApprovalsSlice from "./slices/ApprovalsSlice";
import ProductsSlice from "./slices/ProductsSlice";
import OrdersSlice from "./slices/OrdersSlice";
import UsersSlice from "./slices/UsersSlice";

// Admin has its own store, separate from the customer/vendor store (Mystore)
const AdminStore = configureStore({
    reducer: {
        dashboard: DashboardSlice,
        analytics: AnalyticsSlice,
        vendors: VendorsSlice,
        approvals: ApprovalsSlice,
        products: ProductsSlice,
        orders: OrdersSlice,
        users: UsersSlice,
    },
});

export default AdminStore;
