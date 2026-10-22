import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FiArrowLeft,
    FiBox,
    FiCheck,
    FiCheckCircle,
    FiChevronRight,
    FiCopy,
    FiCreditCard,
    FiFileText,
    FiHeadphones,
    FiHome,
    FiMapPin,
    FiMessageCircle,
    FiMessageSquare,
    FiPackage,
    FiPhone,
    FiRepeat,
    FiShoppingCart,
    FiStar,
    FiTag,
    FiTruck,
    FiUser,
    FiXCircle,
} from "react-icons/fi";
import { cancelorder, getsingleorder } from "../../redux/Slices/OrderSlice";
import { createfeedback } from "../../redux/Slices/FeedbackSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast";
import onthewaymap from "../../assets/onthewaymap.png";
import FeedbackModal from "../../reusables/FeedbackModal";
import { formatEstimatedDelivery } from "./Orderutils";

// ---------- helpers ----------
const NA = "NA";

// show NA when a value is missing
const val = (v) => (v === undefined || v === null || v === "" ? NA : v);

const money = (v) => (v === undefined || v === null || v === "" || Number.isNaN(Number(v)) ? NA : `₹${Number(v).toFixed(2).replace(/\.00$/, "")}`);

const toDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
};

const fmtDate = (v) => {
    const d = toDate(v);
    return d ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : NA;
};

const fmtTime = (v) => {
    const d = toDate(v);
    return d ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : NA;
};

// "Oct 15, 04:29 AM"
const fmtShort = (v) => {
    const d = toDate(v);
    return d ? `${fmtDate(d).replace(/, \d{4}$/, "")}, ${fmtTime(d)}` : "";
};

// "Oct 15, 2026, 04:29 AM"
const fmtLong = (v) => {
    const d = toDate(v);
    return d ? `${fmtDate(d)}, ${fmtTime(d)}` : NA;
};

const getFeedbackProductId = (item) => {
    const productId = item?.productId;
    if (productId && typeof productId === "object") return productId._id ?? productId.id ?? null;
    return productId || null;
};

// 0 = placed/confirmed, 1 = preparing, 2 = out for delivery, 3 = delivered, -1 = cancelled
const stageOf = (status) => {
    const s = String(status || "").toLowerCase().replace(/[\s-]/g, "_");
    if (["cancelled", "canceled"].includes(s)) return -1;
    if (["delivered", "completed"].includes(s)) return 3;
    if (["out_for_delivery", "shipped", "dispatched", "on_the_way"].includes(s)) return 2;
    if (["processing", "preparing", "packed", "packing", "ready_to_ship"].includes(s)) return 1;
    return 0; // PLACED / confirmed / pending ...
};

const STAGES = [
    {
        key: "confirmed",
        label: "Order Confirmed",
        dotIcon: FiCheck,
        icon: FiFileText,
        text: { done: "Your order has been placed successfully.", active: "Your order has been placed successfully.", todo: "Your order has been placed successfully." },
    },
    {
        key: "preparing",
        label: "Preparing",
        dotIcon: FiPackage,
        icon: FiBox,
        text: { done: "Your items have been packed.", active: "Your items are being packed.", todo: "Your items will be packed soon." },
    },
    {
        key: "out",
        label: "Out for Delivery",
        dotIcon: FiTruck,
        icon: FiTruck,
        text: { done: "Your order was handed to the delivery partner.", active: "Your order is on the way to your location.", todo: "Your order will be out for delivery soon." },
    },
    {
        key: "delivered",
        label: "Delivered",
        dotIcon: FiHome,
        icon: FiCheckCircle,
        text: { done: "Your order has been delivered.", active: "Your order has been delivered.", todo: "Your order will be delivered soon." },
    },
];

const STATUS_LABEL = { "-1": "Cancelled", 0: "Order Confirmed", 1: "Preparing", 2: "Out for Delivery", 3: "Delivered" };

const stateOf = (index, current) => {
    if (current === 3) return "done"; // delivered => everything finished
    if (index < current) return "done";
    if (index === current) return "active";
    return "todo";
};

