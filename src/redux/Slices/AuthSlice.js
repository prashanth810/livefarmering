import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Registerapi } from "../Apis";

// register api
export const handleRegister = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await Registerapi(data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
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

    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(handleRegister.pending, (state) => {
                state.register.registerloading = true;
            })
            .addCase(handleRegister.fulfilled, (state, action) => {
                state.register.registerloading = false;
                state.register.registerdata = action.payload.data;
                state.register.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(handleRegister.rejected, (state, action) => {
                state.register.registerloading = false;
                state.register.registererror = action.payload;
            })
    }
})

export default AuthSlice.reducer;