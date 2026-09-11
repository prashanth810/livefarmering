import BaseUrl from "../services/BaseUrl";

export const LoginApi = async (data) => {
    try {
        const resposne = await BaseUrl.post("/api/auth/v1/login", data);
        return resposne.data;
    }
    catch (error) {
        console.log("Error in LoginApi", error);
        throw error;
    };
}