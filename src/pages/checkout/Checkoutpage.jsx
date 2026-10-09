import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCreditCard, FiInfo, FiLock, FiPlus } from "react-icons/fi";
import { getcartitems } from "../../redux/Slices/AddtocartSlice";
import { handlefetchprofileinfo } from "../../redux/Slices/AuthSlice";
import { getsingleproduct } from "../../redux/Slices/ProductSlice";
import { showErrorToast, showSuccessToast, showWarningToast } from "../../components/Toast";
import AddressModal from "../../reusables/Addressmodal";

// ---------- config (change as per your business rules) ----------
const TAX_RATE = 0.05;

const deliveryOptions = [
    { id: "free", label: "Free Delivery", price: 0, days: 2 - 3, note: "Estimated delivery in 2-3 business days." },
    { id: "standard", label: "Standard Delivery", price: 40, days: 2, note: "Estimated delivery in 2-3 business days." },
    { id: "express", label: "Express Delivery", price: 99, days: 1, note: "Next day delivery." },
];

const paymentOptions = [
    { id: "card", label: "Credit / Debit Card", note: "Safe and secure card payment" },
    { id: "upi", label: "UPI", note: "Pay using any UPI app. You will be redirected to complete the payment." },
    { id: "cod", label: "Cash on Delivery", note: "Pay with cash when your order is delivered" },
];

// TODO: replace with addresses coming from your address API / profile
const sampleAddresses = [
    {
        id: "addr-1",
        label: "Home",
        isDefault: true,
        lines: ["123 Green Meadow Lane", "Apartment 4B", "Hyderabad, Telangana 500001"],
        phone: "+91 98765 43210",
    },
    {
        id: "addr-2",
        label: "Office",
        isDefault: false,
        lines: ["4500 Tech Boulevard", "Suite 200", "Hyderabad, Telangana 500081"],
        phone: "+91 98765 65432",
    },
];

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;
// Hides the scrollbar in all browsers (Tailwind 3.1+)
const hideScrollbar = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const formatArrival = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

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
    `block w-full cursor-pointer rounded-md border p-4 text-left transition-colors ${selected
        ? "border-emerald-500 bg-[#dff7e9]"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`;

