import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout, logoutapi } from "./AuthSlice";
import { handleaddtocart, handleaddtowishlist, handledeleteproduct, handledeleteproductfromwishlist, handledescreseitem, handlegetcartitems, handlegetwhichitems, handleremovecart } from "../services/CartApi";
import { handlegetsingleproduct } from "../services/ProductApi";

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

    for (const key of ["items", "cartItems", "cartdata", "cartData", "cart", "data", "result", "item", "cartItem"]) {
        const items = extractCartItems(payload[key]);
        if (items) return items;
    }

    return null;
};

const extractCartItem = (payload, productId, weight) => {
    if (!payload || typeof payload !== "object") return null;
    if (Array.isArray(payload)) {
        return payload.find((item) => isSameCartItem(item, productId, weight)) || null;
    }

    if (isSameCartItem(payload, productId, weight)) return payload;

    for (const key of ["item", "cartItem", "data", "result", "cart"]) {
        const item = extractCartItem(payload[key], productId, weight);
        if (item) return item;
    }

    return null;
};

const getWishlistProductId = (item) => item?.product?._id ?? item?.productId?._id ?? item?.productId;
const getWishlistWeight = (item) => item?.weight ?? "";
const isSameWishlistItem = (item, productId, weight) =>
    String(getWishlistProductId(item)) === String(productId) &&
    String(getWishlistWeight(item)) === String(weight ?? "");

const extractWishlistItem = (payload, productId, weight) => {
    if (!payload || typeof payload !== "object") return null;
    if (Array.isArray(payload)) {
        return payload.find((item) => isSameWishlistItem(item, productId, weight)) || null;
    }

    if (isSameWishlistItem(payload, productId, weight)) return payload;

    for (const key of ["wishlistItem", "item", "data", "result", "wishlist"]) {
        const item = extractWishlistItem(payload[key], productId, weight);
        if (item) return item;
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

// ============== wish list desc items =============

export const getwishlistitems = createAsyncThunk(
    "wishlist/get",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const response = await handlegetwhichitems(page, limit);
            const wishlistdata = Array.isArray(response?.data?.data) ? response.data.data : [];
            const productIds = [...new Set(wishlistdata
                .map((item) => String(item.productId?._id ?? item.productId ?? ""))
                .filter(Boolean))];
            const productResults = await Promise.all(productIds.map(async (productId) => {
                try {
                    const productResponse = await handlegetsingleproduct(productId);
                    return [productId, {
                        product: productResponse?.data?.data ?? null,
                        error: null,
                    }];
                } catch (error) {
                    return [productId, {
                        product: null,
                        error: error.response?.data?.message || error.message || "Failed to load product details",
                    }];
                }
            }));
            const productsById = Object.fromEntries(productResults);

            return {
                wishlistdata: wishlistdata.map((item) => {
                    const productId = String(item.productId?._id ?? item.productId ?? "");
                    const productResult = productsById[productId];
                    return {
                        ...item,
                        product: productResult?.product || (typeof item.productId === "object" ? item.productId : null),
                        productError: productResult?.error || null,
                    };
                }),
                pagination: response?.data?.pagination || null,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load wishlist items"
            );
        }
    }
);

// add items in whish list
export const addwichlist = createAsyncThunk(
    "wishlist/add",
    async ({ productId, weight, quantity = 1 }, { getState, rejectWithValue }) => {
        try {
            const existingItem = getState().cart.wishlist.wishlistdata.find(
                (item) => isSameWishlistItem(item, productId, weight)
            );
            const response = await handleaddtowishlist({ productId, weight, quantity });
            let product = existingItem?.product ||
                (typeof existingItem?.productId === "object" ? existingItem.productId : null);
            let productError = existingItem?.productError || null;

            if (!existingItem) {
                try {
                    const productResponse = await handlegetsingleproduct(productId);
                    product = productResponse?.data?.data ?? null;
                } catch (error) {
                    productError = error.response?.data?.message || error.message || "Failed to load product details";
                }
            }

            return {
                productId,
                weight,
                quantity,
                itemData: response?.data?.data ?? response?.data ?? null,
                product,
                productError,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to add item to wishlist"
            );
        }
    }
);

