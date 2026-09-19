import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../Slices/AuthSlice.js";
import ProductSlice from '../Slices/ProductSlice.js';

const Mystore = configureStore({
    reducer: {
        auth: AuthSlice,
        product: ProductSlice
    }
})

export default Mystore;