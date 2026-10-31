import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOrders, patchOrderStatus } from "../../services/VendorApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchOrders = createAsyncThunk("vendor/orders/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getOrders();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
export const updateOrderStatus = createAsyncThunk("vendor/orders/updateStatus", async (payload, { rejectWithValue }) => {
    try {
        const res = await patchOrderStatus(payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const OrdersSlice = createSlice({
    name: "vendorOrders",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const row = state.list.find((o) => o.id === action.payload.id);
                if (row) row.status = action.payload.status;
            });
    },
});

export default OrdersSlice.reducer;
