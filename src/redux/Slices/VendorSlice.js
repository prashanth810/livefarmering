import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handlevendorregister } from "../Apis";


// handle regoster vendor account
export const vendorregister = createAsyncThunk("register/vendor", async (data, ThunkApi) => {
    try {
        const resopsne = await handlevendorregister(data);
        return resopsne.data;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.message);
    }
});

// vendor login 
export const handleLogin = createAsyncThunk("vendor/login", async (data, ThunkApi) => { });

const VendorSlice = createSlice({
    name: "vendor",

    initialState: {
        register: {
            registerloading: false,
            registerdata: {},
            registererror: null,
            token: null,
        },
        login: {
            loginloading: false,
            logindata: {},
            loginerror: null,
            token: null,
        },

    },

    reducers: {
        logout: (state) => {
            state.login.token = null;
            state.login.logindata = {};
            state.profile.profiledata = null;
            sessionStorage.removeItem("token");
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(vendorregister.pending, (state) => {
                state.register.registerloading = true;
            })
            .addCase(vendorregister.fulfilled, (state, action) => {
                state.register.registerloading = false;
                state.register.registerdata = action.payload.data;
                state.register.token = action.payload.token;
                sessionStorage.setItem("token", action.payload.token);
                sessionStorage.setItem("user", action.payload.data);
            })
            .addCase(vendorregister.rejected, (state, action) => {
                state.register.registerloading = false;
                state.register.registererror = action.payload;
            })

            // vendor login 
            .addCase(handleLogin.pending, (state) => {
                state.login.loginloading = true;
                state.login.loginerror = null;
            })
            .addCase(handleLogin.fulfilled, (state, action) => {
                state.login.loginloading = false;
                state.login.logindata = action.payload.data;
                state.login.token = action.payload.token;
                sessionStorage.setItem("token", action.payload.token);
                sessionStorage.setItem("user", action.payload.data);
            })
            .addCase(handleLogin.rejected, (state, action) => {
                state.login.loginloading = false;
                state.login.loginerror = action.payload;
            })

    }
})

export const { logout } = VendorSlice.actions;
export default VendorSlice.reducer;