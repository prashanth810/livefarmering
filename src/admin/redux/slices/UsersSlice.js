import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers } from "../../services/AdminApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchUsers = createAsyncThunk("admin/users/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getUsers();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const UsersSlice = createSlice({
    name: "adminUsers",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default UsersSlice.reducer;
