import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCustomers } from "../../services/VendorApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchCustomers = createAsyncThunk("vendor/customers/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getCustomers();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const CustomersSlice = createSlice({
    name: "vendorCustomers",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default CustomersSlice.reducer;
