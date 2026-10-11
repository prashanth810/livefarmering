import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleaddaddress, handledeleteaddress, handlegetaddresses } from "../services/CheckoutApi";

// get all address specific user
export const getalladdress = createAsyncThunk("address/getall", async (_, ThunkAPI) => {
    try {
        const resposne = await handlegetaddresses();
        return resposne.data.data;
    }
    catch (error) {
        return ThunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// create new address
export const createaddress = createAsyncThunk("address/create", async (data, ThunkAPI) => {
    try {
        const resposne = await handleaddaddress(data);
        return resposne.data.data;
    }
    catch (error) {
        return ThunkAPI.rejectWithValue(error.response?.data || error.message);
    }
});

// delete address 
export const deleteaddress = createAsyncThunk("delete/address", async (id, ThunkApi) => {
    try {
        await handledeleteaddress(id);
        return id;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.response?.data || error.message);
    }
})

const initialState = {
    address: {
        addressloading: false,
        addressdata: [],
        addresserror: null,
    },
    createaddress: {
        createaddressloading: false,
        createaddressdata: [],
        createaddresserror: null,
    },
    deleteaddress: {
        deleteaddressloading: false,
        deleteaddresserror: null,
    },
};

const AddressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get all address specific user
            .addCase(getalladdress.pending, (state) => {
                state.address.addressloading = true;
                state.address.addresserror = null;
            })
            .addCase(getalladdress.fulfilled, (state, action) => {
                state.address.addressloading = false;
                state.address.addressdata = action.payload;
            })
            .addCase(getalladdress.rejected, (state, action) => {
                state.address.addressloading = false;
                state.address.addresserror = action.payload;
            })

            // create new address
            .addCase(createaddress.pending, (state) => {
                state.createaddress.createaddressloading = true;
                state.createaddress.createaddresserror = null;
            })
            .addCase(createaddress.fulfilled, (state, action) => {
                state.createaddress.createaddressloading = false;
                state.createaddress.createaddressdata = action.payload;
            })
            .addCase(createaddress.rejected, (state, action) => {
                state.createaddress.createaddressloading = false;
                state.createaddress.createaddresserror = action.payload;
            })

            // delete address
            .addCase(deleteaddress.pending, (state) => {
                state.deleteaddress.deleteaddressloading = true;
                state.deleteaddress.deleteaddresserror = null;
            })
            .addCase(deleteaddress.fulfilled, (state, action) => {
                state.deleteaddress.deleteaddressloading = false;
                // remove it from the list straight away, no refetch needed
                state.address.addressdata = state.address.addressdata.filter(
                    (item) => item._id !== action.meta.arg
                );
            })
            .addCase(deleteaddress.rejected, (state, action) => {
                state.deleteaddress.deleteaddressloading = false;
                state.deleteaddress.deleteaddresserror = action.payload;
            });
    },
});

export default AddressSlice.reducer;