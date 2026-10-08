import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getproductsbycategory, getproductsbysearch, handlegetallproducts, handlegetcategories, handlegetsingleproduct } from "../services/ProductApi";


// get all categories
export const getallcategories = createAsyncThunk('categoris/fetch', async (_, ThunkApi) => {
    try {
        const resposne = await handlegetcategories();
        return resposne.data.data;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.message);
    }
});

// get [roducts by caegory id
export const handlegetproductsbycategory = createAsyncThunk("products/fetch", async (category, ThunkApi) => {
    try {
        const { categoryId, page = 1, limit = 10 } = typeof category === "object"
            ? category
            : { categoryId: category };
        const response = await getproductsbycategory(categoryId, page, limit);
        return {
            products: response.data.data,
            pagination: response.data.pagination,
        };
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.message);
    }
});

// get single product data 
export const getsingleproduct = createAsyncThunk("category/products", async (id, ThunkApi) => {
    try {
        const resposne = await handlegetsingleproduct(id);
        return resposne.data.data;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.message);
    }
});

// get searhc products by name 
export const handlesearchproducts = createAsyncThunk("get/searchproducts", async (search, Thunkpi) => {
    try {
        const response = await getproductsbysearch(search);
        return response.data.data;
    }
    catch (error) {
        return Thunkpi.rejectWithValue(error.message);
    }
})

// get all prodcts
export const getallproducts = createAsyncThunk(
    "get/allproducts",
    async ({ page = 1, limit = 10 } = {}, ThunkApi) => {
        try {
            const response = await handlegetallproducts(page, limit);
            return {
                products: Array.isArray(response?.data?.data) ? response.data.data : [],
                pagination: response?.data?.pagination || null,
            };
        }
        catch (error) {
            return ThunkApi.rejectWithValue(error.response?.data?.message || error.message || "Failed to load products");
        }
    },
    {
        condition: (_arg, { getState }) => {
            const allproducts = getState().product.allproducts;
            return !allproducts.allproductsloading && !allproducts.allproductsloaded;
        },
    }
);



const initialState = {
    selectedCategoryId: null,
    category: {
        categoryloading: false,
        categorydata: [],
        categoryerror: null,
    },
    products: {
        productloading: false,
        productdata: [],
        productpagination: null,
        producterror: null,
    },
    singleproduct: {
        singleloading: false,
        singleproductdata: [],
        singleerror: null,
    },
    searchproducts: {
        searchprodloading: false,
        searchproddata: [],
        searchproderror: null,
    },
    allproducts: {
        allproductsdata: [],
        allproductsloading: false,
        allproductserror: null,
        allproductspagination: null,
        allproductsloaded: false,
    }

};

const ProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategoryId = action.payload;
        },
        clearSearchProducts: (state) => {
            state.searchproducts.searchproddata = [];
            state.searchproducts.searchproderror = null;
            state.searchproducts.searchprodloading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch all categories
            .addCase(getallcategories.pending, (state) => {
                state.category.categoryloading = true;
                state.category.categoryerror = null;
            })
            .addCase(getallcategories.fulfilled, (state, action) => {
                state.category.categoryloading = false;
                state.category.categorydata = action.payload;
            })
            .addCase(getallcategories.rejected, (state, action) => {
                state.category.categoryloading = false;
                state.category.categoryerror = action.payload;
            })

            // fetch products based on category
            .addCase(handlegetproductsbycategory.pending, (state) => {
                state.products.productloading = true;
                state.products.producterror = null;
            })
            .addCase(handlegetproductsbycategory.fulfilled, (state, action) => {
                state.products.productloading = false;
                state.products.productdata = Array.isArray(action.payload.products)
                    ? action.payload.products
                    : [];
                state.products.productpagination = action.payload.pagination || null;
            })
            .addCase(handlegetproductsbycategory.rejected, (state, action) => {
                state.products.productloading = false;
                state.products.producterror = action.payload;
            })

            // single product data
            .addCase(getsingleproduct.pending, (state) => {
                state.singleproduct.singleloading = true;
                state.singleproduct.singleerror = null;
                state.singleproduct.singleproductdata = null;
            })
            .addCase(getsingleproduct.fulfilled, (state, action) => {
                state.singleproduct.singleloading = false;
                state.singleproduct.singleproductdata = action.payload;
            })
            .addCase(getsingleproduct.rejected, (state, action) => {
                state.singleproduct.singleloading = false;
                state.singleproduct.singleerror = action.payload;
            })

            // search products by name
            .addCase(handlesearchproducts.pending, (state) => {
                state.searchproducts.searchprodloading = true;
                state.searchproducts.searchproderror = null;
            })
            .addCase(handlesearchproducts.fulfilled, (state, action) => {
                state.searchproducts.searchprodloading = false;
                state.searchproducts.searchproddata = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(handlesearchproducts.rejected, (state, action) => {
                state.searchproducts.searchprodloading = false;
                state.searchproducts.searchproderror = action.payload;
                state.searchproducts.searchproddata = [];
            })

            .addCase(getallproducts.pending, (state) => {
                state.allproducts.allproductsloading = true;
                state.allproducts.allproductserror = null;
            })
            .addCase(getallproducts.fulfilled, (state, action) => {
                state.allproducts.allproductsloading = false;
                state.allproducts.allproductsdata = action.payload.products;
                state.allproducts.allproductspagination = action.payload.pagination;
                state.allproducts.allproductsloaded = true;
            })
            .addCase(getallproducts.rejected, (state, action) => {
                state.allproducts.allproductsloading = false;
                state.allproducts.allproductserror = action.payload || "Failed to load products";
            })

    }
})

export const { setSelectedCategory, clearSearchProducts } = ProductSlice.actions;
export default ProductSlice.reducer;