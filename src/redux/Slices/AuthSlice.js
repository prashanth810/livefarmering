import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getmyprofielinfo, handlechangepassword, handlegetprofilebyid, handlelogout, handleprofileedit, handlesendotp, handleverifyotp, LoginApi, Registerapi } from "../Apis";

// backend url for the forgot password flow (change if your backend runs on another host/port)
const MAIL_API_URL = "http://localhost:2000/api/auth/mail";

// one helper: always return the real backend message ("Invalid OTP !!!") instead of
// axios' generic "Request failed with status code 400"
const getErrorMessage = (error) =>
    error.response?.data?.message ||
    error.response?.data?.error ||
    (typeof error.response?.data === "string" ? error.response.data : null) ||
    (error.response?.status === 429 ? "Too many requests" : null) ||
    error.message;

// register api
export const handleRegister = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await Registerapi(data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// login api
export const handleLogin = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await LoginApi(data);
        return response.data;
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// send otp
export const sendotp = createAsyncThunk("auth/send-otp", async (data, { rejectWithValue }) => {
    try {
        const response = await handlesendotp(data);
        return response.data;                       // { success, message }
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// verify otp
export const veriyotp = createAsyncThunk("auth/verify-otp", async ({ email, role, otp }, { rejectWithValue }) => {
    try {
        const response = await handleverifyotp({ email, role, otp });
        return response.data;                       // { success, message, token }
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// change password  (arg = { password, token })
export const updatepassword = createAsyncThunk("change/password", async ({ password, token }, { rejectWithValue }) => {
    try {
        const response = await handlechangepassword({ password, token });
        return response.data;                       // { success, message }
    }
    catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

// my profile info
export const handlefetchprofileinfo = createAsyncThunk("auth/profil", async (_, { rejectWithValue }) => {
    try {
        const response = await getmyprofielinfo();
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(error.message);
    }
});

export const fetchprofilebyid = createAsyncThunk(
    "auth/profileById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await handlegetprofilebyid(id);
            return { id: String(id), profile: response.data.data };
        }
        catch (error) {
            return rejectWithValue({
                id: String(id),
                message: getErrorMessage(error) || "Unable to load reviewer profile",
            });
        }
    },
    {
        condition: (id, { getState }) => {
            const reviewerProfiles = getState().auth.reviewerProfiles;
            const key = String(id);
            return Boolean(key)
                && !reviewerProfiles.byId[key]
                && !reviewerProfiles.loadingIds.includes(key);
        },
    }
);

// logout
export const logoutapi = createAsyncThunk("auth/logout", async (token, { rejectWithValue }) => {
    try {
        const response = await handlelogout(token);
        return response.data.data;
    }
    catch (error) {
        return rejectWithValue(error.message);
    }
});

// update profile data
export const updateprofile = createAsyncThunk("auth/edit", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await handleprofileedit({ id, data });
        const payload = response.data;
        return payload?.data?.user ?? payload?.data ?? payload?.user ?? payload;
    }
    catch (error) {
        return rejectWithValue(
            getErrorMessage(error) || "Unable to update your profile"
        );
    }
});


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
            profileupdating: false,
            profileupdateerror: null,
        },
        reviewerProfiles: {
            byId: {},
            loadingIds: [],
            errorById: {},
        },
        sendotp: {
            sendotploading: false,
            sendotpdata: {},
            sendotperror: null,
        },
        verifyotp: {
            verifyotploading: false,
            verifyotpdata: {},
            verifyotperror: null,
        },
        changepassword: {
            changepasswordloading: false,
            changepassworddata: {},
            changepassworderror: null,
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
            // register
            .addCase(handleRegister.pending, (state) => {
                state.register.registerloading = true;
                state.register.registererror = null;
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

            // login
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

            // profile info
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

            .addCase(fetchprofilebyid.pending, (state, action) => {
                const key = String(action.meta.arg);
                if (!state.reviewerProfiles.loadingIds.includes(key)) {
                    state.reviewerProfiles.loadingIds.push(key);
                }
                delete state.reviewerProfiles.errorById[key];
            })
            .addCase(fetchprofilebyid.fulfilled, (state, action) => {
                const { id, profile } = action.payload;
                state.reviewerProfiles.loadingIds = state.reviewerProfiles.loadingIds.filter((key) => key !== id);
                state.reviewerProfiles.byId[id] = profile;
            })
            .addCase(fetchprofilebyid.rejected, (state, action) => {
                const key = action.payload?.id || String(action.meta.arg);
                state.reviewerProfiles.loadingIds = state.reviewerProfiles.loadingIds.filter((id) => id !== key);
                if (action.payload?.message) {
                    state.reviewerProfiles.errorById[key] = action.payload.message;
                }
            })

            // update profile
            .addCase(updateprofile.pending, (state) => {
                state.profile.profileupdating = true;
                state.profile.profileupdateerror = null;
            })
            .addCase(updateprofile.fulfilled, (state, action) => {
                state.profile.profileupdating = false;
                state.profile.profiledata = action.payload;
            })
            .addCase(updateprofile.rejected, (state, action) => {
                state.profile.profileupdating = false;
                state.profile.profileupdateerror = action.payload;
            })

            // send otp
            .addCase(sendotp.pending, (state) => {
                state.sendotp.sendotploading = true;
                state.sendotp.sendotperror = null;
            })
            .addCase(sendotp.fulfilled, (state, action) => {
                state.sendotp.sendotploading = false;
                state.sendotp.sendotpdata = action.payload;
            })
            .addCase(sendotp.rejected, (state, action) => {
                state.sendotp.sendotploading = false;
                state.sendotp.sendotperror = action.payload;
            })

            // verify otp
            .addCase(veriyotp.pending, (state) => {
                state.verifyotp.verifyotploading = true;
                state.verifyotp.verifyotperror = null;
            })
            .addCase(veriyotp.fulfilled, (state, action) => {
                state.verifyotp.verifyotploading = false;   // was true
                state.verifyotp.verifyotpdata = action.payload;
            })
            .addCase(veriyotp.rejected, (state, action) => {
                state.verifyotp.verifyotploading = false;   // was true
                state.verifyotp.verifyotperror = action.payload;
            })

            // change password
            .addCase(updatepassword.pending, (state) => {
                state.changepassword.changepasswordloading = true;
                state.changepassword.changepassworderror = null;
            })
            .addCase(updatepassword.fulfilled, (state, action) => {
                state.changepassword.changepasswordloading = false;
                state.changepassword.changepassworddata = action.payload;
            })
            .addCase(updatepassword.rejected, (state, action) => {
                state.changepassword.changepasswordloading = false;
                state.changepassword.changepassworderror = action.payload;
            })

            // logout
            .addCase(logoutapi.pending, (state) => {
                state.login.loginloading = true;
            })
            .addCase(logoutapi.fulfilled, (state) => {
                state.login.loginloading = false;
                state.login.token = null;
                state.login.logindata = {};
                state.profile.profiledata = null;
                state.register.registerloading = false;
                state.register.token = null;
                state.register.registerdata = {};
                sessionStorage.removeItem("token");
            })
            .addCase(logoutapi.rejected, (state, action) => {
                state.login.loginloading = false;
                state.login.loginerror = action.payload;
            });
    },
});

export const { logout } = AuthSlice.actions;
export default AuthSlice.reducer;