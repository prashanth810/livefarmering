import { orderApi } from "./BaseUrl";


const baseurl = `/api/auth/v5`;

// order placed
export const handleplaceorder = async (data) => {
    try {
        return await orderApi.post(`${baseurl}/order/place`, data);
    } catch (error) {
        console.error("Place order failed:", error.response?.data || error.message);
        throw error;
    }
};

// get my all orders
export const handlegetmyorders = async ({ limit = 10, page = 1 }) => {
    try {
        return await orderApi.get(`${baseurl}/order/my-orders`, {
            limit, page
        });
    } catch (error) {
        console.error("Get orders failed:", error.response?.data || error.message);
        throw error;
    }
};

// see specific order info
export const handlegetsingleorder = async (orderId) => {
    try {
        return await orderApi.get(`${baseurl}/order/${orderId}`);
    } catch (error) {
        console.error("Get order failed:", error.response?.data || error.message);
        throw error;
    }
};

// CHANGE this path to your real payment verify route
export const handleverifypayment = async (data) => {
    try {
        return await orderApi.post(`${baseurl}/payment/verify`, data);
    } catch (error) {
        console.error("Verify payment failed:", error.response?.data || error.message);
        throw error;
    }
};

// cancel order
export const handlecancelorder = async (orderId) => {
    try {
        return await orderApi.post(`${baseurl}/order/${orderId}/cancel`);
    } catch (error) {
        console.error("Cancel order failed:", error.response?.data || error.message);
        throw error;
    }
};