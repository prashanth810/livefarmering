import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../Slices/AuthSlice.js";
import ProductSlice from '../Slices/ProductSlice.js';
import VendorSlice from '../Slices/VendorSlice.js';

const Mystore = configureStore({
    reducer: {
        auth: AuthSlice,
        product: ProductSlice,
        vendor: VendorSlice,
    }
})

export default Mystore;