import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiMinus,
    FiPlus,
    FiTrash2,
    FiArrowRight,
    FiArrowLeft,
    FiShield,
} from "react-icons/fi";

const initialCartItems = [
    {
        id: "broccoli",
        vendor: "Daily Fresh",
        name: "Organic Green Broccoli",
        unit: "500 g",
        price: 2.49,
        quantity: 2,
        image:
            "https://media.istockphoto.com/id/1135308302/photo/broccoli-on-white.jpg?s=612x612&w=0&k=20&c=ONhL9A0yMth8m-83Z8eAwzAsDeKU81IcpZc-2rVDMJo=",
    },
    {
        id: "eggs",
        vendor: "Healthy Choice",
        name: "Farm Fresh Brown Eggs",
        unit: "12 Pack",
        price: 6.99,
        quantity: 1,
        image:
            "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=85",
    },
    {
        id: "sourdough",
        vendor: "Farmhouse Bakery",
        name: "Whole Wheat Sourdough",
        unit: "400 g",
        price: 4.5,
        quantity: 1,
        image:
            "https://images.squarespace-cdn.com/content/v1/5c2d2d10b27e398709a72eb2/1614011918348-WXUWPCYXGJ0YBJYM1TF1/20_percent_wheat_sourdough-10.jpg",
    },
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [promoCode, setPromoCode] = useState("");

    const updateQuantity = (id, delta) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
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
        <section className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
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
                <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Your Cart{" "}
                    <span className="text-base font-normal text-gray-400 sm:text-lg">
                        ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                    </span>
                </h1>

                {cartItems.length === 0 ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="mb-4 text-gray-500">Your cart is empty.</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                        {/* Product details */}
                        <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
                            <div className="mb-2 hidden items-center justify-between border-b border-gray-100 pb-3 sm:flex">
                                <span className="text-sm font-semibold text-gray-700">
                                    Product Details
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                    Quantity &amp; Price
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-4 py-5 first:pt-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        {/* Left: image + info */}
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 object-cover sm:h-30 sm:w-28"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400 py-3">{item.vendor}</p>
                                                <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                                    {item.name}
                                                </h3>
                                                <p className="mb-2 text-xs text-gray-400">
                                                    {item.unit}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-1.5 border border-purple-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-300 duration-300 cursor-pointer"
                                                >
                                                    <FiTrash2 className="h-3.5 w-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right: quantity + price */}
                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                                            <div className="text-left sm:text-right">
                                                <p className="text-base font-bold text-gray-900 sm:text-lg">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    ${item.price.toFixed(2)} / each
                                                </p>
                                            </div>

                                            <div className="flex items-center overflow-hidden bg-[#ebeceb] border border-gray-200 p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                    className="flex h-6 w-6 items-center justify-center text-gray-500 transition-colors bg-[#FFFFFF] hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <FiMinus className="h-3 w-3" />
                                                </button>
                                                <span className="flex h-8 w-9 items-center justify-center text-sm font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                    className="flex h-6 w-6 items-center justify-center text-gray-500 transition-colors bg-[#FFFFFF]  hover:bg-gray-50 cursor-pointer"
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
                            <div className="bg-white p-4 shadow-sm sm:p-6">
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
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Delivery Charges</span>
                                        <span className="font-semibold text-green-600">
                                            {deliveryCharge === 0
                                                ? "Free"
                                                : `$${deliveryCharge.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">
                                            Estimated Tax ({(taxRate * 100).toFixed(0)}%)
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            ${tax.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-4">
                                    <span className="text-base font-bold text-gray-900">
                                        Total Amount
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="mb-3 flex w-full items-center justify-center gap-2 bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                                >
                                    Proceed to Checkout
                                    <FiArrowRight className="h-4 w-4" />
                                </button>

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