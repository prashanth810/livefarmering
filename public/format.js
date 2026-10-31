import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOrders } from "../../services/AdminApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchOrders = createAsyncThunk("admin/orders/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getOrders();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const OrdersSlice = createSlice({
    name: "adminOrders",
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
            });
    },
});

export default OrdersSlice.reducer;
