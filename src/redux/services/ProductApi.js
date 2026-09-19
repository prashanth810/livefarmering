import { productApi } from "../../services/BaseUrl";

//  get all categories only
export const handlegetcategories = async () => {
    try {
        const resposne = await productApi.get("/api/auth/v2/allcategories");
        return resposne;
    }
    catch (error) {
        console.log(error.message);
    }
}

// get products based on the category
export const getproductsbycategory = async (id) => {
    try {
        const response = await productApi(`/api/auth/v2/category/${id}`);
        return response;
    }
    catch (error) {
        console.log(error.message);
    }
}


// get single product FiInfo
export const handlegetsingleproduct = (id) => productApi(`/api/auth/v2/product/${id}`);
