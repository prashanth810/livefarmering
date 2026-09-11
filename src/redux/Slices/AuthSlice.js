import { createSlice } from "@reduxjs/toolkit";


const AuthSlice = createSlice({
    name: "auth",

    initialState: {
        authloginloading: false,
        authlogindata: {},
        autherror: null,
        token: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
        // .addCase()
    }
})

export default AuthSlice.reducer;