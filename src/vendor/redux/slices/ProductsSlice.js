import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts, postProduct, patchProductStatus } from "../../services/VendorApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export const fetchProducts = createAsyncThunk("vendor/products/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await getProducts();
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

export const addProduct = createAsyncThunk("vendor/products/add", async (payload, { rejectWithValue }) => {
    try {
        const res = await postProduct(payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// status: "Active" | "Inactive"
export const updateProductStatus = createAsyncThunk("vendor/products/updateStatus", async (payload, { rejectWithValue }) => {
    try {
        const res = await patchProductStatus(payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const ProductsSlice = createSlice({
    name: "vendorProducts",
    initialState: { list: [], loading: false, saving: false, error: null },
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
            .addCase(addProduct.pending, (state) => {
                state.saving = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.saving = false;
                state.list.unshift(action.payload);
            })
            .addCase(addProduct.rejected, (state) => {
                state.saving = false;
            })
            .addCase(updateProductStatus.fulfilled, (state, action) => {
                const row = state.list.find((p) => p.id === action.payload.id);
                if (row) row.status = action.payload.status;
            });
    },
});

export default ProductsSlice.reducer;
