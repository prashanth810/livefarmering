import { productApi } from "../../services/BaseUrl";


const baseurl = '/api/auth/v2';

// create feedback 
export const handlecreatefeedback = async ({ id, data }) => {
    try {
        const resposne = await productApi.post(`${baseurl}/product/${encodeURIComponent(id)}/feedback`, data);
        return resposne;
    }
    catch (error) {
        console.error("Create feedback failed:", error.response?.data || error.message);
        throw error;
    }
}

// use the same axios instance you use for your other product APIs (the one with the product service URL)
export const handlegetallfeedbacks = async ({ productId, page = 1, limit = 5, sort = "latest" }) => {
    return productApi.get(`${baseurl}/product/${productId}/feedback`, { params: { page, limit, sort } });
};