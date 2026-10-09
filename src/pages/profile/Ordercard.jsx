import { FiCheckCircle, FiFileText, FiPackage, FiXCircle } from "react-icons/fi";
import { ORDER_BADGE } from "./Profiledata";

const ICONS = { completed: FiCheckCircle, processing: FiPackage, cancelled: FiXCircle };

const OrderCard = ({ order, onInvoice, onDetails, onTrack }) => {
    const badge = ORDER_BADGE[order.group] || ORDER_BADGE.processing;
    const Icon = ICONS[order.group] || FiPackage;
    const badgeText = order.group === "cancelled" ? badge.prefix : `${badge.prefix} ${order.statusDate}`.trim();
    const count = order.items.length;

    return (
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-4 py-4 sm:px-6">
                <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                    <Meta label="Order ID" value={`#${order.id}`} />
                    <Meta label="Date Placed" value={order.date} />
                    <Meta label="Total Amount" value={`₹${order.total}`} />
                    <Meta label="Shipped To" value={order.shippedTo} />
                </div>
                <button
                    type="button"
                    onClick={() => onInvoice?.(order)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                    <FiFileText className="h-4 w-4" /> Download Invoice
                </button>
            </div>

            {/* Body */}
            <div className="px-4 py-4 sm:px-6">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${badge.bg} ${badge.text}`}>
                    <Icon className="h-4 w-4" /> {badgeText}
                </span>

                <ul className="mt-4 divide-y divide-gray-100">
                    {order.items.map((item, i) => (
                        <li key={item.id ?? i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-[72px] sm:w-[72px]">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="h-full w-full bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] bg-[length:12px_12px]" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">{item.name}</p>
                                <p className="mt-1 text-sm text-gray-400">Qty: {item.qty}</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900 sm:text-base">₹{item.price}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer (hidden for single-item delivered style when no actions) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
                <p className="text-sm text-gray-400">
                    {count} {count === 1 ? "item" : "items"} in this order
                </p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onDetails?.(order)}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                        View Details
                    </button>
                    {order.group === "processing" && (
                        <button
                            type="button"
                            onClick={() => onTrack?.(order)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Track Order
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

const Meta = ({ label, value }) => (
    <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-gray-900">{value}</p>
    </div>
);

export default OrderCard;