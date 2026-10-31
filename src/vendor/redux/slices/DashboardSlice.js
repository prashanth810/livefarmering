import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../../services/VendorApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchDashboard = createAsyncThunk("vendor/dashboard/fetch", async (range, { rejectWithValue }) => {
    try {
        const res = await getDashboard(range);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const DashboardSlice = createSlice({
    name: "vendorDashboard",
    initialState: {
        pendingOrders: 0,
        stats: [],
        revenue: { week: [], month: [] },
        topProducts: [],
        recentOrders: [],
        loaded: false,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.loaded = true;
                Object.assign(state, action.payload);
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default DashboardSlice.reducer;
