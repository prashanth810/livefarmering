import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getmyprofielinfo, LoginApi, Registerapi } from "../Apis";

// register api
export const handleRegister = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await Registerapi(data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const handleLogin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await LoginApi(data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const handlefetchprofileinfo = createAsyncThunk("auth/profil", async (_, ThunkApi) => {
    try {
        const resposne = await getmyprofielinfo();
        return resposne.data.data;
    }
    catch (error) {
        return ThunkApi.rejectWithValue(error.message);
    }
})

const AuthSlice = createSlice({
    name: "auth",

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
        profile: {
            profileloading: false,
            profiledata: null,
            profileerror: null,
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
            .addCase(handleRegister.pending, (state) => {
                state.register.registerloading = true;
            })
            .addCase(handleRegister.fulfilled, (state, action) => {
                state.register.registerloading = false;
                state.register.registerdata = action.payload.data;
                state.register.token = action.payload.token;
                sessionStorage.setItem("token", action.payload.token);
            })
            .addCase(handleRegister.rejected, (state, action) => {
                state.register.registerloading = false;
                state.register.registererror = action.payload;
            })
            .addCase(handleLogin.pending, (state) => {
                state.login.loginloading = true;
                state.login.loginerror = null;
            })
            .addCase(handleLogin.fulfilled, (state, action) => {
                state.login.loginloading = false;
                state.login.logindata = action.payload.data;
                state.login.token = action.payload.token;
                sessionStorage.setItem("token", action.payload.token);
            })
            .addCase(handleLogin.rejected, (state, action) => {
                state.login.loginloading = false;
                state.login.loginerror = action.payload;
            })
            .addCase(handlefetchprofileinfo.pending, (state) => {
                state.profile.profileloading = true;
                state.profile.profileerror = null;
            })
            .addCase(handlefetchprofileinfo.fulfilled, (state, action) => {
                state.profile.profileloading = false;
                state.profile.profiledata = action.payload;
            })
            .addCase(handlefetchprofileinfo.rejected, (state, action) => {
                state.profile.profileloading = false;
                state.profile.profileerror = action.payload;
            })
    }
})

export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;