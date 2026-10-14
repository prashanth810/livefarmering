import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ORDER_TABS } from "../profile/Profiledata";
import OrderCard from "./Ordercard";
import { groupOf, normalizeOrder } from "./Orderutils";
import { getmyorders } from "../../redux/Slices/OrderSlice";

const LIMIT = 10;

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const { ordersloading, ordersdata, orderspagination, orderserror } = useSelector(
        (state) => state.order.myorders
    );

    const [page, setPage] = useState(1);
    const [active, setActive] = useState("all");

    useEffect(() => {
        dispatch(getmyorders({ page, limit: LIMIT }));
    }, [dispatch, page]);

    const list = useMemo(
        () => (Array.isArray(ordersdata) ? ordersdata : []).map(normalizeOrder),
        [ordersdata]
    );

    const counts = useMemo(
        () =>
            ORDER_TABS.reduce((acc, t) => {
                acc[t.key] = t.match ? list.filter((o) => o.group === groupOf(t.match[0])).length : list.length;
                return acc;
            }, {}),
        [list]
    );

    const visible = active === "all" ? list : list.filter((o) => o.group === active);
    const soon = (msg) => () => toast(msg, { id: "orders-toast" });

    const goToPage = (next) => {
        setPage(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const arrowClass =
        "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <main className="mx-auto flex max-w-[90%] flex-col gap-6 px-4 py-8 sm:px-6">
            {/* title + pagination (right corner) */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>

                {orderspagination && (
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Previous page"
                            disabled={!orderspagination.hasPrevPage || ordersloading}
                            onClick={() => goToPage(page - 1)}
                            className={arrowClass}
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>

                        <span className="min-w-6 text-center text-sm font-semibold text-gray-900">
                            {orderspagination.currentPage}
                        </span>

                        <button
                            type="button"
                            aria-label="Next page"
                            disabled={!orderspagination.hasNextPage || ordersloading}
                            onClick={() => goToPage(page + 1)}
                            className={arrowClass}
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

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

            {ordersloading && list.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">Loading your orders...</p>
            ) : orderserror && list.length === 0 ? (
                <p className="py-10 text-center text-sm text-red-500">
                    {typeof orderserror === "string" ? orderserror : "Unable to load orders"}
                </p>
            ) : visible.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-500">No orders found.</p>
            ) : (
                <div className="flex flex-col gap-5">
                    {visible.map((order) => (
                        <OrderCard
                            key={order.raw._id ?? order.id}
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