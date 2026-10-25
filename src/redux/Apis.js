import { authApi } from "../services/BaseUrl";

// regsiter api
export const Registerapi = async (data) => {
    try {
        const response = await authApi.post("/api/auth/v1/register", data);
        return response;
    }
    catch (error) {
        console.log("Error in Registerapi", error);
        throw error;
    }
}

// login 
export const LoginApi = async (data) => {
    try {
        const resposne = await authApi.post("/api/auth/v1/login", data);
        return resposne;
    }
    catch (error) {
        console.log("Error in LoginApi", error);
        throw error;
    };
}

// send otp
export const handlesendotp = async (data) => {
    try {
        const response = await authApi.post(`/api/auth/mail/send-otp`, data);
        return response;
    }
    catch (error) {
        console.error(error.message);
    }
}

// verify otp
export const handleverifyotp = async ({ email, otp, role }) => {
    try {
        const resposne = await authApi.post(`/api/auth/mail/verify-otp`, { email, otp, role });
        return resposne;
    }
    catch (error) {
        console.error(error.message);
    }
}

// change password
// change password (reset flow = token from verify-otp, settings flow = login token + currentPassword)
export const handlechangepassword = async ({ password, token }) => {
    try {
        const response = await authApi.patch(
            `/api/auth/mail/change-password`,
            { password },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response;
    }
    catch (error) {
        console.error("Change password failed:", error.response?.data || error.message);
        throw error;
    }
}

// get all my profile info 
export const getmyprofielinfo = async () => {
    try {
        const response = await authApi.get("/api/auth/v1/myprofile");
        return response;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}

// get a user's public profile
export const handlegetprofilebyid = async (id) => {
    try {
        return await authApi.get(`/api/auth/v1/profile/${encodeURIComponent(id)}`);
    }
    catch (error) {
        console.error("User profile lookup failed:", error.response?.data || error.message);
        throw error;
    }
}

// vendor register
export const handlevendorregister = async (data) => {
    try {
        const resposne = await authApi.post("/api/auth/v1/vendor/register", data);
        return resposne;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}

// logout api
export const handlelogout = async (token) => {
    try {
        const response = await authApi.post("/api/auth/v1/logout", { token });
        return response;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
}

// update profile 
export const handleprofileedit = async ({ id, data }) => {
    try {
        const response = await authApi.put(
            `/api/auth/v1/profile/${encodeURIComponent(id)}`,
            data,
            data instanceof FormData
                ? { headers: { "Content-Type": "multipart/form-data" } }
                : undefined
        );
        return response;
    }
    catch (error) {
        console.error("Profile update failed:", error.response?.data || error.message);
        throw error;
    }
}


// reset password 
export const handleresetpassword = async ({ currentPassword, password }) => {
    try {
        const response = await authApi.post(`/api/auth/v1/reset-password`, { currentPassword, password });
        return response;
    }
    catch (error) {
        console.error(error.message);
    }
}


// delete account 
export const handledeleteaccount = async ({ id, confirm }) => {
    try {
        const resposne = await authApi.delete(`/api/auth/v1/account/${id}`,
            {
                data: { confirm }, // axios needs `data` for a DELETE body
            }
        );
        return resposne;
    }
    catch (error) {
        console.error(error.message);
    }
}