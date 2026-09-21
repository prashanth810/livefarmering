import { useEffect, useState } from "react";

const WISHLIST_EVENT = "freshies:wishlist-changed";
let wishlistIds = ["apples", "tomatoes"];

const publishWishlist = (ids) => {
    wishlistIds = ids;
    window.dispatchEvent(new Event(WISHLIST_EVENT));
};

export const toggleWishlist = (productId) => {
    const next = wishlistIds.includes(productId)
        ? wishlistIds.filter((id) => id !== productId)
        : [...wishlistIds, productId];
    publishWishlist(next);
    return next;
};

export const removeFromWishlist = (productId) => {
    publishWishlist(wishlistIds.filter((id) => id !== productId));
};

export const useWishlist = () => {
    const [currentWishlist, setCurrentWishlist] = useState(wishlistIds);

    useEffect(() => {
        const syncWishlist = () => setCurrentWishlist(wishlistIds);
        window.addEventListener(WISHLIST_EVENT, syncWishlist);
        return () => {
            window.removeEventListener(WISHLIST_EVENT, syncWishlist);
        };
    }, []);

    return {
        wishlistIds: currentWishlist,
        isWishlisted: (productId) => currentWishlist.includes(productId),
        toggleWishlist,
        removeFromWishlist,
    };
};