import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FiArrowLeft,
    FiCheck,
    FiCopy,
    FiCreditCard,
    FiFileText,
    FiHeadphones,
    FiHome,
    FiMapPin,
    FiPackage,
    FiShoppingCart,
    FiTag,
    FiTruck,
    FiXCircle,
} from "react-icons/fi";
import { getsingleorder } from "../../redux/Slices/OrderSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast";
import { formatEstimatedDelivery } from "../profile/Orderutils";
import onthewaymap from '../../assets/onthewaymap.png';

// ---------- helpers ----------
const money = (value) => `₹${Number(value || 0).toFixed(2).replace(/\.00$/, "")}`;

const toDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};

const fmtDate = (value) => {
    const d = toDate(value);
    return d ? d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "";
};

const fmtTime = (value) => {
    const d = toDate(value);
    return d ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";
};

const fmtShort = (value) => {
    const d = toDate(value);
    return d ? `${fmtDate(d).replace(/, \d{4}$/, "")}, ${fmtTime(d)}` : "";
};

const fmtLong = (value) => {
    const d = toDate(value);
    return d ? `${fmtDate(d)}, ${fmtTime(d)}` : "";
};

const idOf = (value) => (value && typeof value === "object" ? value._id : value);

// 0 = confirmed, 1 = preparing, 2 = out for delivery, 3 = delivered, -1 = cancelled
const stageOf = (status = "") => {
    const s = String(status).toLowerCase().replace(/[\s-]/g, "_");
    if (["cancelled", "canceled"].includes(s)) return -1;
    if (["delivered", "completed"].includes(s)) return 3;
    if (["out_for_delivery", "shipped", "dispatched", "on_the_way"].includes(s)) return 2;
    if (["processing", "preparing", "packed", "packing", "ready_to_ship"].includes(s)) return 1;
    return 0; // placed / confirmed / pending / paid ...
};

const STAGES = [
    {
        key: "confirmed",
        label: "Order Confirmed",
        icon: FiCheck,
        text: { done: "Your order has been placed successfully.", todo: "Your order has been placed successfully." },
    },
    {
        key: "preparing",
        label: "Preparing",
        icon: FiPackage,
        text: { done: "Your items have been packed.", active: "Your items are being packed.", todo: "Your items will be packed soon." },
    },
    {
        key: "out",
        label: "Out for Delivery",
        icon: FiTruck,
        text: { done: "Your order was handed to the delivery partner.", active: "Your order is on the way to you!", todo: "Your order will be out for delivery soon." },
    },
    {
        key: "delivered",
        label: "Delivered",
        icon: FiHome,
        text: { done: "Your order has been delivered.", active: "Your order has been delivered.", todo: "Your order will be delivered shortly." },
    },
];

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
                    {Icon && <Icon className="h-5 w-5 text-gray-800" />}
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                </div>
                {action}
            </div>
        )}
        {children}
    </section>
);

const circleClass = {
    done: "bg-emerald-600 text-white",
    active: "bg-emerald-600 text-white ring-4 ring-emerald-100",
    todo: "bg-gray-200 text-gray-500",
};

