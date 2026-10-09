import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiArrowRight, FiHeart, FiMinus, FiPlus, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { addtocart, addwichlist, deletewishlistitem, getwishlistitems, handledecitemswishlist } from "../../redux/Slices/AddtocartSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast";

const WishlistPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const { wishlistdata, wishlistloading, wishlisterror, wishlistpagination, wishlistupdating } = useSelector((state) => state.cart.wishlist);

    useEffect(() => {
        if (token) {
            dispatch(getwishlistitems({ page, limit: 10 }));
        }
    }, [dispatch, page, token]);

    const items = useMemo(() => wishlistdata.map((item, index) => {
        const product = item.product || (typeof item.productId === "object" ? item.productId : {});
        const productId = product?._id || item.productId;
        const variant = product?.variants?.find((productVariant) => productVariant.weight === item.weight)
            || product?.variants?.[0];
        const quantity = Number(item.quantity);
        const id = item._id || `${productId || index}-${item.weight || "unit"}`;

        return {
            ...item,
            id,
            productId,
            name: product?.name || item.name || "Product",
            vendor: item.vendor || product?.createdby?.name || "Local vendor",
            image: item.image || item.imageurl || item.thumbnail || product?.thumbnail || product?.images?.[0] || "",
            price: Number(item.selling_price ?? item.price ?? variant?.selling_price ?? variant?.price) || 0,
            Originalprice: Number(item.original_price ?? item.price ?? variant?.original_price ?? variant?.price) || 0,
            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        };
    }), [wishlistdata]);

    const estimatedValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPages = Number(wishlistpagination?.totalPages) || 1;
    const savedItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const updateQuantity = async (item, delta) => {
        if (!token) {
            showErrorToast("Please login to update your wishlist");
            navigate("/login");
            return;
        }

        try {
            const action = delta > 0
                ? addwichlist({
                    productId: item.productId,
                    weight: item.weight,
                    quantity: 1,
                    page,
                    limit: 10,
                })
                : handledecitemswishlist({
                    productId: item.productId,
                    weight: item.weight,
                    page,
                    limit: 10,
                });
            await dispatch(action).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to update wishlist quantity");
        }
    };

    const handleAddToCart = async (item) => {
        if (!token) {
            showErrorToast("Please login to add items to your cart");
            navigate("/login");
            return;
        }

        const productId = item.productId?._id ?? item.productId;

        try {
            // 1. add to cart
            await dispatch(addtocart({
                productId,
                name: item.name,
                weight: item.weight,
                quantity: item.quantity,
            })).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to add this item to your cart");
            return; // stop here, item stays in wishlist
        }

        try {
            // 2. remove the same product + weight from wishlist
            await dispatch(deletewishlistitem({
                productId,
                weight: item.weight,
            })).unwrap();
            showSuccessToast(`${item.name} moved to cart`);
        } catch (error) {
            // cart add worked, only the wishlist cleanup failed
            showSuccessToast(`${item.name} added to cart`);
            showErrorToast("Could not remove it from your wishlist");
        }
    };

    return (
        <section className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[95%]">
                <nav className="mb-4 flex items-center gap-2 text-xs text-gray-400 sm:text-sm">
                    <Link to="/" className="hover:text-green-600">Home</Link>
                    <span>›</span>
                    <span className="font-medium text-green-600">Wishlist</span>
                </nav>
                <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Your Wishlist{" "}
                    <span className="text-base font-normal text-gray-400 sm:text-lg">
                        ({savedItemCount} {savedItemCount === 1 ? "item" : "items"})
                    </span>
                </h1>

                {!token ? (
                    <div className="bg-white p-10 text-center shadow-sm">
                        <FiHeart className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                        <p className="mb-4 text-gray-500">Please sign in to view your wishlist.</p>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                            Sign In
                        </Link>
                    </div>
                ) : wishlistloading ? (
                    <p className="bg-white p-10 text-center text-gray-500">Loading your wishlist...</p>
                ) : wishlisterror ? (
                    <div role="alert" className="bg-white p-10 text-center text-red-600">
                        {wishlisterror}
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white p-10 text-center shadow-sm">
                        <FiHeart className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                        <p className="mb-4 text-gray-500">Your wishlist is empty.</p>
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                            <FiArrowLeft className="h-4 w-4" /> Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                        <div className="bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
                            <div className="mb-2 hidden items-center justify-between border-b border-gray-100 pb-3 sm:flex">
                                <span className="text-sm font-semibold text-gray-700">Product Details</span>
                                <span className="text-sm font-semibold text-gray-700">Price</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-4 py-5 first:pt-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 bg-gray-50 object-cover sm:h-28 sm:w-28" />
                                            ) : (
                                                <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-gray-50 text-gray-300 sm:h-28 sm:w-28">
                                                    <FiShoppingBag className="h-8 w-8" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="py-1 text-xs text-gray-400">{item.vendor}</p>
                                                {item.productId ? (
                                                    <Link to={`/product-details/${item.productId}`} className="block truncate text-sm font-semibold text-gray-900 hover:text-green-600 sm:text-base">{item.name}</Link>
                                                ) : (
                                                    <p className="text-sm font-semibold text-gray-900 sm:text-base">{item.name}</p>
                                                )}
                                                <p className="mb-2 text-xs text-gray-400">{item.weight || "Standard weight"}</p>

                                                <div
                                                    className="flex w-fit items-center overflow-hidden border border-gray-200 bg-[#ebeceb] p-0.5"
                                                    aria-label={`Quantity for ${item.name}`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item, -1)}
                                                        disabled={wishlistupdating}
                                                        aria-label={`Decrease quantity of ${item.name}`}
                                                        className="flex h-7 w-7 items-center justify-center bg-white text-gray-500 transition-colors hover:bg-amber-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                                    >
                                                        <FiMinus className="h-3.5 w-3.5" />
                                                    </button>

                                                    <span
                                                        className="flex h-7 w-9 items-center justify-center text-sm font-semibold text-gray-800"
                                                        aria-live="polite"
                                                    >
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item, 1)}
                                                        disabled={wishlistupdating}
                                                        aria-label={`Increase quantity of ${item.name}`}
                                                        className="flex h-7 w-7 items-center justify-center bg-white text-gray-500 transition-colors hover:bg-green-100 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                                                    >
                                                        <FiPlus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                {item.productError && (
                                                    <p className="mb-2 text-xs text-amber-700">Product details could not be loaded: {item.productError}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">

                                            <div className="flex items-baseline gap-3">
                                                <p className="text-base font-bold text-gray-900 sm:text-lg">
                                                    ₹{item.price.toFixed(2)}
                                                </p>
                                                <p className="text-xs line-through text-red-800">
                                                    ₹{item.Originalprice.toFixed(2)}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!item.productId}
                                                className="flex items-center gap-1.5 bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <FiShoppingCart className="h-3.5 w-3.5" /> Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                                        disabled={page <= 1}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FiArrowLeft className="h-4 w-4" /> Previous
                                    </button>
                                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                                    <button
                                        type="button"
                                        onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                                        disabled={page >= totalPages}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next <FiArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
                            <div className="bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-4 text-base font-bold text-gray-900 sm:text-lg">Wishlist Summary</h2>
                                <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
                                    <div className="flex items-center justify-between"><span className="text-gray-500">Saved items</span><span className="font-semibold text-gray-800">{savedItemCount}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-gray-500">Estimated value</span><span className="font-semibold text-gray-800">₹{estimatedValue.toFixed(2)}</span></div>
                                </div>
                                <Link to="/shop" className="mt-5 flex w-full items-center justify-center gap-2 bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600">Continue Shopping <FiArrowRight className="h-4 w-4" /></Link>
                            </div>
                            <div className="flex items-center gap-3 bg-[#027810dc] p-4 text-white shadow-sm">
                                <FiHeart className="h-8 w-8 shrink-0" />
                                <p className="text-xs font-medium sm:text-sm">Save your favorite fresh products here and come back when you are ready.</p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WishlistPage;
