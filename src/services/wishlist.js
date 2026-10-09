import { useDispatch, useSelector } from "react-redux";
import { addwichlist, getwishlistitems, handledecitemswishlist } from "../redux/Slices/AddtocartSlice";
import { showErrorToast, showSuccessToast } from "../components/Toast";

const getProductId = (item) => item?.product?._id ?? item?.productId?._id ?? item?.productId;

export const useWishlist = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.cart.wishlist.wishlistdata);
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const wishlistIds = wishlist.map((item) => String(getProductId(item) ?? ""));

    const isWishlisted = (productId) => wishlist.some(
        (item) => String(getProductId(item)) === String(productId)
    );

    const changeWishlist = async (productId, weight = "") => {
        if (!token) {
            showErrorToast("Please login to update your wishlist");
            return;
        }

        const existingItem = wishlist.find(
            (item) => String(getProductId(item)) === String(productId) &&
                (weight ? String(item.weight ?? "") === String(weight) : true)
        );

        try {
            if (existingItem) {
                await dispatch(handledecitemswishlist({
                    productId,
                    weight: existingItem.weight,
                })).unwrap();
                showSuccessToast(Number(existingItem.quantity) > 1
                    ? "Wishlist quantity updated"
                    : "Removed from wishlist");
            } else {
                await dispatch(addwichlist({
                    productId,
                    weight,
                    quantity: 1,
                })).unwrap();
                showSuccessToast("Added to wishlist");
            }
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to update your wishlist");
        }
    };

    const removeFromWishlist = async (productId, weight = "") => {
        const item = wishlist.find(
            (wishlistItem) => String(getProductId(wishlistItem)) === String(productId) &&
                (weight ? String(wishlistItem.weight ?? "") === String(weight) : true)
        );
        if (!item) return;

        try {
            await dispatch(handledecitemswishlist({
                productId,
                weight: item.weight,
            })).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to remove this item from your wishlist");
        }
    };

    return {
        wishlistIds,
        isWishlisted,
        toggleWishlist: changeWishlist,
        removeFromWishlist,
        refreshWishlist: (page = 1, limit = 10) => dispatch(getwishlistitems({ page, limit })),
    };
};
