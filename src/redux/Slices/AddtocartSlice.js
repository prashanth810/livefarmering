import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleaddtocart, handledeleteproduct, handlegetcartitems, handleremovecart } from "../services/CartApi";

const normalizeCartItem = (item) => {
    if (!item) return null;

    const quantity = Number(item.quantity ?? 1);

    return {
        ...item,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    };
};

const getCartProductId = (item) => item?.productId?._id ?? item?.productId ?? item?._id;
const getCartItemWeight = (item) => item?.weight ?? item?.unit ?? "";
const isSameCartItem = (item, productId, weight) =>
    String(getCartProductId(item)) === String(productId) &&
    String(getCartItemWeight(item)) === String(weight ?? "");

const extractCartItems = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return null;

    for (const key of ["items", "cartItems", "cartdata", "cartData", "cart", "data", "result"]) {
        const items = extractCartItems(payload[key]);
        if (items) return items;
    }

    return null;
};

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
            const items = extractCartItems(response?.data);
            if (!items) {
                return rejectWithValue("Unexpected cart response: item list was not found");
            }
            return items;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load cart"
            );
        }
    }
);

export const deleteproductfromcart = createAsyncThunk(
    "cart/clear",
    async ({ productId, weight }, ThunkApi) => {
        try {
            const response = await handledeleteproduct({
                productId,
                weight,
            });

            return response?.data?.data ?? {};
        } catch (error) {
            return ThunkApi.rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove item from cart"
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
                    (cartItem) => isSameCartItem(
                        cartItem,
                        requestedItem.productId,
                        getCartItemWeight(requestedItem),
                    )
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
                const weight = getCartItemWeight(action.meta.arg);
                const item = state.carts.cartdata.find(
                    (cartItem) => isSameCartItem(cartItem, productId, weight)
                );

                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.carts.cartdata = state.carts.cartdata.filter(
                        (cartItem) => !isSameCartItem(cartItem, productId, weight)
                    );
                }
            })
            .addCase(removetocart.rejected, (state, action) => {
                state.carts.cartloading = false;
                state.carts.carterror = action.payload;
            })

            // delete the full product quantity from cart
            .addCase(deleteproductfromcart.pending, (state) => {
                state.carts.cartloading = true;
                state.carts.carterror = null;
            })
            .addCase(deleteproductfromcart.fulfilled, (state, action) => {
                state.carts.cartloading = false;
                const updatedItems = action.payload?.items;

                if (Array.isArray(updatedItems)) {
                    state.carts.cartdata = updatedItems.map(normalizeCartItem).filter(Boolean);
                    return;
                }

                const productId = getCartProductId(action.meta.arg);
                const weight = action.meta.arg?.weight ?? action.meta.arg?.unit;
                state.carts.cartdata = state.carts.cartdata.filter((cartItem) =>
                    String(getCartProductId(cartItem)) !== String(productId) ||
                    String(cartItem.weight ?? cartItem.unit ?? "") !== String(weight ?? "")
                );
            })
            .addCase(deleteproductfromcart.rejected, (state, action) => {
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
                state.carts.cartdata = action.payload.map(normalizeCartItem).filter(Boolean);
            })
            .addCase(getcartitems.rejected, (state, action) => {
                state.getcart.getcartloading = false;
                state.getcart.getcarterror = action.payload;
            })
    },
});

export default AddtocartSlice.reducer;