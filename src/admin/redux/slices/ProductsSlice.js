import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts, patchProductStatus } from "../../services/AdminApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchProducts = createAsyncThunk("admin/products/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getProducts();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const updateProductStatus = createAsyncThunk("admin/products/updateStatus", async (payload, { rejectWithValue }) => {
    try {
        const res = await patchProductStatus(payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const ProductsSlice = createSlice({
    name: "adminProducts",
    initialState: { list: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProductStatus.fulfilled, (state, action) => {
                const row = state.list.find((p) => p.id === action.payload.id);
                if (row) row.status = action.payload.status;
            });
    },
});

export default ProductsSlice.reducer;
