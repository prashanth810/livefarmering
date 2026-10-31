import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getReviews } from "../../services/VendorApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchReviews = createAsyncThunk("vendor/reviews/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getReviews();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const ReviewsSlice = createSlice({
    name: "vendorReviews",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ReviewsSlice.reducer;
