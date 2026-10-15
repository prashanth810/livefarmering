import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLock, FiPlus, FiMapPin } from "react-icons/fi";
import { getcartitems, deleteproductfromcart, removeCartItems } from "../../redux/Slices/AddtocartSlice";
import { handlefetchprofileinfo } from "../../redux/Slices/AuthSlice";
import { getsingleproduct } from "../../redux/Slices/ProductSlice";
import { showErrorToast, showSuccessToast, showWarningToast } from "../../components/Toast";
import AddressModal from "../../reusables/Addressmodal";
import { MdEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import {
    createaddress,
    deleteaddress,
    getalladdress,
    handlemakedefault,
    updateaddress,
} from "../../redux/Slices/AddressSlice";
import DeleteConfirmModal from "../../reusables/DeleteConfirmModal";
import CheckoutSkeleton from "../../reusables/CheckoutSkeleton";

// razor pay
import { placeorder, verifypayment, cancelorder } from "../../redux/Slices/OrderSlice";
import { openRazorpay } from "../../utils/razorpay";

// ---------- config (change as per your business rules) ----------
const TAX_RATE = 0.05;
const MAX_ADDRESSES = 3;

const deliveryOptions = [
    { id: "free", label: "Free Delivery", price: 0, days: 3, note: "Estimated delivery in 2 - 3 business days." },
    { id: "standard", label: "Standard Delivery", price: 40, days: 2, note: "Estimated delivery in 1 - 2 business days." },
    { id: "express", label: "Express Delivery", price: 99, days: 1, note: "Next day delivery." },
];

const paymentOptions = [
    { id: "upi", label: "UPI", note: "Pay using any UPI app. You will be redirected to complete the payment." },
    { id: "cod", label: "Cash on Delivery", note: "Pay with cash when your order is delivered" },
];

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

const formatArrival = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const capitalize = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "");

const getErrorMessage = (error, fallback) =>
    typeof error === "string" ? error : error?.message || fallback;

