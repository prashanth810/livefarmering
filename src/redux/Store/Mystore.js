import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../Slices/AuthSlice.js";
import ProductSlice from '../Slices/ProductSlice.js';
import VendorSlice from '../Slices/VendorSlice.js';
import AddtocartSlice from '../Slices/AddtocartSlice.js';
import AddressSlice from '../Slices/AddressSlice.js';
import OrderSlice from '../Slices/OrderSlice.js';
import FeedbackSlice from '../Slices/FeedbackSlice.js';

const Mystore = configureStore({
    reducer: {
        auth: AuthSlice,
        product: ProductSlice,
        vendor: VendorSlice,
        cart: AddtocartSlice,
        address: AddressSlice,
        order: OrderSlice,
        feedback: FeedbackSlice
    }
})

export default Mystore;