import { authApi } from "../services/BaseUrl";

// regsiter api
export const Registerapi = async (data) => {
    try {
        const response = await authApi.post("/api/auth/v1/register", data);
        return response;
    }
    catch (error) {
        console.log("Error in Registerapi", error);
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

// get all my profile info 
export const getmyprofielinfo = async () => {
    try {
        const response = await authApi.get("/api/auth/v1/myprofile");
        return response;
    }
    catch (error) {
        console.log(error.message);
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
    }
}