// ---------- small UI pieces ----------
const Card = ({ icon: Icon, title, action, children, className = "" }) => (
    <section className={`border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
        {title && (
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 text-gray-900" />}
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                </div>
                {action}
            </div>
        )}
        {children}
    </section>
);

const Step = ({ stage, state, time, isLast, withDivider }) => {
    const DotIcon = state === "done" ? FiCheck : stage.dotIcon;
    const dot =
        state === "todo"
            ? "bg-gray-400 text-white"
            : state === "active"
                ? "bg-emerald-700 text-white ring-8 ring-emerald-100"
                : "bg-emerald-600 text-white";

    return (
        <div className={`relative flex flex-1 flex-col items-center px-3 text-center ${withDivider ? "border-l border-gray-100" : ""}`}>
            {!isLast && (
                <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-5 z-0 w-full border-t-2 ${state === "done" ? "border-emerald-600" : "border-dashed border-gray-300"}`}
                />
            )}
            <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${dot}`}>
                <DotIcon className="h-5 w-5" />
            </span>

            <p className={`mt-2 text-sm font-semibold ${state === "active" ? "text-emerald-700" : "text-gray-700"}`}>{stage.label}</p>
            {time && <p className="mt-1 text-xs text-gray-500">{time}</p>}
            <p className="mt-2 text-xs leading-5 text-gray-500">{stage.text[state]}</p>
        </div>
    );
};

const Line = ({ label, children, valueClass = "text-gray-900" }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-gray-600">{label}</dt>
        <dd className={`text-right ${valueClass}`}>{children}</dd>
    </div>
);

const Skeleton = () => (
    <main className="bg-[#f6f7f5] px-4 py-6">
        <div className="mx-auto w-full max-w-[90%] animate-pulse space-y-5">
            <div className="h-36 rounded bg-gray-200" />
            <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
                <div className="space-y-5">
                    <div className="h-24 rounded bg-gray-200" />
                    <div className="h-52 rounded bg-gray-200" />
                    <div className="h-72 rounded bg-gray-200" />
                </div>
                <div className="space-y-5">
                    <div className="h-40 rounded bg-gray-200" />
                    <div className="h-40 rounded bg-gray-200" />
                    <div className="h-52 rounded bg-gray-200" />
                </div>
            </div>
        </div>
    </main>
);

// ---------- page ----------
const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { singleorderloading, singleorderdata, singleordererror } = useSelector((state) => state.order.singleorder);
    const cancelloading = useSelector((state) => state.order.cancel?.cancelloading);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    useEffect(() => {
        if (orderId) dispatch(getsingleorder(orderId));
    }, [dispatch, orderId]);

    // ignore a previously opened order that is still in the store
    const order = singleorderdata && String(singleorderdata._id) === String(orderId) ? singleorderdata : null;

    // ---- actions ----
    const copy = async (text, message) => {
        try {
            await navigator.clipboard.writeText(String(text));
            showSuccessToast(message);
        } catch {
            showErrorToast("Unable to copy");
        }
    };

    const buyAgain = (item) => {
        if (!item.productId) return;
        navigate("/checkout", {
            state: {
                buyNow: {
                    productId: item.productId,
                    name: item.name,
                    weight: item.weight,
                    quantity: 1,
                    price: item.price,
                    image: item.image,
                },
            },
        });
    };

    const handleCancel = async () => {
        if (cancelloading) return;
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await dispatch(cancelorder(orderId)).unwrap();
            showSuccessToast("Order cancelled");
            dispatch(getsingleorder(orderId));
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to cancel order");
        }
    };

    const closeFeedback = () => setFeedbackOpen(false);

    const handleSubmitFeedback = async ({ rating, feedback }) => {
        const feedbackItem = items.find((item) => getFeedbackProductId(item));
        const productId = feedbackItem && getFeedbackProductId(feedbackItem);
        if (!productId) throw new Error("No product is available for feedback on this order.");

        try {
            setSubmittingFeedback(true);
            await dispatch(
                createfeedback({
                    id: productId,
                    data: { rating, comment: feedback },
                }),
            ).unwrap();
            showSuccessToast("Thanks for your feedback!");
            setFeedbackOpen(false);
        } catch (error) {
            throw new Error(
                typeof error === "string" ? error : error?.message || "Unable to submit your feedback.",
                { cause: error },
            );
        } finally {
            setSubmittingFeedback(false);
        }
    };

    // ---- states ----
    if (!order && singleordererror && !singleorderloading) {
        return (
            <main className="bg-[#f6f7f5] px-4 py-20 text-center">
                <h1 className="text-xl font-bold text-gray-900">We couldn&apos;t load this order</h1>
                <p className="mt-2 text-sm text-gray-500">
                    {typeof singleordererror === "string" ? singleordererror : "Please try again."}
                </p>
                <Link
                    to="/orders"
                    className="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                    Back to Orders
                </Link>
            </main>
        );
    }

    if (!order) return <Skeleton />;

    // ---- everything below comes straight from the API response ----
    const items = Array.isArray(order.items) ? order.items : [];
    const itemCount = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);

    const stage = stageOf(order.orderStatus);
    const cancelled = stage === -1;
    const current = cancelled ? 0 : stage;
    const canCancel = !cancelled && stage <= 1;
    const canTrack = !cancelled && stage < 3;
    const normalizedOrderStatus = String(order.orderStatus || "").toLowerCase().replace(/[\s-]/g, "_");

    const isCod = String(order.paymentMethod || "").toUpperCase() === "COD";
    // Payment fields may be returned as paymentStatus or status by the API.
    const paymentStatus = order.paymentStatus ?? order.status ?? order.items?.[0]?.status;
    const normalizedPaymentStatus = String(paymentStatus || "").toUpperCase();
    const failed = ["failed", "failure", "delivery_failed", "delivery_failure", "payment_failed", "payment_failure"].includes(normalizedOrderStatus)
        || ["FAILED", "FAILURE"].includes(normalizedPaymentStatus);
    const isTerminal = cancelled || stage === 3 || failed;
    const feedbackItem = items.find((item) => getFeedbackProductId(item));
    const feedbackProductId = feedbackItem && getFeedbackProductId(feedbackItem);
    const paid = !isCod && ["SUCCESS", "PAID", "COMPLETED", "CAPTURED"].includes(normalizedPaymentStatus);
    const methodLabel = isCod ? "Cash on Delivery" : val(order.paymentMethod);
    const paymentDate = order.paidAt || order.createdAt;

    const address = order.address;
    const rider = order.rider; // shows only when API sends rider info

    const discount = Number(order.discount) || 0;
    const saved = discount;
    const estimatedDelivery = formatEstimatedDelivery(order);

    const statusHistory = Array.isArray(order.statusHistory)
        ? order.statusHistory
        : Array.isArray(order.timeline)
            ? order.timeline
            : [];

    const timeFor = (index) => {
        if (index === 0) return order.createdAt;
        if (index === 3 && order.deliveredAt) return order.deliveredAt;
        const historyEntry = statusHistory.find((entry) => stageOf(entry.status) === index);
        return historyEntry?.at
            ?? historyEntry?.date
            ?? historyEntry?.timestamp
            ?? historyEntry?.createdAt
            ?? (stage === index ? order.updatedAt : null);
    };

    const subTime = (index) => {
        const state = stateOf(index, current);
        if (index === 3 && state !== "done") return estimatedDelivery ? `Expected ${estimatedDelivery}` : "";
        return state === "todo" ? "" : fmtShort(timeFor(index));
    };

    const expectedLine = cancelled
        ? "This order was cancelled"
        : stage === 3
            ? `Delivered on ${fmtDate(timeFor(3))}`
            : estimatedDelivery
                ? `Estimated delivery: ${estimatedDelivery}`
                : `Estimated delivery: ${NA}`;

    const goTrack = () => navigate(`/track-order/${orderId}`);

    return (
        <main className="bg-[#f6f7f5]">
            <div className="mx-auto w-full max-w-[90%] space-y-5 py-5">
                {/* ================= header ================= */}
                <header className="relative overflow-hidden bg-gradient-to-r from-white via-emerald-50 to-emerald-100/70">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block"
                        style={{
                            WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 22%)",
                            maskImage: "linear-gradient(to right, transparent 0%, #000 22%)",
                        }}
                    >
                        <img
                            src={onthewaymap}
                            alt=""
                            draggable={false}
                            className="h-full w-full select-none object-cover object-right mix-blend-multiply"
                        />
                    </div>

                    <div className="relative px-6 py-6 sm:px-10">
                        <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                            <FiArrowLeft className="h-4 w-4" /> Back to Orders
                        </Link>
                        <h1 className="mt-3 text-xl font-bold text-gray-800 sm:text-3xl">Order Details</h1>
                        <p className="mt-2 max-w-md text-sm text-gray-700">
                            Here are the complete details of your order. Thank you for shopping with us!
                        </p>
                    </div>

                    {canTrack && (
                        <button
                            type="button"
                            onClick={goTrack}
                            className="absolute right-6 top-1/2 hidden -translate-y-1/2 items-center gap-2 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-md hover:bg-gray-50 lg:inline-flex"
                        >
                            <FiMapPin className="h-4 w-4" /> Track Live Location <FiChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </header>

                <div className="grid items-start gap-5 lg:grid-cols-[1fr_400px]">
                    {/* ================= left ================= */}
                    <div className="space-y-5">
                        {/* ---- order bar ---- */}
                        <section className="flex flex-wrap items-center justify-between gap-4 border border-emerald-100 bg-emerald-50 px-5 py-4">
                            <div className="flex items-center gap-4">
                                <span
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${cancelled ? "bg-red-500" : "bg-emerald-600"}`}
                                >
                                    {cancelled ? <FiXCircle className="h-7 w-7" /> : <FiCheck className="h-7 w-7" strokeWidth={3} />}
                                </span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                                            Order #{String(order._id).slice(-8).toUpperCase()}
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => copy(order._id, "Order ID copied")}
                                            aria-label="Copy order id"
                                            className="p-1 text-emerald-700 hover:bg-emerald-100"
                                        >
                                            <FiCopy className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-gray-600">
                                        <span>Placed on {fmtDate(order.createdAt)} at {fmtTime(order.createdAt)}</span>
                                        <span className="hidden h-3.5 border-l border-gray-300 sm:block" />
                                        <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                                        <span className="hidden h-3.5 border-l border-gray-300 sm:block" />
                                        <span>{methodLabel}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
                                    {cancelled ? <FiXCircle className="h-6 w-6" /> : <FiTruck className="h-6 w-6" />}
                                </span>
                                <div>
                                    <p className={`text-sm font-bold ${cancelled ? "text-red-600" : "text-emerald-700"}`}>{STATUS_LABEL[stage]}</p>
                                    <p className="text-xs text-gray-500">{expectedLine}</p>
                                </div>
                            </div>
                        </section>

                        {/* ---- stepper ---- */}
                        {!cancelled && (
                            <section className="flex items-stretch border border-gray-100 bg-white px-2 py-7 shadow-sm">
                                {STAGES.map((s, i) => (
                                    <Step
                                        key={s.key}
                                        stage={s}
                                        state={stateOf(i, current)}
                                        time={subTime(i)}
                                        isLast={i === STAGES.length - 1}
                                        withDivider={i > 0}
                                    />
                                ))}
                            </section>
                        )}

                        {/* ---- items ---- */}
                        <Card icon={FiPackage} title={`Ordered Items (${itemCount})`}>
                            {items.length === 0 ? (
                                <p className="text-sm text-gray-500">{NA}</p>
                            ) : (
                                <ul className="divide-y divide-gray-100 border border-gray-100">
                                    {items.map((item, i) => (
                                        <li key={item._id ?? `${item.productId}-${i}`} className="flex flex-wrap items-center gap-4 px-4 py-3">
                                            <div className="h-[72px] w-[72px] shrink-0 overflow-hidden border border-gray-100 bg-gray-50">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name || ""} loading="lazy" className="h-full w-full object-cover" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 basis-44">
                                                <p className="truncate text-base font-bold text-gray-900">{val(item.name)}</p>
                                                <p className="text-sm text-gray-600">{val(item.weight)}</p>
                                                <span className="mt-1 inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                                                    <FiTag className="h-3 w-3" /> {val(item.category)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-left">
                                                    <p className="text-base font-bold text-gray-900">{money(item.price)}</p>
                                                    {item.mrp > item.price && <p className="text-sm text-gray-400 line-through">{money(item.mrp)}</p>}
                                                </div>
                                                {item.mrp > item.price && (
                                                    <span className="bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                                                        {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            <p className="w-14 text-sm text-gray-600">Qty: {val(item.quantity)}</p>

                                            <button
                                                type="button"
                                                onClick={() => buyAgain(item)}
                                                disabled={!item.productId}
                                                className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <FiShoppingCart className="h-4 w-4" /> Buy
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>

                        {/* ---- need help ---- */}
                        <section className="flex flex-wrap items-center justify-between gap-4 border border-emerald-100 bg-emerald-50 px-5 py-4">
                            <div className="flex items-center gap-4">
                                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm">
                                    <FiHeadphones className="h-7 w-7" />
                                </span>
                                <div>
                                    <p className="text-base font-bold text-gray-900">Need Help with this Order?</p>
                                    <p className="text-sm text-gray-600">Our support team is here for you.</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    <FiMessageCircle className="h-4 w-4" /> Contact Support
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => navigate("/contact", { state: { orderId } })}
                                    disabled={isTerminal || stage >= 1}
                                    className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiRepeat className="h-4 w-4" /> Request Change
                                </button>
                                {isTerminal && (
                                    <button
                                        type="button"
                                        onClick={() => setFeedbackOpen(true)}
                                        disabled={!feedbackProductId}
                                        title={!feedbackProductId ? "No product is available for feedback on this order" : undefined}
                                        className="inline-flex items-center gap-2 border border-emerald-700 bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiStar className="h-4 w-4" /> Add feedback
                                    </button>
                                )}
                                {canCancel && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={cancelloading}
                                        className="inline-flex items-center gap-2 border border-red-400 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                                    >
                                        <FiXCircle className="h-4 w-4" /> {cancelloading ? "Cancelling..." : "Cancel Order"}
                                    </button>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* ================= right ================= */}
                    <div className="space-y-5">
                        {/* ---- delivery partner (only when API sends order.rider) ---- */}
                        {rider && !cancelled && stage < 3 && (
                            <Card icon={FiUser} title="Delivery Partner">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700">
                                        {rider.image ? (
                                            <img src={rider.image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <FiUser className="h-8 w-8" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-base font-bold text-gray-900">{val(rider.name)}</p>
                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600">
                                            <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            {val(rider.rating)} {rider.deliveries ? `(${rider.deliveries}+ deliveries)` : ""}
                                        </p>
                                    </div>
                                    {rider.phone && (
                                        <div className="flex gap-2">
                                            <a
                                                href={`tel:${rider.phone}`}
                                                aria-label="Call delivery partner"
                                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                            >
                                                <FiPhone className="h-4 w-4" />
                                            </a>
                                            <a
                                                href={`sms:${rider.phone}`}
                                                aria-label="Message delivery partner"
                                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                            >
                                                <FiMessageSquare className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={goTrack}
                                    className="mt-4 flex w-full items-center justify-center gap-2 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                                >
                                    <FiMapPin className="h-4 w-4" /> Track Live Location <FiChevronRight className="h-4 w-4" />
                                </button>
                            </Card>
                        )}

                        {/* ---- address ---- */}
                        <Card
                            icon={FiMapPin}
                            title="Delivery Address">
                            {address ? (
                                <div className="flex gap-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600">
                                        <FiHome className="h-10 w-10" />
                                    </div>
                                    <div className="min-w-0 space-y-0.5 text-sm text-gray-600">
                                        <p className="font-bold text-gray-900">{val(address.full_name)}</p>
                                        <p>{val([address.building_number, address.street].filter(Boolean).join(", "))}</p>
                                        <p>
                                            {val([address.city, address.state].filter(Boolean).join(", "))}
                                            {address.pincode ? ` - ${address.pincode}` : ""}
                                        </p>
                                        <p>Phone: {val(address.phone)}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">{NA}</p>
                            )}
                        </Card>

                        {/* ---- payment ---- */}
                        <Card icon={FiCreditCard} title="Payment Information">
                            <dl className="space-y-3">
                                <Line label="Payment Method">
                                    <span className="font-medium">{methodLabel}</span>
                                </Line>
                                <Line label="Payment Status">
                                    {paid ? (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                            <FiCheckCircle className="h-4 w-4 text-emerald-600" /> Paid Successfully
                                        </span>
                                    ) : (
                                        <span className="bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                            {isCod
                                                ? "Pay on Delivery"
                                                : normalizedPaymentStatus === "PENDING"
                                                    ? "Pending"
                                                    : val(paymentStatus)}
                                        </span>
                                    )}
                                </Line>
                                {!isCod && (
                                    <Line label="Transaction ID">
                                        <span className="inline-flex items-center gap-2">
                                            <span className="break-all">{val(order.transactionId)}</span>
                                            {order.transactionId && (
                                                <button
                                                    type="button"
                                                    onClick={() => copy(order.transactionId, "Transaction ID copied")}
                                                    aria-label="Copy transaction id"
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    <FiCopy className="h-4 w-4" />
                                                </button>
                                            )}
                                        </span>
                                    </Line>
                                )}
                                <Line label="Payment Date">{fmtLong(paymentDate)}</Line>
                            </dl>
                        </Card>

                        {/* ---- order summary ---- */}
                        <Card icon={FiFileText} title="Order Summary">
                            <dl className="space-y-3">
                                <Line label={`Item Total (${itemCount} ${itemCount === 1 ? "item" : "items"})`}>
                                    {money(order.subtotal)}
                                </Line>
                                <Line label="Delivery Charge">
                                    {order.deliveryCharge === undefined || order.deliveryCharge === null
                                        ? NA
                                        : Number(order.deliveryCharge) === 0
                                            ? "Free"
                                            : money(order.deliveryCharge)}
                                </Line>
                                <Line label="Tax">{money(order.tax)}</Line>
                                {discount > 0 && (
                                    <Line label="Discount" valueClass="font-semibold text-emerald-600">
                                        - {money(discount)}
                                    </Line>
                                )}
                            </dl>

                            <div className="mt-4 bg-emerald-50 p-3">
                                <div className="flex items-center justify-between px-1 text-base font-bold text-gray-900">
                                    <span>Total Amount</span>
                                    <span className="text-2xl text-emerald-800">{money(order.total)}</span>
                                </div>
                                {saved > 0 && (
                                    <div className="mt-3 flex items-center gap-2 bg-emerald-100/70 px-3 py-2 text-sm text-emerald-800">
                                        <FiTag className="h-4 w-4" /> You saved {money(saved)} on this order!
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* ================= bottom buttons ================= */}
                <div className={`grid gap-4 ${canTrack ? "lg:grid-cols-[1fr_1fr_400px]" : "lg:grid-cols-2"}`}>
                    <Link
                        to="/orders"
                        onClick={() => window.scrollTo(0, 0)}
                        className="flex items-center justify-center gap-3 border border-gray-200 bg-white py-4 text-sm font-bold text-gray-900 hover:bg-gray-50"
                    >
                        <FiArrowLeft className="h-4 w-4" /> View All Orders
                    </Link>
                    <Link
                        to="/shop"
                        className="flex items-center justify-center gap-3 border border-gray-200 bg-white py-4 text-sm font-bold text-gray-900 hover:bg-gray-50"
                    >
                        <FiShoppingCart className="h-4 w-4" /> Continue Shopping
                    </Link>
                    {canTrack && (
                        <button
                            type="button"
                            onClick={goTrack}
                            className="flex items-center justify-center gap-3 bg-emerald-800 py-4 text-sm font-bold text-white hover:bg-emerald-900"
                        >
                            <FiMapPin className="h-4 w-4" /> Track Live Location
                        </button>
                    )}
                </div>
            </div>
            <FeedbackModal
                open={feedbackOpen}
                onClose={closeFeedback}
                onSubmit={handleSubmitFeedback}
                loading={submittingFeedback}
                initialRating={0}
                title="Rate this product"
                subtitle={`Share feedback about ${feedbackItem?.name || "a product in your order"}.`}
                submitLabel="Submit Feedback"
                placeholder="Tell us about the quality, freshness, packaging or anything you liked or disliked..."
            />
        </main>
    );
};

export default OrderDetails;