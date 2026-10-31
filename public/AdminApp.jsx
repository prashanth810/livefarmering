import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../../services/AdminApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchDashboard = createAsyncThunk("admin/dashboard/fetch", async (range, { rejectWithValue }) => {
    try {
        const res = await getDashboard(range);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const DashboardSlice = createSlice({
    name: "adminDashboard",
    initialState: { stats: [], revenue: [], categories: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.revenue = action.payload.revenue;
                state.categories = action.payload.categories;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default DashboardSlice.reducer;