// ---------- small reusable pieces ----------
const Radio = ({ checked }) => (
    <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${checked ? "border-emerald-600" : "border-gray-300"
            }`}
    >
        {checked && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
    </span>
);

const optionClass = (selected) =>
    `block w-full cursor-pointer border p-4 text-left transition-colors ${selected
        ? "border-emerald-500 bg-[#dff7e9]"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`;

const Section = ({ step, title, action, children }) => (
    <section className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {step}
                </span>
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
            </div>
            {action}
        </div>
        <div className="space-y-3 p-5">{children}</div>
    </section>
);

const CardInput = ({ label, className = "", children }) => (
    <div className={className}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-900">{label}</label>
        {children}
    </div>
);

const cardInputClass =
    "w-full border border-transparent bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none";

// ---------- page ----------
const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector((state) => state.auth.profile.profiledata);
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const cartdata = useSelector((state) => state.cart.carts.cartdata);
    const { getcartloading } = useSelector((state) => state.cart.getcart);
    const { addressloading, addressdata, addresserror } = useSelector((state) => state.address.address);
    const { createaddressloading } = useSelector((state) => state.address.createaddress);
    const { updateaddressloading } = useSelector((state) => state.address.updateaddress);
    const userId = profile?._id || profile?.id || profile?.userId || profile?.user?._id;

    const profileRequestedRef = useRef(false);
    const [profileSettled, setProfileSettled] = useState(false);
    const [cartLoadedForUser, setCartLoadedForUser] = useState(null);
    const [productDetailsById, setProductDetailsById] = useState({});
    const [addressId, setAddressId] = useState(null);
    const [deliveryId, setDeliveryId] = useState("standard");
    const [placing, setPlacing] = useState(false);
    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });

    const location = useLocation();
    const buyNow = location.state?.buyNow || null; // set by the Buy Now button

    const [paymentId, setPaymentId] = useState("upi");

    // add / edit address modal
    const [addressmodel, setAddressmodel] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // null = add mode, address object = edit mode

    // delete address
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ---- addresses straight from the API ----
    const addresses = useMemo(() => {
        if (Array.isArray(addressdata)) return addressdata;
        if (Array.isArray(addressdata?.data)) return addressdata.data;
        return [];
    }, [addressdata]);

    const canAddAddress = addresses.length < MAX_ADDRESSES;

    // selected address: user's pick, otherwise the default one, otherwise the first one
    const selectedAddressId =
        addressId && addresses.some((a) => a._id === addressId)
            ? addressId
            : (addresses.find((a) => a.is_default) || addresses[0])?._id || null;

    // ---- add / edit address ----
    const handleopenaddress = () => {
        if (!canAddAddress) {
            showWarningToast(`You can save up to ${MAX_ADDRESSES} addresses. Delete one to add a new address.`);
            return;
        }
        setEditTarget(null);
        setAddressmodel(true);
    };

    const handleopenedit = (address) => {
        setEditTarget(address);
        setAddressmodel(true);
    };

    const handlecloseaddress = () => {
        setAddressmodel(false);
        setEditTarget(null);
    };

    // one submit handler for both modes
    const handleSubmitAddress = async (formData) => {
        try {
            if (editTarget) {
                await dispatch(updateaddress({ id: editTarget._id, data: formData })).unwrap();
                showSuccessToast("Address updated successfully");
            } else {
                await dispatch(createaddress(formData)).unwrap();
                showSuccessToast("Address added successfully");
            }
            dispatch(getalladdress());
            handlecloseaddress();
        } catch (error) {
            showErrorToast(
                getErrorMessage(error, editTarget ? "Unable to update address" : "Unable to add address")
            );
        }
    };

    // ---- delete address (opens confirm modal, API call only on confirm) ----
    const handleopendelete = (address) => setDeleteTarget(address);
    const handleclosedelete = () => {
        if (!deleting) setDeleteTarget(null);
    };

    const handleconfirmdelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        try {
            await dispatch(deleteaddress(deleteTarget._id)).unwrap();
            showSuccessToast("Address deleted successfully");
            setDeleteTarget(null);
        } catch (error) {
            showErrorToast(getErrorMessage(error, "Unable to delete address"));
        } finally {
            setDeleting(false);
        }
    };

    // ---- select address (calls the default API only if it isn't already the default) ----
    const handleSelectAddress = async (address) => {
        setAddressId(address._id);

        if (address.is_default) return;

        try {
            await dispatch(
                handlemakedefault({
                    addressId: address._id,
                    is_default: true,
                })
            ).unwrap();

            showSuccessToast("Default address updated successfully");
        } catch (error) {
            showErrorToast(getErrorMessage(error, "Unable to update default address"));
        }
    };

    // ---- data fetching ----
    useEffect(() => {
        dispatch(getalladdress());
    }, [dispatch]);

    // fetch profile only ONCE (no retry loop on failure / 429)
    useEffect(() => {
        if (!token || userId || profileRequestedRef.current) return;

        profileRequestedRef.current = true;
        dispatch(handlefetchprofileinfo()).finally(() => setProfileSettled(true));
    }, [dispatch, token, userId]);

    // fetch cart once the user id is known
    useEffect(() => {
        if (!userId) return;

        let active = true;
        dispatch(getcartitems(userId)).finally(() => {
            if (active) setCartLoadedForUser(String(userId));
        });

        return () => {
            active = false;
        };
    }, [dispatch, userId]);

    const rawCartItems = useMemo(() => {
        if (buyNow) {
            return [{
                productId: buyNow.productId,
                name: buyNow.name,
                weight: buyNow.weight,
                quantity: buyNow.quantity,
                price: buyNow.price,
                image: buyNow.image,
            }];
        }
        return Array.isArray(cartdata) ? cartdata : [];
    }, [buyNow, cartdata]);

    const cartProductIdsKey = useMemo(
        () =>
            [...new Set(rawCartItems
                .map((item) => {
                    const productId = item.productId && typeof item.productId === "object"
                        ? item.productId._id
                        : item.productId;
                    return productId ? String(productId) : null;
                })
                .filter(Boolean))].join(","),
        [rawCartItems]
    );

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

    const orderItems = useMemo(
        () =>
            rawCartItems.map((item, index) => {
                const embeddedProduct = item.productId && typeof item.productId === "object" ? item.productId : {};
                const productId = embeddedProduct._id || item.productId;
                const product = embeddedProduct._id
                    ? embeddedProduct
                    : productDetailsById[String(productId)] || {};
                const variant = product.variants?.find((v) => v.weight === item.weight) || product.variants?.[0];

                return {
                    id: `${productId || index}-${item.weight || "unit"}`,
                    productId: String(productId),
                    name: item.name || product.name || "Product",
                    unit: item.weight || item.unit || "",
                    quantity: Number(item.quantity) || 1,
                    price: Number(item.selling_price ?? item.price ?? variant?.selling_price) || 0,
                    image: item.image || item.imageurl || item.thumbnail || product.thumbnail || product.images?.[0] || "",
                };
            }),
        [productDetailsById, rawCartItems]
    );

    const selectedDelivery = deliveryOptions.find((option) => option.id === deliveryId);
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = orderItems.length > 0 ? selectedDelivery.price : 0;

    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    // ---- card field handlers ----
    const handleCardChange = (event) => {
        const { name, value } = event.target;
        let next = value;

        if (name === "number") {
            next = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
        } else if (name === "expiry") {
            const digits = value.replace(/\D/g, "").slice(0, 4);
            next = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
        } else if (name === "cvv") {
            next = value.replace(/\D/g, "").slice(0, 4);
        }

        setCard((prev) => ({ ...prev, [name]: next }));
    };

    const validateCard = () => {
        if (card.number.replace(/\s/g, "").length !== 16) return "Enter a valid 16-digit card number";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return "Enter a valid expiry date (MM/YY)";
        if (card.cvv.length < 3) return "Enter a valid CVV";
        if (!card.name.trim()) return "Enter the name on the card";
        return "";
    };

    // Remove purchased lines from local state immediately, then persist removals via the cart API.
    const clearPurchasedFromCart = async () => {
        const purchasedCartItems = (Array.isArray(cartdata) ? cartdata : []).filter((cartItem) => {
            const cartProductId = cartItem.productId && typeof cartItem.productId === "object"
                ? cartItem.productId._id
                : cartItem.productId;
            const cartWeight = cartItem.weight ?? cartItem.unit ?? "";

            return orderItems.some((orderedItem) =>
                String(orderedItem.productId) === String(cartProductId) &&
                String(orderedItem.unit ?? "") === String(cartWeight)
            );
        });

        if (purchasedCartItems.length === 0) return;

        dispatch(removeCartItems(purchasedCartItems.map((item) => ({
            productId: item.productId && typeof item.productId === "object"
                ? item.productId._id
                : item.productId,
            weight: item.weight ?? item.unit ?? "",
        }))));

        let failedDeletes = 0;
        // Keep API deletes sequential so each request sees the latest server cart.
        for (const item of purchasedCartItems) {
            try {
                await dispatch(
                    deleteproductfromcart({
                        productId: item.productId && typeof item.productId === "object"
                            ? item.productId._id
                            : item.productId,
                        weight: item.weight ?? item.unit ?? "",
                    })
                ).unwrap();
            } catch {
                failedDeletes += 1;
            }
        }

        if (failedDeletes > 0) {
            showWarningToast(
                `Your order was placed, but ${failedDeletes} cart item${failedDeletes === 1 ? " could" : "s could"} not be removed from your saved cart.`
            );
            return;
        }

        if (userId) {
            try {
                await dispatch(getcartitems(userId)).unwrap();
            } catch {
                showWarningToast("Your order was placed and your cart was cleared, but the remaining cart items could not be refreshed.");
            }
        }
    };

    const handlePlaceOrder = async () => {
        if (orderItems.length === 0) {
            showWarningToast("Your cart is empty");
            return;
        }

        if (!selectedAddressId) {
            showWarningToast("Please select a shipping address");
            return;
        }

        const paymentMethod = paymentId === "cod" ? "COD" : "ONLINE";

        let createdOrderId = null;
        let paymentDone = false;
        let paymentResponse = null;

        setPlacing(true);
        try {
            const result = await dispatch(
                placeorder({
                    addressId: selectedAddressId,
                    deliveryId,
                    paymentMethod,
                    items: orderItems.map((item) => ({
                        productId: item.productId,
                        weight: item.unit,
                        quantity: item.quantity,
                    })),
                })
            ).unwrap();

            createdOrderId = result.order._id;

            if (paymentMethod === "ONLINE") {
                paymentResponse = await openRazorpay({
                    order: result.order,
                    razorpay: result.razorpay,
                    profile,
                    onFailed: (message) => showErrorToast(message || "Payment failed. Please try again."),
                });

                paymentDone = true; // money was taken, never cancel after this point

                await dispatch(
                    verifypayment({ orderId: result.order._id, ...paymentResponse })
                ).unwrap();
            }

            // snapshot BEFORE the cart is cleared (orderItems becomes empty after that)
            const orderSummary = {
                orderId: result.order._id,
                createdAt: result.order.createdAt || new Date().toISOString(),
                paymentMethod,
                transactionId: paymentResponse?.razorpay_payment_id || "",
                items: orderItems,
                subtotal,
                shipping,
                tax,
                total,
                address: addresses.find((a) => a._id === selectedAddressId) || null,
                deliveryLabel: selectedDelivery.label,
                estimatedDeliveryFrom: result.order.estimatedDeliveryFrom,
                estimatedDeliveryTo: result.order.estimatedDeliveryTo,
                expectedDelivery: result.order.expectedDelivery ?? formatArrival(selectedDelivery.days),
            };

            await clearPurchasedFromCart();
            navigate("/order-success", { replace: true, state: { orderSummary } });
        } catch (error) {
            // popup closed or payment not completed -> cancel the unpaid order
            if (createdOrderId && paymentMethod === "ONLINE" && !paymentDone) {
                dispatch(cancelorder(createdOrderId));
            }
            showErrorToast(getErrorMessage(error, "Unable to place your order"));
        } finally {
            setPlacing(false);
        }
    };

    // ---- loading / empty states ----
    const showSkeleton =
        getcartloading ||
        (token && !userId && !profileSettled) ||
        (userId && cartLoadedForUser !== String(userId));

    if (showSkeleton) {
        return <CheckoutSkeleton />;
    }

    if (orderItems.length === 0) {
        return (
            <main className="bg-[#f6f7f5] px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
                <p className="mt-2 text-sm text-gray-500">Add some items before checking out.</p>
                <Link
                    to="/shop"
                    className="mt-6 inline-block rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    Continue Shopping
                </Link>
            </main>
        );
    }

    return (
        <main className="bg-[#f6f7f5] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto w-full max-w-[90%]">
                <h1 className="mb-5 text-2xl font-semibold text-gray-800">Checkout</h1>

                <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
                    {/* ---------- left column ---------- */}
                    <div className="space-y-5">
                        {/* 1. Shipping address */}
                        <Section
                            step={1}
                            title="Shipping Address"
                            action={
                                addresses.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleopenaddress}
                                        className="flex cursor-pointer items-center gap-1.5 border border-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white duration-500"
                                    >
                                        <FiPlus className="h-3.5 w-3.5" />
                                        Add New Address
                                    </button>
                                )
                            }
                        >
                            {/* empty state: no saved addresses */}
                            {!addressloading && !addresserror && addresses.length === 0 && (
                                <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                        <FiMapPin className="h-5 w-5" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">No address found</p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Add a shipping address to continue with your order.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleopenaddress}
                                        className="flex cursor-pointer items-center gap-1.5 border border-emerald-600 px-4 py-2 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white duration-500"
                                    >
                                        <FiPlus className="h-3.5 w-3.5" />
                                        Add New Address
                                    </button>
                                </div>
                            )}

                            {addressloading && addresses.length === 0 && (
                                <p className="text-xs text-slate-400">Loading addresses...</p>
                            )}

                            {addresserror && addresses.length === 0 && !addressloading && (
                                <p className="text-xs text-red-500">
                                    {typeof addresserror === "string" ? addresserror : "Unable to load addresses"}
                                </p>
                            )}

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {addresses.slice(0, MAX_ADDRESSES).map((address) => {
                                    const selected = selectedAddressId === address._id;
                                    return (
                                        <div
                                            key={address._id}
                                            role="radio"
                                            aria-checked={selected}
                                            tabIndex={0}
                                            className={optionClass(selected)}
                                            onClick={() => handleSelectAddress(address)}
                                            onKeyDown={(event) => {
                                                if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                                                    event.preventDefault();
                                                    handleSelectAddress(address);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Radio checked={selected} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="truncate text-sm font-semibold text-gray-900">
                                                            {address.full_name}
                                                        </p>
                                                        {address.address_type && (
                                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                                                {capitalize(address.address_type)}
                                                            </span>
                                                        )}
                                                        {address.is_default && (
                                                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-1.5 space-y-0.5 text-xs text-slate-400">
                                                        <p>{address.building_number}</p>
                                                        <p>{address.street}</p>
                                                        {address.landmark && <p>{address.landmark}</p>}
                                                        <p>{address.city}, {address.state} {address.pincode}</p>
                                                        <p>{address.country}</p>
                                                        <p>{address.phone}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        aria-label={`Edit address of ${address.full_name}`}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleopenedit(address);
                                                        }}
                                                        className={`cursor-pointer text-xs font-medium hover:text-emerald-600 duration-300 ${selected ? "text-emerald-600" : "text-slate-400"
                                                            } hover:underline`}
                                                    >
                                                        <MdEdit className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label={`Delete address of ${address.full_name}`}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleopendelete(address);
                                                        }}
                                                        className={`cursor-pointer text-xs font-medium hover:text-red-500 duration-300 ${selected ? "text-red-600" : "text-slate-400"
                                                            } hover:underline`}
                                                    >
                                                        <FaRegTrashCan className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {!canAddAddress && (
                                <p className="text-[11px] text-slate-400">
                                    You have reached the limit of {MAX_ADDRESSES} saved addresses. Delete one to add a new address.
                                </p>
                            )}
                        </Section>

                        {/* 2. Delivery method */}
                        <Section step={2} title="Delivery Method">
                            {deliveryOptions.map((option) => {
                                const selected = deliveryId === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => setDeliveryId(option.id)}
                                        className={optionClass(selected)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Radio checked={selected} />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                                                    <p className="text-sm font-bold text-gray-900">{formatPrice(option.price)}</p>
                                                </div>
                                                <p className="mt-1.5 text-xs text-slate-400">
                                                    {option.note} Arrives by {formatArrival(option.days)}.
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </Section>

                        {/* 3. Payment method */}
                        <Section step={3} title="Payment Method">
                            {paymentOptions.map((option) => {
                                const selected = paymentId === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => setPaymentId(option.id)}
                                        className={optionClass(selected)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Radio checked={selected} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                                                <p className="mt-1.5 text-xs text-slate-400">{option.note}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </Section>
                    </div>

                    {/* ---------- order summary ---------- */}
                    <aside className="border border-gray-200 bg-white lg:sticky lg:top-40">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
                            <span className="text-xs text-slate-400">
                                {orderItems.length} {orderItems.length === 1 ? "Item" : "Items"}
                            </span>
                        </div>

                        <ul className="divide-y divide-gray-100 px-5">
                            {orderItems.map((item) => (
                                <li key={item.id} className="flex items-center gap-3 py-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-11 w-11 shrink-0 border border-gray-100 bg-gray-50 object-contain"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-gray-900">{item.name}</p>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {item.unit && `${item.unit} • `}Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-3 border-t border-gray-100 px-5 py-4 text-xs">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Shipping ({selectedDelivery.label.replace(" Delivery", "")})</span>
                                <span className="font-semibold text-gray-900">{formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax</span>
                                <span className="font-semibold text-gray-900">{formatPrice(tax)}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 px-5 py-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={placing || orderItems.length === 0}
                                className="mt-4 w-full cursor-pointer bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {placing ? "Placing order..." : "Place Order"}
                            </button>

                            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                                <FiLock className="h-3 w-3" />
                                Secure SSL encrypted checkout
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {addressmodel && (
                <AddressModal
                    open={addressmodel}
                    mode={editTarget ? "edit" : "add"}
                    initialData={editTarget}
                    onClose={handlecloseaddress}
                    onSubmit={handleSubmitAddress}
                    loading={createaddressloading || updateaddressloading}
                />
            )}

            <DeleteConfirmModal
                open={Boolean(deleteTarget)}
                onClose={handleclosedelete}
                onConfirm={handleconfirmdelete}
                loading={deleting}
                message={
                    deleteTarget
                        ? `Are you sure you want to delete the address of ${deleteTarget.full_name}? This action cannot be undone.`
                        : undefined
                }
            />
        </main>
    );
};

export default CheckoutPage;