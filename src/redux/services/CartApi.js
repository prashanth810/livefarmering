import { cartApi } from "../../services/BaseUrl";

const baseurl = `/api/auth/v3`;

// add cart
export const handleaddtocart = async (data) => {
    try {
        const response = await cartApi.post(`${baseurl}/cart/addtocart`, data);
        return response;
    } catch (error) {
        console.error("Add to cart failed:", error.response?.data || error.message);
        throw error;
    }
};

// remove cart
export const handleremovecart = async (data) => {
    try {
        const response = await cartApi.post(`${baseurl}/cart/remove`, data);
        return response;
    } catch (error) {
        console.error("Remove from cart failed:", error.response?.data || error.message);
        throw error;
    }
}

// get all cart Items 
export const handlegetcartitems = async (id) => {
    try {
        const response = await cartApi.get(`${baseurl}/cart/mycart/${id}`);
        return response;
    } catch (error) {
        console.error("Get cart failed:", error.response?.data || error.message);
        throw error;
    }
}


export const handledeleteproduct = async ({ productId, weight }) => {
    try {
        const response = await cartApi.delete(
            `${baseurl}/cart/clear/${productId}`,
            {
                data: {
                    weight,
                },
            }
        );

        return response;
    }
    catch (error) {
        console.error("Delete cart item failed:", error.response?.data || error.message);
        throw error;
    }
}