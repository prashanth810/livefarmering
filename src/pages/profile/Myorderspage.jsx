import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { DUMMY_ORDERS, ORDER_TABS } from "../profile/Profiledata";
import OrderCard from "./Ordercard";
import { groupOf, normalizeOrder } from "./Orderutils";

const MyOrdersPage = () => {
    const profile = useSelector((state) => state.auth.profile?.profiledata);
    const source = Array.isArray(profile?.orders) && profile.orders.length ? profile.orders : DUMMY_ORDERS;
    const list = useMemo(() => source.map(normalizeOrder), [source]);
    const [active, setActive] = useState("all");

    const counts = useMemo(
        () =>
            ORDER_TABS.reduce((acc, t) => {
                acc[t.key] = t.match ? list.filter((o) => groupOf(o.raw.status) === groupOf(t.match[0])).length : list.length;
                return acc;
            }, {}),
        [list]
    );

    const visible = active === "all" ? list : list.filter((o) => o.group === active);
    const soon = (msg) => () => toast(msg, { id: "orders-toast" });

    return (
        <main className="mx-auto flex max-w-[90%] flex-col gap-6 px-4 py-8 sm:px-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>

            <div className="scrollbar flex gap-8 overflow-x-auto border-b border-gray-200" role="tablist">
                {ORDER_TABS.map((t) => {
                    const on = active === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            onClick={() => setActive(t.key)}
                            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 text-base font-semibold transition-colors ${on ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {t.label}
                            <span className={`rounded-full px-2.5 py-0.5 text-xs ${on ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                {counts[t.key]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {visible.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">No orders found.</p>
            ) : (
                <div className="flex flex-col gap-5">
                    {visible.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onInvoice={soon("Invoice download coming soon")}
                            onDetails={soon("Order details coming soon")}
                            onTrack={soon("Order tracking coming soon")}
                        />
                    ))}
                </div>
            )}
        </main>
    );
};

export default MyOrdersPage;