import { addressApi } from "../../services/BaseUrl";


const baseurl = `/api/auth/v4`;

// get all adddress specific user
export const handlegetaddresses = async () => {
    try {
        const response = await addressApi.get(`${baseurl}/address/all`);
        return response;
    } catch (error) {
        console.error("Add to cart failed:", error.response?.data || error.message);
        throw error;
    }
};

// add new address
export const handleaddaddress = async (data) => {
    try {
        const response = await addressApi.post(`${baseurl}/address/add`, data);
        return response;
    } catch (error) {
        console.error("Add address failed:", error.response?.data || error.message);
        throw error;
    }
};

// delete address
export const handledeleteaddress = async (id) => {
    try {
        const response = await addressApi.delete(`${baseurl}/address/delete/${id}`);
        return response;
    }
    catch (error) {
        console.error("Delete address failed:", error.response?.data || error.message);
        throw error;
    }
}