import { useEffect, useState } from "react";

const STORAGE_KEY = "freshies-wishlist";
const WISHLIST_EVENT = "freshies:wishlist-changed";

const readWishlist = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
};

const publishWishlist = (ids) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(WISHLIST_EVENT));
};

export const toggleWishlist = (productId) => {
    const current = readWishlist();
    const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
    publishWishlist(next);
    return next;
};

export const removeFromWishlist = (productId) => {
    publishWishlist(readWishlist().filter((id) => id !== productId));
};

export const useWishlist = () => {
    const [wishlistIds, setWishlistIds] = useState(readWishlist);

    useEffect(() => {
        const syncWishlist = () => setWishlistIds(readWishlist());
        window.addEventListener(WISHLIST_EVENT, syncWishlist);
        window.addEventListener("storage", syncWishlist);
        return () => {
            window.removeEventListener(WISHLIST_EVENT, syncWishlist);
            window.removeEventListener("storage", syncWishlist);
        };
    }, []);

    return {
        wishlistIds,
        isWishlisted: (productId) => wishlistIds.includes(productId),
        toggleWishlist,
        removeFromWishlist,
    };
};