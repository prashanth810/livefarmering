import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handlecreatefeedback, handlegetallfeedbacks } from "../services/FeedbackApis";
import { deletefeedback, updatefeedback } from "../services/ProductApi";

const emptySummary = { averageRating: 0, totalReviews: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

// get all feedback of ONE product   arg: { productId, page, limit, sort }
export const getfeedbacks = createAsyncThunk("feedback/getall", async (data, { rejectWithValue }) => {
    try {
        const response = await handlegetallfeedbacks(data);
        return response.data; // { summary, pagination, data: [...] }
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Unable to load feedback.");
    }
});

// create feedback 
export const createfeedback = createAsyncThunk('post/feedback', async ({ id, data }, ThunkApi) => {
    try {
        const resposne = await handlecreatefeedback({ id, data });
        return resposne.data.data;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.response?.data?.message || error.message || "Unable to submit feedback.");
    }
});

// edit / update feedbacks
export const editfeedback = createAsyncThunk("put/feedback", async ({ id, data }, ThunkApi) => {
    try {
        const response = await updatefeedback({ id, data });
        return response.data.data;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.message);
    }
});

// delete feedback 
export const removefeedback = createAsyncThunk("delete/feedback", async (id, ThunkApi) => {
    try {
        await deletefeedback(id);
        return id;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.response?.data?.message || error.message || "Unable to delete feedback.");
    }
});

const initialState = {
    feedback: {
        feedbackloading: false,
        feedbackdata: [],
        summary: emptySummary,
        pagination: null,
        feedbackerror: null,
    },
};

const FeedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        // call when the product changes, so old reviews do not flash
        clearfeedbacks: (state) => {
            state.feedback = { ...initialState.feedback };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getfeedbacks.pending, (state) => {
                state.feedback.feedbackloading = true;
                state.feedback.feedbackerror = null;
            })
            .addCase(getfeedbacks.fulfilled, (state, action) => {
                const page = action.meta.arg?.page || 1;
                const list = action.payload?.data || [];
                state.feedback.feedbackloading = false;
                // page 1 replaces the list, next pages ("Load more") are added at the end
                state.feedback.feedbackdata = page > 1 ? [...state.feedback.feedbackdata, ...list] : list;
                state.feedback.summary = action.payload?.summary || emptySummary;
                state.feedback.pagination = action.payload?.pagination || null;
            })
            .addCase(getfeedbacks.rejected, (state, action) => {
                state.feedback.feedbackloading = false;
                state.feedback.feedbackerror = action.payload;
            })

            // update feddback
            .addCase(editfeedback.fulfilled, (state, action) => {
                const updated = action.payload;
                if (!updated?._id) return;
                state.feedback.feedbackdata = state.feedback.feedbackdata.map((item) =>
                    item._id === updated._id ? { ...item, ...updated } : item
                );
            })

            // delete feedback
            .addCase(removefeedback.fulfilled, (state, action) => {
                state.feedback.feedbackdata = state.feedback.feedbackdata.filter(
                    (item) => item._id !== action.payload
                );
            });
    },
});

export const { clearfeedbacks } = FeedbackSlice.actions;
export default FeedbackSlice.reducer;