const Section = ({ step, title, children }) => (
    <section className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {step}
            </span>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
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
    "w-full rounded-md border border-transparent bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none";

// ---------- page ----------
const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profile = useSelector((state) => state.auth.profile.profiledata);
    const profileLoading = useSelector((state) => state.auth.profile.profileloading);
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const cartdata = useSelector((state) => state.cart.carts.cartdata);
    const { getcartloading } = useSelector((state) => state.cart.getcart);
    const userId = profile?._id || profile?.id || profile?.userId || profile?.user?._id;

    const [productDetailsById, setProductDetailsById] = useState({});
    const [addressId, setAddressId] = useState(sampleAddresses[0].id);
    const [deliveryId, setDeliveryId] = useState("standard");
    const [paymentId, setPaymentId] = useState("card");
    const [placing, setPlacing] = useState(false);
    const [addressmodel, setAddressmodel] = useState(false);
    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });

    const handleopenaddress = () => setAddressmodel(true);
    const handlecloseaddress = () => setAddressmodel(false);

    useEffect(() => {
        if (token && !userId && !profileLoading) {
            dispatch(handlefetchprofileinfo());
        }
    }, [dispatch, profileLoading, token, userId]);

    useEffect(() => {
        if (userId) {
            dispatch(getcartitems(userId));
        }
    }, [dispatch, userId]);

    const rawCartItems = useMemo(() => (Array.isArray(cartdata) ? cartdata : []), [cartdata]);

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
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

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

    const handlePlaceOrder = async () => {
        if (orderItems.length === 0) {
            showWarningToast("Your cart is empty");
            return;
        }

        if (paymentId === "card") {
            const cardError = validateCard();
            if (cardError) {
                showErrorToast(cardError);
                return;
            }
        }

        setPlacing(true);
        try {
            // TODO: replace with your order API, e.g.
            // await dispatch(placeorder({ addressId, deliveryId, paymentId, items: orderItems })).unwrap();
            await new Promise((resolve) => setTimeout(resolve, 800));
            showSuccessToast("Order placed successfully!");
            navigate("/");
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to place your order");
        } finally {
            setPlacing(false);
        }
    };

    if (!getcartloading && orderItems.length === 0) {
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
                <h1 className="mb-5 text-2xl font-bold text-gray-900">Checkout</h1>

                <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
                    {/* ---------- left column ---------- */}
                    <div className="space-y-5">
                        {/* 1. Shipping address */}
                        <Section step={1} title="Shipping Address">
                            <div className={`-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 ${hideScrollbar}`}>
                                {sampleAddresses.map((address) => {
                                    const selected = addressId === address.id;
                                    return (
                                        <div
                                            key={address.id}
                                            role="radio"
                                            aria-checked={selected}
                                            tabIndex={0}
                                            onClick={() => setAddressId(address.id)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") setAddressId(address.id);
                                            }}
                                            className={`${optionClass(selected)} w-[260px] shrink-0 snap-start sm:w-[290px]`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Radio checked={selected} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-gray-900">{address.label}</p>
                                                        {address.isDefault && (
                                                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-1.5 space-y-0.5 text-xs text-slate-400">
                                                        {address.lines.map((line) => (
                                                            <p key={line}>{line}</p>
                                                        ))}
                                                        <p>{address.phone}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        // TODO: open edit address form
                                                    }}
                                                    className={`cursor-pointer text-xs font-medium ${selected ? "text-emerald-600" : "text-slate-400"
                                                        } hover:underline`}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Add new address as the last card in the row */}
                                <button
                                    type="button"
                                    onClick={handleopenaddress}
                                    className="flex w-[160px] shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-white text-xs font-medium text-gray-700 transition-colors hover:border-emerald-500 hover:text-emerald-600"
                                >
                                    <FiPlus className="h-4 w-4" />
                                    Add New Address
                                </button>
                            </div>
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
                                const isCard = option.id === "card";
                                return (
                                    <div
                                        key={option.id}
                                        role="radio"
                                        aria-checked={selected}
                                        tabIndex={0}
                                        onClick={() => setPaymentId(option.id)}
                                        onKeyDown={(event) => {
                                            if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                                                setPaymentId(option.id);
                                            }
                                        }}
                                        className={optionClass(selected)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Radio checked={selected} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                                                <p className="mt-1.5 text-xs text-slate-400">{option.note}</p>
                                            </div>
                                            {isCard && (
                                                <span className="rounded bg-gray-100 p-1 text-slate-400">
                                                    <FiCreditCard className="h-3.5 w-3.5" />
                                                </span>
                                            )}
                                        </div>

                                        {isCard && selected && (
                                            <div
                                                className="mt-4 space-y-4 border-t border-emerald-200/70 pt-4"
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <CardInput label="Card Number">
                                                    <div className="relative">
                                                        <FiCreditCard className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            autoComplete="cc-number"
                                                            name="number"
                                                            value={card.number}
                                                            onChange={handleCardChange}
                                                            placeholder="4444 5555 6666 7777"
                                                            className={`${cardInputClass} pl-9`}
                                                        />
                                                    </div>
                                                </CardInput>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <CardInput label="Expiry Date">
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            autoComplete="cc-exp"
                                                            name="expiry"
                                                            value={card.expiry}
                                                            onChange={handleCardChange}
                                                            placeholder="MM/YY"
                                                            className={cardInputClass}
                                                        />
                                                    </CardInput>
                                                    <CardInput label="CVV">
                                                        <div className="relative">
                                                            <input
                                                                type="password"
                                                                inputMode="numeric"
                                                                autoComplete="cc-csc"
                                                                name="cvv"
                                                                value={card.cvv}
                                                                onChange={handleCardChange}
                                                                placeholder="123"
                                                                className={`${cardInputClass} pr-9`}
                                                            />
                                                            <FiInfo
                                                                className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                                                title="3 or 4 digit code on the back of your card"
                                                            />
                                                        </div>
                                                    </CardInput>
                                                </div>

                                                <CardInput label="Name on Card">
                                                    <input
                                                        type="text"
                                                        autoComplete="cc-name"
                                                        name="name"
                                                        value={card.name}
                                                        onChange={handleCardChange}
                                                        placeholder="Name on card"
                                                        className={cardInputClass}
                                                    />
                                                </CardInput>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </Section>
                    </div>

                    {/* ---------- order summary ---------- */}
                    <aside className="rounded-lg border border-gray-200 bg-white lg:sticky lg:top-40">
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
                                        className="h-11 w-11 shrink-0 rounded border border-gray-100 bg-gray-50 object-contain"
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
                                className="mt-4 w-full cursor-pointer rounded-md bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
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
                    onClose={handlecloseaddress}
                />
            )}
        </main>
    );
};

export default CheckoutPage;