import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAnalytics } from "../../services/VendorApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchAnalytics = createAsyncThunk("vendor/analytics/fetch", async (range, { rejectWithValue }) => {
    try {
        const res = await getAnalytics(range);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const AnalyticsSlice = createSlice({
    name: "vendorAnalytics",
    initialState: { kpis: [], revenueTrend: [], orderStatus: [], topProducts: [], ratings: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                Object.assign(state, action.payload);
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default AnalyticsSlice.reducer;
