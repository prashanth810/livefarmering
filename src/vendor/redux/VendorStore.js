import { configureStore } from "@reduxjs/toolkit";
import DashboardSlice from "./slices/DashboardSlice";
import AnalyticsSlice from "./slices/AnalyticsSlice";
import ProductsSlice from "./slices/ProductsSlice";
import OrdersSlice from "./slices/OrdersSlice";
import CustomersSlice from "./slices/CustomersSlice";
import ReviewsSlice from "./slices/ReviewsSlice";

// Vendor dashboard has its own store, separate from Mystore and AdminStore
const VendorStore = configureStore({
    reducer: {
        dashboard: DashboardSlice,
        analytics: AnalyticsSlice,
        products: ProductsSlice,
        orders: OrdersSlice,
        customers: CustomersSlice,
        reviews: ReviewsSlice,
    },
});

export default VendorStore;