// horizontal stepper item (top card)
const HStep = ({ stage, state, sub, isLast, lineDone }) => {
    const Icon = stage.icon;
    return (
        <div className="relative flex flex-1 flex-col items-center text-center">
            {!isLast && (
                <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-[22px] w-full border-t-2 ${lineDone ? "border-emerald-500" : "border-dashed border-gray-300"
                        }`}
                />
            )}
            <span className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full ${circleClass[state]}`}>
                <Icon className="h-5 w-5" />
            </span>
            <p className={`mt-3 text-xs sm:text-sm ${state === "todo" ? "text-gray-600" : "text-gray-800"}`}>
                {stage.label}
            </p>
            {sub && (
                <p className={`mt-0.5 px-1 text-[11px] sm:text-xs ${state === "active" ? "text-emerald-600" : "text-gray-500"}`}>
                    {sub}
                </p>
            )}
        </div>
    );
};

const Row = ({ label, children, bold = false }) => (
    <div className="flex items-center justify-between gap-3 text-sm">
        <dt className="text-gray-500">{label}</dt>
        <dd className={`text-right ${bold ? "font-bold text-gray-900" : "font-semibold text-gray-900"}`}>{children}</dd>
    </div>
);

const TrackSkeleton = () => (
    <main className="bg-[#f6f7f5] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl animate-pulse space-y-5">
            <div className="h-32 rounded bg-gray-200" />
            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                    <div className="h-36 rounded bg-gray-200" />
                    <div className="h-72 rounded bg-gray-200" />
                    <div className="h-64 rounded bg-gray-200" />
                </div>
                <div className="space-y-5">
                    <div className="h-28 rounded bg-gray-200" />
                    <div className="h-56 rounded bg-gray-200" />
                    <div className="h-48 rounded bg-gray-200" />
                </div>
            </div>
        </div>
    </main>
);

// ---------- page ----------
const TrackOrder = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { singleorderloading, singleorderdata, singleordererror } = useSelector(
        (state) => state.order.singleorder
    );

    useEffect(() => {
        if (orderId) dispatch(getsingleorder(orderId));
    }, [dispatch, orderId]);

    // ignore a previously opened order that is still in the store
    const order = singleorderdata && String(singleorderdata._id) === String(orderId) ? singleorderdata : null;

    const view = useMemo(() => {
        if (!order) return null;

        const status = order.status ?? order.orderStatus;
        const stage = stageOf(status);
        const cancelled = stage === -1;

        const rawItems = Array.isArray(order.items) ? order.items : Array.isArray(order.products) ? order.products : [];
        const items = rawItems.map((it, i) => {
            const product = it.productId && typeof it.productId === "object" ? it.productId : {};
            const qty = Number(it.quantity ?? it.qty) || 1;
            const price = Number(it.price ?? it.selling_price ?? it.sellingPrice ?? product.selling_price) || 0;
            const mrp = Number(it.mrp ?? it.original_price ?? it.originalPrice ?? product.mrp) || 0;
            return {
                id: `${idOf(it.productId) || it._id || i}-${i}`,
                productId: idOf(it.productId),
                name: it.name ?? it.title ?? it.productName ?? product.name ?? "Item",
                unit: it.weight ?? it.unit ?? "",
                qty,
                price,
                mrp: mrp > price ? mrp : 0,
                image: it.image ?? it.imageurl ?? it.thumbnail ?? product.thumbnail ?? product.images?.[0] ?? "",
            };
        });

        const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
        const subtotal = Number(order.subtotal ?? order.itemTotal) || items.reduce((s, it) => s + it.price * it.qty, 0);
        const shipping = Number(order.shipping ?? order.deliveryCharge ?? order.shippingCharge ?? order.deliveryFee) || 0;
        const tax = Number(order.tax ?? order.taxAmount) || 0;
        const discount = Number(order.discount ?? order.discountAmount) || 0;
        const total = Number(order.total ?? order.totalAmount) || subtotal + shipping + tax - discount;
        const saved = items.reduce((s, it) => s + (it.mrp ? (it.mrp - it.price) * it.qty : 0), 0) + discount;

        const method = String(order.paymentMethod ?? order.payment?.method ?? "").toUpperCase();
        const isCod = method === "COD";
        const paymentStatus = String(order.paymentStatus ?? order.payment?.status ?? "").toUpperCase();
        const paid = !isCod && ["SUCCESS", "PAID", "COMPLETED", "CAPTURED"].includes(paymentStatus || "SUCCESS");

        // time of each stage, if backend keeps a history
        const history = Array.isArray(order.statusHistory) ? order.statusHistory : Array.isArray(order.timeline) ? order.timeline : [];
        const timeFor = (index) => {
            if (index === 0) return order.createdAt;
            const hit = history.find((h) => stageOf(h.status) === index);
            return hit?.at ?? hit?.date ?? hit?.timestamp ?? hit?.createdAt ?? (stage === index ? order.updatedAt : null);
        };

        return {
            status,
            stage,
            cancelled,
            shortId: String(order._id).slice(-8).toUpperCase(),
            itemTitle: items.length === 1
                ? items[0].name
                : items.length > 1
                    ? `${items[0].name} + ${items.length - 1} more`
                    : "Order details",
            placedAt: order.createdAt,
            items,
            itemCount,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            saved,
            isCod,
            paid,
            methodLabel: isCod ? "Cash on Delivery" : "UPI (Razorpay)",
            transactionId:
                order.transactionId ?? order.payment?.razorpay_payment_id ?? order.payment?.transactionId ?? order.razorpayPaymentId ?? "",
            paymentDate: order.paidAt ?? order.payment?.paidAt ?? order.createdAt,
            address: order.address ?? order.shippingAddress ?? null,
            expected: formatEstimatedDelivery(order),
            lastUpdated: order.updatedAt ?? order.createdAt,
            timeFor,
        };
    }, [order]);

    // ---- actions ----
    const copyId = async () => {
        try {
            await navigator.clipboard.writeText(String(orderId));
            showSuccessToast("Order ID copied");
        } catch {
            showErrorToast("Unable to copy order ID");
        }
    };

    const buyAgain = (item) => {
        if (!item.productId) return;
        navigate("/checkout", {
            state: {
                buyNow: {
                    productId: item.productId,
                    name: item.name,
                    weight: item.unit,
                    quantity: 1,
                    price: item.price,
                    image: item.image,
                },
            },
        });
    };

    // ---- states ----
    if (!view && singleordererror && !singleorderloading) {
        return (
            <main className="bg-[#f6f7f5] px-4 py-20 text-center">
                <h1 className="text-xl font-bold text-gray-900">We couldn&apos;t load this order</h1>
                <p className="mt-2 text-sm text-gray-500">
                    {typeof singleordererror === "string" ? singleordererror : "Please try again."}
                </p>
                <Link
                    to="/orders"
                    className="mt-6 inline-block bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    Back to Orders
                </Link>
            </main>
        );
    }

    if (!view) return <TrackSkeleton />;

    const { stage, cancelled } = view;
    const current = cancelled ? 0 : stage;

    const subFor = (index) => {
        if (cancelled) return index === 0 ? fmtShort(view.timeFor(0)) : "";
        const state = stateOf(index, current);
        if (index === 0) return fmtShort(view.timeFor(0));
        if (index === 1) return state === "active" ? "Your items are being packed" : state === "done" ? fmtShort(view.timeFor(1)) : "";
        if (index === 2) return state === "todo" ? "Soon on the way" : fmtShort(view.timeFor(2));
        return state === "done" ? fmtShort(view.timeFor(3)) : view.expected ? `Expected ${view.expected}` : "";
    };

    const expectedText = cancelled
        ? "Order cancelled"
        : stage === 3
            ? "Delivered"
            : view.expected
                ? view.expected
                : "Soon";

    return (
        <main className="bg-[#f6f7f5]">
            {/* ---------- header ---------- */}
            <header className="relative overflow-hidden bg-white">
                {/* decorative illustration (right side, desktop only) */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] items-center justify-center lg:flex"
                    style={{
                        // fades the left edge, top and bottom into the page background
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent 0%, #000 5%), linear-gradient(to bottom, transparent 0%, #000 15%, #000 95%, transparent 100%)",
                        maskImage:
                            "linear-gradient(to right, transparent 0%, #000 10%), linear-gradient(to bottom, transparent 0%, #000 5%, #000 95%, transparent 100%)",
                        WebkitMaskComposite: "source-in",
                        maskComposite: "intersect",
                    }}
                >
                    <img
                        src={onthewaymap}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full select-none object-cover object-center mix-blend-multiply"
                    />
                </div>

                <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <FiArrowLeft className="h-4 w-4" /> Back to Orders
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Track Your Order</h1>

                    <div className="mt-3 min-w-0">
                        <h2 className="break-words text-lg font-bold text-gray-900 sm:text-xl">{view.itemTitle}</h2>
                        <div className="mt-1 flex items-center gap-1.5">
                            <p className="text-sm text-gray-500">Order #{view.shortId}</p>
                            <button
                                type="button"
                                onClick={copyId}
                                aria-label="Copy order id"
                                className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            >
                                <FiCopy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                        <span>Placed on {fmtDate(view.placedAt)} at {fmtTime(view.placedAt)}</span>
                        <span className="hidden h-4 border-l border-gray-300 sm:block" />
                        <span>{view.itemCount} {view.itemCount === 1 ? "item" : "items"}</span>
                        <span className="hidden h-4 border-l border-gray-300 sm:block" />
                        <span>{view.methodLabel}</span>
                    </p>
                </div>
            </header>

            <div className="mx-auto w-full max-w-[90%] px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid items-start gap-5 lg:grid-cols-[1fr_360px]">
                    {/* ================= left ================= */}
                    <div className="space-y-5">
                        {/* horizontal stepper */}
                        <Card>
                            {cancelled ? (
                                <div className="flex items-center gap-3 bg-red-50 px-4 py-4 text-red-700">
                                    <FiXCircle className="h-6 w-6 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold">This order was cancelled</p>
                                        <p className="text-xs">
                                            {view.isCod
                                                ? "No payment was taken for this order."
                                                : "If any amount was deducted, it will be refunded to your account."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start">
                                    {STAGES.map((s, i) => (
                                        <HStep
                                            key={s.key}
                                            stage={s}
                                            state={stateOf(i, current)}
                                            sub={subFor(i)}
                                            isLast={i === STAGES.length - 1}
                                            lineDone={stateOf(i, current) === "done"}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* live status */}
                        <Card>
                            <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-gray-100 pb-4">
                                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                                    {!cancelled && stage !== 3 && (
                                        <span className="absolute h-6 w-6 animate-ping rounded-full bg-emerald-300 opacity-60" />
                                    )}
                                </span>
                                <h2 className="text-base font-bold text-gray-800">Live Status</h2>
                                <span className="text-xs text-gray-500">Last updated: {fmtLong(view.lastUpdated)}</span>
                            </div>

                            <ol>
                                {(cancelled ? STAGES.slice(0, 1) : STAGES).map((s, i, arr) => {
                                    const state = cancelled ? "done" : stateOf(i, current);
                                    const last = i === arr.length - 1 && !cancelled;
                                    const text = s.text[state] ?? s.text.todo;
                                    const time = state === "todo" ? "" : fmtShort(view.timeFor(i));
                                    return (
                                        <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
                                            {!last && (
                                                <span
                                                    aria-hidden="true"
                                                    className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 ${state === "done" ? "bg-emerald-500" : "bg-gray-300"
                                                        }`}
                                                />
                                            )}
                                            <span
                                                className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${state === "todo" ? "bg-gray-300 text-white" : "bg-emerald-600 text-white"
                                                    }`}
                                            >
                                                {state === "done" ? (
                                                    <FiCheck className="h-4 w-4" />
                                                ) : (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                                )}
                                            </span>
                                            <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4">
                                                <div>
                                                    <p className={`text-sm font-semibold ${state === "active" ? "text-emerald-700" : "text-gray-700"}`}>
                                                        {s.label === "Preparing" && state === "done" ? "Packed" : s.label}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{text}</p>
                                                </div>
                                                {time && <p className="text-xs text-gray-500">{time}</p>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </Card>

                        {/* items */}
                        <Card icon={FiShoppingCart} title={`Items in this Order (${view.itemCount})`}>
                            <div className="border-t-2 border-dashed border-gray-300 pt-4">
                                <ul className="divide-y divide-gray-100">
                                    {view.items.map((item) => (
                                        <li key={item.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1 basis-40">
                                                <p className="truncate text-sm font-bold text-gray-900">{item.name}</p>
                                                {item.unit && <p className="text-xs text-gray-500">{item.unit}</p>}
                                                <p className="mt-1 text-sm">
                                                    <span className="font-bold text-orange-600">{money(item.price)}</span>
                                                    {item.mrp > 0 && (
                                                        <span className="ml-2 text-xs text-gray-400 line-through">{money(item.mrp)}</span>
                                                    )}
                                                </p>
                                            </div>

                                            <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                            <p className="w-20 text-right text-sm font-bold text-gray-900">{money(item.price * item.qty)}</p>

                                            <button
                                                type="button"
                                                onClick={() => buyAgain(item)}
                                                disabled={!item.productId}
                                                className="flex items-center gap-2 border border-orange-400 bg-white px-4 py-2 text-sm text-orange-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <FiShoppingCart className="h-4 w-4" /> Buy
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>

                        {/* bottom buttons */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Link
                                to="/shop"
                                className="flex items-center justify-center gap-2 border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-900 hover:bg-gray-50"
                            >
                                <FiShoppingCart className="h-4 w-4" /> Continue Shopping
                            </Link>
                            <Link
                                to="/orders"
                                onClick={() => window.scrollTo(0, 0)}
                                className="flex items-center justify-center gap-2 bg-emerald-800 py-3.5 text-sm font-bold text-white hover:bg-emerald-900"
                            >
                                <FiPackage className="h-4 w-4" /> View Order Details
                            </Link>
                        </div>
                    </div>

                    {/* ================= right ================= */}
                    <div className="space-y-5">
                        {/* estimated delivery */}
                        <div className="flex items-center gap-4 bg-emerald-50 p-5 border border-green-300">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-emerald-100 text-emerald-700">
                                <FiPackage className="h-7 w-7" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-emerald-800">Estimated Delivery</p>
                                <p className="text-base font-bold leading-snug text-gray-900">{expectedText}</p>
                                {!cancelled && stage !== 3 && (
                                    <p className="text-xs text-gray-600">We&apos;ll notify you when it&apos;s out for delivery.</p>
                                )}
                            </div>
                        </div>

                        {/* order summary */}
                        <Card icon={FiFileText} title="Order Summary">
                            <dl className="space-y-3">
                                <Row label={`Item Total (${view.itemCount} ${view.itemCount === 1 ? "item" : "items"})`}>
                                    {money(view.subtotal)}
                                </Row>
                                <Row label="Delivery Charge">{view.shipping === 0 ? "Free" : money(view.shipping)}</Row>
                                {view.tax > 0 && <Row label="Tax">{money(view.tax)}</Row>}
                                {view.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <dt className="text-gray-500">Discount</dt>
                                        <dd className="font-semibold text-emerald-600">- {money(view.discount)}</dd>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                                    <dt>Total Amount</dt>
                                    <dd>{money(view.total)}</dd>
                                </div>
                            </dl>

                            {view.saved > 0 && (
                                <div className="mt-4 flex items-center justify-center gap-2 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800">
                                    <FiTag className="h-4 w-4" /> You saved {money(view.saved)} on this order!
                                </div>
                            )}
                        </Card>

                        {/* payment */}
                        <Card icon={FiCreditCard} title="Payment Information">
                            <dl className="space-y-3">
                                <Row label="Payment Method">{view.methodLabel}</Row>
                                <div className="flex items-center justify-between text-sm">
                                    <dt className="text-gray-500">Payment Status</dt>
                                    <dd
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${view.paid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                            }`}
                                    >
                                        {view.paid ? "Paid Successfully" : view.isCod ? "Pay on Delivery" : "Pending"}
                                    </dd>
                                </div>
                                {!view.isCod && view.transactionId && (
                                    <Row label="Transaction ID">
                                        <span className="break-all">{view.transactionId}</span>
                                    </Row>
                                )}
                                <Row label="Payment Date">{fmtLong(view.paymentDate)}</Row>
                            </dl>
                        </Card>

                        {/* address */}
                        <Card icon={FiMapPin} title="Delivery Address">
                            {view.address ? (
                                <div className="space-y-0.5 text-sm text-gray-600">
                                    <p className="font-bold text-gray-900">{view.address.full_name ?? view.address.name}</p>
                                    <p>{[view.address.building_number, view.address.street].filter(Boolean).join(", ")}</p>
                                    <p>
                                        {[view.address.city, view.address.state].filter(Boolean).join(", ")}
                                        {view.address.pincode ? ` - ${view.address.pincode}` : ""}
                                    </p>
                                    {view.address.phone && <p>Phone: {view.address.phone}</p>}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Address not available</p>
                            )}
                        </Card>

                        {/* help */}
                        <Card>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <FiHeadphones className="h-5 w-5 text-gray-800" />
                                    <h2 className="text-base font-bold text-gray-900">Need Help?</h2>
                                </div>
                                <Link
                                    to="/contact"
                                    className="border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Contact Support
                                </Link>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">For any queries related to your order.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TrackOrder;