// descrese items in wish list
export const handledecitemswishlist = createAsyncThunk(
    "wishlist/decrease",
    async ({ productId, weight }, { rejectWithValue }) => {
        try {
            const response = await handledescreseitem({ productId, weight });
            return {
                productId,
                weight,
                itemData: response?.data?.data ?? response?.data ?? null,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to decrease item quantity in wishlist"
            );
        }
    }
);

// delete the entire item (product + weight) from wishlist
export const deletewishlistitem = createAsyncThunk(
    "wishlist/delete",
    async ({ productId, weight }, { rejectWithValue }) => {
        try {
            await handledeleteproductfromwishlist({ productId, weight });
            return { productId, weight };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove item from wishlist"
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
    wishlist: {
        wishlistloading: false,
        wishlistdata: [],
        wishlisterror: null,
        wishlistpagination: null,
        wishlistupdating: false,
    },
};

const AddtocartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logout, (state) => {
                state.wishlist = { ...initialState.wishlist };
            })
            .addCase(logoutapi.fulfilled, (state) => {
                state.wishlist = { ...initialState.wishlist };
            })
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

                const updatedItems = extractCartItems(action.payload);
                if (updatedItems) {
                    state.carts.cartdata = updatedItems.map(normalizeCartItem).filter(Boolean);
                    return;
                }

                const existingItem = state.carts.cartdata.find(
                    (cartItem) => isSameCartItem(
                        cartItem,
                        requestedItem.productId,
                        getCartItemWeight(requestedItem),
                    )
                );
                const serverItem = extractCartItem(
                    action.payload,
                    requestedItem.productId,
                    getCartItemWeight(requestedItem),
                );

                if (serverItem) {
                    if (existingItem) {
                        Object.assign(existingItem, normalizeCartItem(serverItem));
                    } else {
                        state.carts.cartdata.push(normalizeCartItem(serverItem));
                    }
                } else if (existingItem) {
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
                const updatedItems = extractCartItems(action.payload);

                if (Array.isArray(updatedItems)) {
                    state.carts.cartdata = updatedItems.map(normalizeCartItem).filter(Boolean);
                    return;
                }

                const productId = getCartProductId(action.meta.arg);
                const weight = getCartItemWeight(action.meta.arg);
                const item = state.carts.cartdata.find(
                    (cartItem) => isSameCartItem(cartItem, productId, weight)
                );
                const serverItem = extractCartItem(action.payload, productId, weight);

                if (serverItem && item) {
                    Object.assign(item, normalizeCartItem(serverItem));
                } else if (item && item.quantity > 1) {
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
                const updatedItems = extractCartItems(action.payload);

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

            .addCase(getwishlistitems.pending, (state) => {
                state.wishlist.wishlistloading = true;
                state.wishlist.wishlisterror = null;
            })
            .addCase(getwishlistitems.fulfilled, (state, action) => {
                state.wishlist.wishlistloading = false;
                state.wishlist.wishlistdata = action.payload.wishlistdata;
                state.wishlist.wishlistpagination = action.payload.pagination;
            })
            .addCase(getwishlistitems.rejected, (state, action) => {
                state.wishlist.wishlistloading = false;
                state.wishlist.wishlisterror = action.payload || "Failed to load wishlist items";
            })
            .addCase(addwichlist.pending, (state) => {
                state.wishlist.wishlistupdating = true;
                state.wishlist.wishlisterror = null;
            })
            .addCase(addwichlist.fulfilled, (state, action) => {
                state.wishlist.wishlistupdating = false;
                const { productId, weight, quantity, itemData, product, productError } = action.payload;
                const existingIndex = state.wishlist.wishlistdata.findIndex(
                    (item) => isSameWishlistItem(item, productId, weight)
                );
                const serverItem = extractWishlistItem(itemData, productId, weight);
                const serverQuantity = Number(serverItem?.quantity);

                if (existingIndex >= 0) {
                    const existingItem = state.wishlist.wishlistdata[existingIndex];
                    if (serverItem) Object.assign(existingItem, serverItem);
                    existingItem.quantity = Number.isFinite(serverQuantity) && serverQuantity > 0
                        ? serverQuantity
                        : (Number(existingItem.quantity) || 0) + (Number(quantity) || 1);
                    existingItem.product = existingItem.product || product;
                    existingItem.productError = existingItem.productError || productError;
                    return;
                }

                state.wishlist.wishlistdata.push({
                    ...(serverItem || {}),
                    productId: serverItem?.productId ?? productId,
                    weight: serverItem?.weight ?? weight,
                    quantity: Number.isFinite(serverQuantity) && serverQuantity > 0
                        ? serverQuantity
                        : (Number(quantity) || 1),
                    product: serverItem?.product || product,
                    productError: productError || null,
                });
                if (state.wishlist.wishlistpagination) {
                    state.wishlist.wishlistpagination.totalItems =
                        (Number(state.wishlist.wishlistpagination.totalItems) || 0) + 1;
                    const limit = Number(state.wishlist.wishlistpagination.limit) || 10;
                    state.wishlist.wishlistpagination.totalPages = Math.ceil(
                        state.wishlist.wishlistpagination.totalItems / limit
                    );
                }
            })
            .addCase(addwichlist.rejected, (state, action) => {
                state.wishlist.wishlistupdating = false;
                state.wishlist.wishlisterror = action.payload || "Failed to add item to wishlist";
            })
            .addCase(handledecitemswishlist.pending, (state) => {
                state.wishlist.wishlistupdating = true;
                state.wishlist.wishlisterror = null;
            })
            .addCase(handledecitemswishlist.fulfilled, (state, action) => {
                state.wishlist.wishlistupdating = false;
                const { productId, weight, itemData } = action.payload;
                const existingIndex = state.wishlist.wishlistdata.findIndex(
                    (item) => isSameWishlistItem(item, productId, weight)
                );
                if (existingIndex < 0) return;

                const existingItem = state.wishlist.wishlistdata[existingIndex];
                const serverItem = extractWishlistItem(itemData, productId, weight);
                const serverQuantity = Number(serverItem?.quantity);
                const nextQuantity = Number.isFinite(serverQuantity)
                    ? serverQuantity
                    : (Number(existingItem.quantity) || 1) - 1;

                if (serverItem) Object.assign(existingItem, serverItem);
                if (nextQuantity <= 0) {
                    state.wishlist.wishlistdata.splice(existingIndex, 1);
                    if (state.wishlist.wishlistpagination) {
                        state.wishlist.wishlistpagination.totalItems = Math.max(
                            0,
                            (Number(state.wishlist.wishlistpagination.totalItems) || 0) - 1
                        );
                        const limit = Number(state.wishlist.wishlistpagination.limit) || 10;
                        state.wishlist.wishlistpagination.totalPages = Math.ceil(
                            state.wishlist.wishlistpagination.totalItems / limit
                        );
                    }
                } else {
                    existingItem.quantity = nextQuantity;
                }
            })
            .addCase(handledecitemswishlist.rejected, (state, action) => {
                state.wishlist.wishlistupdating = false;
                state.wishlist.wishlisterror = action.payload || "Failed to decrease item quantity in wishlist";
            })

            // delete the entire item (product + weight) from wishlist
            .addCase(deletewishlistitem.pending, (state) => {
                state.wishlist.wishlistupdating = true;
                state.wishlist.wishlisterror = null;
            })
            .addCase(deletewishlistitem.fulfilled, (state, action) => {
                state.wishlist.wishlistupdating = false;
                const { productId, weight } = action.payload;

                const before = state.wishlist.wishlistdata.length;
                state.wishlist.wishlistdata = state.wishlist.wishlistdata.filter(
                    (item) => !isSameWishlistItem(item, productId, weight)
                );

                if (before !== state.wishlist.wishlistdata.length && state.wishlist.wishlistpagination) {
                    const pagination = state.wishlist.wishlistpagination;
                    pagination.totalItems = Math.max(0, (Number(pagination.totalItems) || 0) - 1);
                    const limit = Number(pagination.limit) || 10;
                    pagination.totalPages = Math.ceil(pagination.totalItems / limit);
                }
            })
            .addCase(deletewishlistitem.rejected, (state, action) => {
                state.wishlist.wishlistupdating = false;
                state.wishlist.wishlisterror = action.payload || "Failed to remove item from wishlist";
            })
    },
});

export default AddtocartSlice.reducer;