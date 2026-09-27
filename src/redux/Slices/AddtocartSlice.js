import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleaddtocart, handlegetcartitems, handleremovecart } from "../services/CartApi";

const normalizeCartItem = (item) => {
    if (!item) return null;

    const quantity = Number(item.quantity ?? 1);

    return {
        ...item,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    };
};

const getCartProductId = (item) => item?.productId?._id ?? item?.productId ?? item?._id;

// add to cart
export const addtocart = createAsyncThunk(
    "cart/add",
    async (data, { rejectWithValue }) => {
        try {
            const response = await handleaddtocart(data);
            const payload = response?.data?.data ?? response?.data ?? data;
            return payload;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to add item to cart"
            );
        }
    }
);

// remove from cart
export const removetocart = createAsyncThunk(
    "cart/remove",
    async (data, { rejectWithValue }) => {
        try {
            const response = await handleremovecart(data);
            return response?.data?.data ?? response?.data ?? data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove item from cart"
            );
        }
    }
);

// get cart items
export const getcartitems = createAsyncThunk(
    "cart/get",
    async (id, { rejectWithValue }) => {
        try {
            const response = await handlegetcartitems(id);
            return response?.data?.data ?? response?.data ?? {};
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load cart"
            );
        }
    }
);

const initialState = {
    carts: {
        cartloading: false,
        cartdata: [],
        carterror: null,
    },
    getcart: {
        getcartloading: false,
        getcartdata: [],
        getcarterror: null,
    },
};

const AddtocartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // add to cart
            .addCase(addtocart.pending, (state) => {
                state.carts.cartloading = true;
                state.carts.carterror = null;
            })
            .addCase(addtocart.fulfilled, (state, action) => {
                state.carts.cartloading = false;
                const requestedItem = normalizeCartItem(action.meta.arg);

                if (!requestedItem?.productId) {
                    return;
                }

                const existingItem = state.carts.cartdata.find(
                    (cartItem) => String(cartItem.productId?._id ?? cartItem.productId) === String(requestedItem.productId)
                );

                if (existingItem) {
                    existingItem.quantity += requestedItem.quantity;
                } else {
                    state.carts.cartdata.push(requestedItem);
                }
            })
            .addCase(addtocart.rejected, (state, action) => {
                state.carts.cartloading = false;
                state.carts.carterror = action.payload;
            })

            // remove from cart
            .addCase(removetocart.pending, (state) => {
                state.carts.cartloading = true;
                state.carts.carterror = null;
            })
            .addCase(removetocart.fulfilled, (state, action) => {
                state.carts.cartloading = false;
                const updatedItems = action.payload?.items;

                if (Array.isArray(updatedItems)) {
                    state.carts.cartdata = updatedItems.map(normalizeCartItem).filter(Boolean);
                    return;
                }

                const productId = getCartProductId(action.meta.arg);
                const item = state.carts.cartdata.find(
                    (cartItem) => String(getCartProductId(cartItem)) === String(productId)
                );

                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.carts.cartdata = state.carts.cartdata.filter(
                        (cartItem) => String(getCartProductId(cartItem)) !== String(productId)
                    );
                }
            })
            .addCase(removetocart.rejected, (state, action) => {
                state.carts.cartloading = false;
                state.carts.carterror = action.payload;
            })

            // get cart items 
            .addCase(getcartitems.pending, (state) => {
                state.getcart.getcartloading = true;
                state.getcart.getcarterror = null;
            })
            .addCase(getcartitems.fulfilled, (state, action) => {
                state.getcart.getcartloading = false;
                state.getcart.getcartdata = action.payload;
                const items = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload?.items;
                state.carts.cartdata = Array.isArray(items)
                    ? items.map(normalizeCartItem).filter(Boolean)
                    : [];
            })
            .addCase(getcartitems.rejected, (state, action) => {
                state.getcart.getcartloading = false;
                state.getcart.getcarterror = action.payload;
            })
    },
});

export default AddtocartSlice.reducer;