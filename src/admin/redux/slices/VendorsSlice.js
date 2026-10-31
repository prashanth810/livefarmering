import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getVendors, patchVendorStatus } from "../../services/AdminApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchVendors = createAsyncThunk("admin/vendors/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getVendors();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const updateVendorStatus = createAsyncThunk("admin/vendors/updateStatus", async (payload, { rejectWithValue }) => {
    try {
        const res = await patchVendorStatus(payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const VendorsSlice = createSlice({
    name: "adminVendors",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateVendorStatus.fulfilled, (state, action) => {
                const vendor = state.list.find((v) => v.id === action.payload.id);
                if (vendor) vendor.status = action.payload.status;
            });
    },
});

export default VendorsSlice.reducer;
