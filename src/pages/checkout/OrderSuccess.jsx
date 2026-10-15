import { memo, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
    FiCheck,
    FiChevronLeft,
    FiFileText,
    FiMapPin,
    FiTruck,
    FiCreditCard,
    FiShoppingCart,
    FiBell,
    FiTag,
    FiPackage,   // new
    FiHome,
} from "react-icons/fi";
import { formatEstimatedDelivery } from "../profile/Orderutils";

const money = (value) => `₹${Number(value || 0).toFixed(2).replace(/\.00$/, "")}`;

const formatDateTime = (value) => {
    const d = value ? new Date(value) : new Date();
    const date = d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
};

const Card = ({ icon: Icon, title, children, className = "" }) => (
    <section className={`border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
        <div className="mb-4 flex items-center gap-3">
            <Icon className="h-5 w-5 text-gray-800" />
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        {children}
    </section>
);

const Meta = ({ label, children }) => (
    <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <div className="mt-1 text-sm font-semibold text-gray-900">{children}</div>
    </div>
);

const Step = ({ icon: Icon, label, sub, state, isLast = false, lineActive = false }) => {
    // state: "done" | "active" | "todo"
    const circle =
        state === "done"
            ? "bg-emerald-600 text-white border-emerald-600"
            : state === "active"
                ? "bg-white text-emerald-600 border-emerald-600 ring-4 ring-emerald-100"
                : "bg-gray-100 text-gray-400 border-gray-300";

    return (
        <div className="relative flex flex-1 flex-col items-center text-center">
            {/* dotted line from this circle to the next one */}
            {!isLast && (
                <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-[18px] w-full border-t-2 border-dotted ${lineActive ? "border-emerald-500" : "border-gray-300"
                        }`}
                />
            )}

            <span
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${circle}`}
            >
                <Icon className="h-4 w-4" />
            </span>

            <p className={`mt-2 text-xs font-semibold ${state === "todo" ? "text-gray-500" : "text-emerald-700"}`}>
                {label}
            </p>
            {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
        </div>
    );
};

// Tip: download this mp4 into /public (e.g. /public/payment-success.mp4) and use "/payment-success.mp4"
// so it loads from your own server (faster + no dependency on an external site).
const SUCCESS_VIDEO_SRC =
    "https://cdnl.iconscout.com/lottie/free/preview/free-payment-success-animation-gif-download-12637225.mp4";

// Silent, looping, control-less video. memo() => never re-renders with the page.
const SuccessVideo = memo(({ src = SUCCESS_VIDEO_SRC }) => {
    const videoRef = useRef(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = true; // required for autoplay in browsers
        const playing = video.play();
        if (playing && typeof playing.catch === "function") playing.catch(() => { });

        // pause when the tab is hidden, resume when visible (saves CPU / battery)
        const onVisibility = () => {
            if (document.hidden) video.pause();
            else video.play().catch(() => { });
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            video.pause();
            video.removeAttribute("src");
            video.load(); // release the network / memory
        };
    }, []);

    // fixed size box => no layout shift while the video loads
    return (
        <div className="mx-auto h-28 w-28 select-none overflow-hidden" aria-hidden="true">
            {failed ? (
                <span
                    style={{ animation: "check-pop 0.6s ease-out both" }}
                    className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/30"
                >
                    <FiCheck className="h-9 w-9 text-white" strokeWidth={3} />
                </span>
            ) : (
                <video
                    ref={videoRef}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    tabIndex={-1}
                    onError={() => setFailed(true)}
                    onContextMenu={(e) => e.preventDefault()}
                    className="pointer-events-none h-full w-full object-contain mix-blend-multiply"
                />
            )}
        </div>
    );
});
SuccessVideo.displayName = "SuccessVideo";

const CONFETTI_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7", "#facc15", "#ec4899"];

const Confetti = ({ count = 70, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    // random pieces are created once
    const [pieces] = useState(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,                       // % from left
            size: 6 + Math.random() * 8,                     // px
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            delay: Math.random() * 1.5,                      // s
            fall: 2.8 + Math.random() * 2.2,                 // s
            drift: (Math.random() - 0.5) * 160,              // px sideways
            spin: 360 + Math.random() * 720,                 // deg
            round: Math.random() > 0.7,
        }))
    );

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
            {pieces.map((p) => (
                <span
                    key={p.id}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.round ? p.size : p.size * 0.45,
                        backgroundColor: p.color,
                        borderRadius: p.round ? "50%" : "2px",
                        "--drift": `${p.drift}px`,
                        "--spin": `${p.spin}deg`,
                        animation: `confetti-fall ${p.fall}s ${p.delay}s ease-in forwards`,
                        opacity: 0,
                    }}
                />
            ))}
        </div>
    );
};

const OrderSuccess = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const summary = state?.orderSummary;

    // opened directly / refreshed without data -> nothing to show
    if (!summary) return <Navigate to="/orders" replace />;

    const {
        orderId,
        createdAt,
        paymentMethod, // "COD" | "ONLINE"
        transactionId,
        items = [],
        subtotal = 0,
        shipping = 0,
        tax = 0,
        total = 0,
        address,
        deliveryLabel,
    } = summary;

    const { date, time } = formatDateTime(createdAt);
    const expectedDelivery = formatEstimatedDelivery(summary) || "Not available";
    const isCod = paymentMethod === "COD";
    const methodLabel = isCod ? "Cash on Delivery" : "UPI (Razorpay)";
    const shortId = String(orderId || "").slice(-8).toUpperCase();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <main className="bg-[#f6f7f5] px-4 py-6 sm:px-6 lg:px-8">
            <style>{`
                @keyframes confetti-fall {
                    0%   { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 1; }
                    80%  { opacity: 1; }
                    100% { transform: translate3d(var(--drift), 110vh, 0) rotate(var(--spin)); opacity: 0; }
                }
                @keyframes check-pop {
                    0%   { transform: scale(0); opacity: 0; }
                    60%  { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
            <Confetti />
            <div className="mx-auto w-full max-w-6xl space-y-5">
                {/* ---------- banner ---------- */}
                <div className="bg-emerald-50 px-6 py-8 text-center">
                    <SuccessVideo />
                    <h1 className="text-lg font-bold text-emerald-950 sm:text-xl">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-xs text-gray-600">
                        Thank you for shopping with us. Your order has been confirmed.
                    </p>
                </div>

                <div className="grid items-start gap-5 lg:grid-cols-[1fr_360px]">
                    {/* ---------- left column ---------- */}
                    <div className="space-y-5">
                        <Card icon={FiFileText} title="Order Details">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <Meta label="Order ID">#{shortId}</Meta>
                                <Meta label="Order Date">
                                    {date}
                                    <span className="block text-xs font-normal text-gray-500">{time}</span>
                                </Meta>
                                <Meta label="Payment Method">{methodLabel}</Meta>
                                <Meta label="Order Status">
                                    <span className="inline-block bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                                        Confirmed
                                    </span>
                                    <span className="mt-1 block text-[11px] font-normal text-gray-500">
                                        Your order is being processed
                                    </span>
                                </Meta>
                            </div>

                            <h3 className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-5 text-sm font-bold text-gray-900">
                                <FiShoppingCart className="h-4 w-4" /> Items in this Order ({itemCount})
                            </h3>

                            <ul className="mt-3 divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-4 py-3">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden border border-gray-100 bg-gray-50">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-gray-900">{item.name}</p>
                                            {item.unit && <p className="text-xs text-gray-500">{item.unit}</p>}
                                        </div>
                                        <p className="hidden text-sm text-gray-500 sm:block">Qty: {item.quantity}</p>
                                        <p className="w-20 text-right text-sm font-bold text-gray-900">
                                            {money(item.price * item.quantity)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Card icon={FiMapPin} title="Delivery Address">
                                {address ? (
                                    <div className="flex flex-col gap-3 text-sm text-gray-600">
                                        <p className="font-bold text-gray-900">{address.full_name}</p>
                                        <p>
                                            {[address.building_number, address.street].filter(Boolean).join(", ")}
                                        </p>
                                        <p>
                                            {[address.city, address.state].filter(Boolean).join(", ")}
                                            {address.pincode ? ` - ${address.pincode}` : ""}
                                        </p>
                                        {address.phone && <p>Phone: {address.phone}</p>}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Address not available</p>
                                )}
                            </Card>

                            <Card icon={FiTruck} title="Delivery Information">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">Expected Delivery</p>
                                        <p className="text-sm font-bold text-gray-900">{expectedDelivery}</p>
                                    </div>
                                    <>
                                        {deliveryLabel && <p className="text-xs text-gray-800 font-semibold">{deliveryLabel}</p>}
                                    </>
                                </div>


                                <div className="mt-5 flex items-start">
                                    <Step icon={FiCheck} label="Order Confirmed" sub={time} state="done" lineActive />
                                    <Step icon={FiPackage} label="Processing" state="active" />
                                    <Step icon={FiTruck} label="Out for Delivery" state="todo" />
                                    <Step icon={FiHome} label="Delivered" state="todo" isLast />
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* ---------- right column ---------- */}
                    <div className="space-y-5">
                        <Card icon={FiFileText} title="Price Details">
                            <dl className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <dt>Item Total ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
                                    <dd>{money(subtotal)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Delivery Charge</dt>
                                    <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Tax</dt>
                                    <dd>{money(tax)}</dd>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-extrabold text-gray-900">
                                    <dt>{isCod ? "Total to Pay" : "Total Paid"}</dt>
                                    <dd>{money(total)}</dd>
                                </div>
                            </dl>
                            {isCod && (
                                <div className="mt-4 flex items-center gap-2 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
                                    <FiTag className="h-4 w-4" /> Pay in cash when your order arrives.
                                </div>
                            )}
                        </Card>

                        <Card icon={FiCreditCard} title="Payment Information">
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Payment Method</dt>
                                    <dd className="font-semibold text-gray-900">{methodLabel}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-gray-500">Payment Status</dt>
                                    <dd
                                        className={`px-3 py-1 text-xs font-semibold ${isCod ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                            }`}
                                    >
                                        {isCod ? "Pay on Delivery" : "Paid Successfully"}
                                    </dd>
                                </div>
                                {!isCod && transactionId && (
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-gray-500">Transaction ID</dt>
                                        <dd className="break-all text-right font-semibold text-gray-900">{transactionId}</dd>
                                    </div>
                                )}
                                <div className="flex justify-between gap-3">
                                    <dt className="text-gray-500">Order Date</dt>
                                    <dd className="text-right font-semibold text-gray-900">{date}, {time}</dd>
                                </div>
                            </dl>
                        </Card>
                    </div>
                </div>

                {/* ---------- what's next ---------- */}
                <div className="flex flex-wrap items-center justify-between gap-4 border border-gray-100 bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <FiBell className="h-6 w-6 text-orange-500" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">What&apos;s Next?</p>
                            <p className="text-sm text-gray-500">
                                We will notify you once your order is shipped and out for delivery.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(`/track-order/${orderId}`)}
                        className="flex items-center gap-2 border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                        <FiTruck className="h-4 w-4" /> Track Order
                    </button>
                </div>

                {/* ---------- user's choice ---------- */}
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                    <Link
                        to="/shop"
                        replace
                        className="flex items-center justify-center gap-2 border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-900 hover:bg-gray-50 hover:border-[#008f35] hover:text-[#008f35]"
                    >
                        <FiChevronLeft className="h-4 w-4" /> Continue Shopping
                    </Link>
                    <Link
                        to="/orders"
                        replace
                        className="flex items-center justify-center gap-2 bg-[#FF6900] py-3.5 text-sm font-bold text-white hover:bg-[#d45b04]"
                    >
                        <FiFileText className="h-4 w-4" /> View Order Details
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default OrderSuccess;