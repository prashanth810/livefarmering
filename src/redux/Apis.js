import BaseUrl from "../services/BaseUrl";

// regsiter api
export const Registerapi = async (data) => {
    try {
        const response = await BaseUrl.post("/api/auth/v1/register", data);
        return response;
    }
    catch (error) {
        console.log("Error in Registerapi", error);
    }
}

export const LoginApi = async (data) => {
    try {
        const resposne = await BaseUrl.post("/api/auth/v1/login", data);
        return resposne;
    }
    catch (error) {
        console.log("Error in LoginApi", error);
        throw error;
    };
}