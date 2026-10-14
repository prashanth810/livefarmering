import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    handleplaceorder,
    handlegetmyorders,
    handlegetsingleorder,
    handleverifypayment,
    handlecancelorder
} from "../../services/OrderApi";

const errMsg = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

// returns { order } for COD, { order, razorpay } for ONLINE
export const placeorder = createAsyncThunk("order/place", async (data, { rejectWithValue }) => {
    try {
        const response = await handleplaceorder(data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(errMsg(error, "Unable to place your order"));
    }
});

export const verifypayment = createAsyncThunk("order/verify", async (data, { rejectWithValue }) => {
    try {
        const response = await handleverifypayment(data);
        return response.data?.data ?? response.data;
    } catch (error) {
        return rejectWithValue(errMsg(error, "Payment verification failed"));
    }
});

export const getmyorders = createAsyncThunk("order/mine", async ({ limit = 10, page = 1 }, { rejectWithValue }) => {
    try {
        const response = await handlegetmyorders({ limit, page });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(errMsg(error, "Unable to load orders"));
    }
});

export const getsingleorder = createAsyncThunk("order/single", async (orderId, { rejectWithValue }) => {
    try {
        const response = await handlegetsingleorder(orderId);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(errMsg(error, "Unable to load order"));
    }
});

// cancel an unpaid online order (popup closed / payment not completed)
export const cancelorder = createAsyncThunk("order/cancel", async (orderId, { rejectWithValue }) => {
    try {
        await handlecancelorder(orderId);
        return orderId;
    } catch (error) {
        return rejectWithValue(errMsg(error, "Unable to cancel order"));
    }
});

const initialState = {
    place: { placeloading: false, placeerror: null },
    verify: { verifyloading: false, verifyerror: null },
    cancel: { cancelloading: false, cancelerror: null },
    myorders: { ordersloading: false, ordersdata: [], orderserror: null, orderspagination: null, },
    singleorder: { singleorderloading: false, singleorderdata: null, singleordererror: null },
};

const OrderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // place order
            .addCase(placeorder.pending, (state) => {
                state.place.placeloading = true;
                state.place.placeerror = null;
            })
            .addCase(placeorder.fulfilled, (state) => {
                state.place.placeloading = false;
            })
            .addCase(placeorder.rejected, (state, action) => {
                state.place.placeloading = false;
                state.place.placeerror = action.payload;
            })

            // verify payment
            .addCase(verifypayment.pending, (state) => {
                state.verify.verifyloading = true;
                state.verify.verifyerror = null;
            })
            .addCase(verifypayment.fulfilled, (state) => {
                state.verify.verifyloading = false;
            })
            .addCase(verifypayment.rejected, (state, action) => {
                state.verify.verifyloading = false;
                state.verify.verifyerror = action.payload;
            })

            // cancel unpaid order
            .addCase(cancelorder.pending, (state) => {
                state.cancel.cancelloading = true;
                state.cancel.cancelerror = null;
            })
            .addCase(cancelorder.fulfilled, (state, action) => {
                state.cancel.cancelloading = false;
                state.myorders.ordersdata = state.myorders.ordersdata.filter(
                    (order) => String(order._id) !== String(action.payload)
                );
            })
            .addCase(cancelorder.rejected, (state, action) => {
                state.cancel.cancelloading = false;
                state.cancel.cancelerror = action.payload;
            })

            // my orders
            .addCase(getmyorders.pending, (state) => {
                state.myorders.ordersloading = true;
                state.myorders.orderserror = null;
            })
            .addCase(getmyorders.fulfilled, (state, action) => {
                state.myorders.ordersloading = false;
                state.myorders.ordersdata = action.payload;
                state.myorders.orderspagination = action.payload.pagination;
            })
            .addCase(getmyorders.rejected, (state, action) => {
                state.myorders.ordersloading = false;
                state.myorders.orderserror = action.payload;
            })

            // single order
            .addCase(getsingleorder.pending, (state) => {
                state.singleorder.singleorderloading = true;
                state.singleorder.singleordererror = null;
            })
            .addCase(getsingleorder.fulfilled, (state, action) => {
                state.singleorder.singleorderloading = false;
                state.singleorder.singleorderdata = action.payload;
            })
            .addCase(getsingleorder.rejected, (state, action) => {
                state.singleorder.singleorderloading = false;
                state.singleorder.singleordererror = action.payload;
            });
    },
});

export default OrderSlice.reducer;