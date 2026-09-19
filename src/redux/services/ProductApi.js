import { productApi } from "../../services/BaseUrl";

const baseurl = `/api/auth/v2`;

//  get all categories only
export const handlegetcategories = async () => {
    try {
        const resposne = await productApi.get(`${baseurl}/allcategories`);
        return resposne;
    }
    catch (error) {
        console.log(error.message);
    }
}

// get products based on the category
export const getproductsbycategory = async (id) => {
    try {
        const response = await productApi.get(`${baseurl}/category/${id}`);
        return response;
    }
    catch (error) {
        console.log(error.message);
    }
}


// get single product FiInfo
export const handlegetsingleproduct = (id) => productApi.get(`${baseurl}/product/${id}`);

// get search by product name 
export const getproductsbysearch = async (search) => {
    const response = await productApi.get(`${baseurl}/allproducts`, {
        params: { search },
    });
    return response;
}