import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApprovals, patchApproval } from "../../services/AdminApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchApprovals = createAsyncThunk("admin/approvals/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getApprovals();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// status: "Approved" | "Rejected"
export const decideApproval = createAsyncThunk("admin/approvals/decide", async (payload, { rejectWithValue }) => {
    try {
        const res = await patchApproval(payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const ApprovalsSlice = createSlice({
    name: "adminApprovals",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApprovals.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchApprovals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(decideApproval.fulfilled, (state, action) => {
                const row = state.list.find((a) => a.id === action.payload.id);
                if (row) row.status = action.payload.status;
            });
    },
});

export default ApprovalsSlice.reducer;
