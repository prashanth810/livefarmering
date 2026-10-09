import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FiMinus,
    FiPlus,
    FiTrash2,
    FiArrowRight,
    FiArrowLeft,
    FiShield,
    FiTrash,
    FiShoppingBag,
    FiShoppingCart,
} from "react-icons/fi";
import { addtocart, deleteproductfromcart, getcartitems, removetocart } from "../../redux/Slices/AddtocartSlice";
import { handlefetchprofileinfo } from "../../redux/Slices/AuthSlice";
import { getsingleproduct } from "../../redux/Slices/ProductSlice";
import { showErrorToast } from "../../components/Toast";
import EmptyCart from "./Emptycart";

const CartPage = () => {
    const dispatch = useDispatch();
    const [promoCode, setPromoCode] = useState("");
    const [productDetailsById, setProductDetailsById] = useState({});
    const [cartLoadedForUser, setCartLoadedForUser] = useState(null);
    const profile = useSelector((state) => state.auth.profile.profiledata);
    const profileLoading = useSelector((state) => state.auth.profile.profileloading);
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const { getcartloading, getcarterror } = useSelector((state) => state.cart.getcart);
    const cartdata = useSelector((state) => state.cart.carts.cartdata);
    const cartloading = useSelector((state) => state.cart.carts.cartloading);
    const userId = profile?._id || profile?.id || profile?.userId || profile?.user?._id;

    useEffect(() => {
        if (token && !userId && !profileLoading) {
            dispatch(handlefetchprofileinfo());
        }
    }, [dispatch, profileLoading, token, userId]);

    useEffect(() => {
        if (userId) {
            dispatch(getcartitems(userId)).then(() => {
                setCartLoadedForUser(String(userId));
            });
        }
    }, [dispatch, userId]);

    const rawCartItems = useMemo(() => {
        return Array.isArray(cartdata) ? cartdata : [];
    }, [cartdata]);

    const cartProductIdsKey = useMemo(() => [...new Set(rawCartItems
        .map((item) => {
            const productId = item.productId && typeof item.productId === "object"
                ? item.productId._id
                : item.productId;
            return productId ? String(productId) : null;
        })
        .filter(Boolean))].join(","), [rawCartItems]);

    useEffect(() => {
        let active = true;
        const productIds = cartProductIdsKey ? cartProductIdsKey.split(",") : [];

        if (productIds.length > 0) {
            Promise.all(productIds.map(async (productId) => {
                try {
                    const product = await dispatch(getsingleproduct(productId)).unwrap();
                    return [productId, product];
                } catch {
                    return [productId, null];
                }
            })).then((products) => {
                if (active) {
                    setProductDetailsById(Object.fromEntries(products.filter(([, product]) => product)));
                }
            });
        }

        return () => {
            active = false;
        };
    }, [cartProductIdsKey, dispatch]);

    const cartItems = useMemo(() => {
        return rawCartItems.map((item, index) => {
            const embeddedProduct = item.productId && typeof item.productId === "object" ? item.productId : {};
            const productId = embeddedProduct._id || item.productId;
            const product = embeddedProduct._id
                ? embeddedProduct
                : productDetailsById[String(productId)] || {};
            const variant = product.variants?.find((productVariant) => productVariant.weight === item.weight)
                || product.variants?.[0];

            return {
                ...item,
                id: `${productId || index}-${item.weight || "unit"}`,
                productId,
                vendor: item.vendor || product.createdby?.name || "",
                name: item.name || product.name || "Product",
                unit: item.weight || item.unit || "",
                price: Number(item.selling_price ?? item.price ?? variant?.selling_price) || 0,
                quantity: Number(item.quantity) || 0,
                stock: Number(variant?.stock ?? variant?.stock_quantity ?? product.stock ?? item.stock),
                image: item.image || item.imageurl || item.thumbnail || product.thumbnail || product.images?.[0] || "",
            };
        });
    }, [productDetailsById, rawCartItems]);

    const refreshCart = async () => {
        if (userId) {
            await dispatch(getcartitems(userId)).unwrap();
        }
    };

    const updateQuantity = async (item, delta) => {
        try {
            if (delta > 0) {
                await dispatch(addtocart({
                    productId: item.productId,
                    name: item.name,
                    weight: item.unit,
                    quantity: 1,
                })).unwrap();
            } else {
                await dispatch(removetocart({
                    productId: item.productId,
                    weight: item.unit,
                })).unwrap();
            }
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to update your cart");
        }
    };

    const removeItem = async (item) => {
        try {
            await dispatch(deleteproductfromcart({
                productId: item.productId,
                weight: item.unit,
            })).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to remove this item from your cart");
        }
    };

    const subtotal = useMemo(
        () =>
            cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartItems]
    );

    const deliveryCharge = 0;
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    const total = subtotal + deliveryCharge + tax;

    return (
        <section className="min-h-screen bg-[#ffffff] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[95%]">
                {/* Breadcrumb */}
                <nav className="mb-4 flex items-center gap-2 text-xs text-gray-400 sm:text-sm">
                    <Link to="/" className="hover:text-green-600">
                        Home
                    </Link>
                    <span>›</span>
                    <span className="font-medium text-green-600">Shopping Cart</span>
                </nav>

                {/* Heading */}
                <h1 className="mb-6 text-xl font-medium text-gray-800 sm:text-3xl">
                    Your Cart{" "}
                    <span className="text-base font-normal text-gray-400 sm:text-lg">
                        ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                    </span>
                </h1>

                {getcartloading || (token && (!userId || cartLoadedForUser !== String(userId))) ? (
                    <p className="bg-white p-10 text-center text-gray-500">Loading your cart...</p>
                ) : getcarterror ? (
                    <>
                        <EmptyCart />
                    </>
                ) : cartItems.length === 0 ? (
                    <div>
                        <EmptyCart />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                        {/* Product details */}
                        <div className="bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 border border-gray-200">
                            <div className="mb-2 hidden items-center justify-between border-b-2 border-gray-300 border-dashed pb-3 sm:flex">
                                <span className="text-md text-gray-800">
                                    Product Details
                                </span>
                                <button className="flex items-center gap-1.5 border border-red-100 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-400 duration-300 cursor-pointer">
                                    <span> <FiShoppingCart /> </span> Clear
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-4 py-5 first:pt-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        {/* Left: image + info */}
                                        <div className="flex items-center gap-4">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 object-cover sm:h-30 sm:w-28"
                                                />
                                            ) : (
                                                <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 sm:h-30 sm:w-28" aria-hidden="true" />
                                            )}
                                            <div className="min-w-0">
                                                {item.vendor && <p className="py-3 text-xs text-gray-400">{item.vendor}</p>}
                                                <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                                    {item.name}
                                                </h3>
                                                <p className="mb-2 text-xs text-gray-400">
                                                    {item.unit}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item)}
                                                    disabled={cartloading}
                                                    className="flex items-center gap-1.5 border border-purple-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-300 duration-300 cursor-pointer"
                                                >
                                                    <FiTrash2 className="h-3.5 w-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right: quantity + price */}
                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                                            <div className="flex items-baseline gap-3">
                                                <p className="text-base font-bold text-gray-900 sm:text-lg">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-xs line-through text-red-800">
                                                    ₹{item.original_price.toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex items-center overflow-hidden bg-[#ebeceb] border border-gray-200 p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        item.quantity <= 1
                                                            ? removeItem(item)
                                                            : updateQuantity(item, -1)
                                                    }
                                                    disabled={cartloading}
                                                    aria-label={
                                                        item.quantity <= 1
                                                            ? `Remove ${item.name} from cart`
                                                            : `Decrease quantity of ${item.name}`
                                                    }
                                                    className={`flex h-6 w-6 items-center justify-center transition-colors bg-[#FFFFFF] cursor-pointer ${item.quantity <= 1
                                                        ? "text-red-500 hover:bg-red-50"
                                                        : "text-gray-500 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {item.quantity <= 1 ? (
                                                        <FiTrash2 className="h-3 w-3" />
                                                    ) : (
                                                        <FiMinus className="h-3 w-3" />
                                                    )}
                                                </button>
                                                <span className="flex h-8 w-9 items-center justify-center text-sm font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item, 1)}
                                                    disabled={cartloading || item.stock === 0 || (item.stock > 0 && item.quantity >= item.stock)}
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                    className={`flex h-6 w-6 items-center justify-center text-gray-500 transition-colors bg-[#FFFFFF] ${cartloading || item.stock === 0 || (item.stock > 0 && item.quantity >= item.stock)
                                                        ? "cursor-not-allowed opacity-40"
                                                        : "cursor-pointer hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <FiPlus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                            <div className="bg-white p-4 shadow-sm sm:p-6 border border-gray-200">
                                <h2 className="mb-4 text-base font-bold text-gray-900 sm:text-lg">
                                    Order Summary
                                </h2>

                                <div className="mb-5 flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(event) => setPromoCode(event.target.value)}
                                        placeholder="Discount code or gift card"
                                        className="w-full min-w-0 flex-1 border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-green-500 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        className="shrink-0 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200"
                                    >
                                        Apply
                                    </button>
                                </div>

                                <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Items Subtotal</span>
                                        <span className="font-semibold text-gray-800">
                                            ₹{subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Delivery Charges</span>
                                        <span className="font-semibold text-green-600">
                                            {deliveryCharge === 0
                                                ? "Free"
                                                : `₹${deliveryCharge.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">
                                            Estimated Tax ({(taxRate * 100).toFixed(0)}%)
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            ₹{tax.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-4">
                                    <span className="text-base font-bold text-gray-900">
                                        Total Amount
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>

                                <Link to="/checkout">
                                    <button
                                        type="button"
                                        className="mb-3 flex w-full items-center justify-center gap-2 bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                                    >
                                        Proceed to Checkout
                                        <FiArrowRight className="h-4 w-4" />
                                    </button>
                                </Link>

                                <Link
                                    to="/shop"
                                    className="flex w-full items-center justify-center gap-2 border border-gray-300 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
                                >
                                    <FiArrowLeft className="h-4 w-4" />
                                    Continue Shopping
                                </Link>
                            </div>

                            <div className="flex items-center gap-3 bg-[#027810dc] p-4 text-white shadow-sm">
                                <FiShield className="h-8 w-8 shrink-0" />
                                <p className="text-xs font-medium sm:text-sm">
                                    Safe and secure payments. 100% authentic products directly
                                    from trusted vendors.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CartPage;