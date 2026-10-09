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




// ===========  wish list service apis  =================

// add to wish list
export const handleaddtowishlist = async (data) => {
    try {
        return await cartApi.post(`${baseurl}/wishlist/add`, data);
    }
    catch (error) {
        console.error("Add to wishlist failed:", error.response?.data || error.message);
        throw error;
    }
}

// get my wish list items 
export const handlegetwhichitems = async (page = 1, limit = 10) => {
    try {
        const response = await cartApi.get(`${baseurl}/wishlist/list`, {
            params: { page, limit },
        });
        return response;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}

// handle dec items in wish list
export const handledescreseitem = async (data) => {
    try {
        return await cartApi.delete(`${baseurl}/wishlist/remove`, { data });
    }
    catch (error) {
        console.error("Decrease wishlist item failed:", error.response?.data || error.message);
        throw error;
    }
}


// delete specific product from wish list
export const handledeleteproductfromwishlist = async (data) => {
    try {
        const resposne = await cartApi.delete(`${baseurl}/wishlist/delete`, { data });
        return resposne;
    }
    catch (error) {
        console.error("Delete wishlist item failed:", error.response?.data || error.message);
        throw error;
    }
}