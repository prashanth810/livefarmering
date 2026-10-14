import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { ORDER_STATUS_STYLES } from "./Profiledata";
import { normalizeOrder } from "./Orderutils";
import RecentOrdersSkeleton from "../../reusables/RecentOrdersSkeleton";

const STATUS_LABEL = { completed: "Delivered", processing: "Processing", cancelled: "Cancelled" };

const RecentOrders = () => {
    const navigate = useNavigate();
    const { ordersloading, ordersdata, orderserror } = useSelector((state) => state.order.myorders);

    const recent = (Array.isArray(ordersdata) ? ordersdata : []).slice(0, 4).map(normalizeOrder);


    return (
        <section className="border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-3">
                <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                <Link to="/orders" className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800">
                    View All Orders <FiArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {ordersloading && recent.length === 0 ? (
                <RecentOrdersSkeleton />
            ) : orderserror && recent.length === 0 ? (
                <p className="py-6 text-center text-sm text-red-500">
                    {typeof orderserror === "string" ? orderserror : "Unable to load orders"}
                </p>
            ) : recent.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">You have no orders yet.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {recent.map((order) => {
                        // API sends PLACED / DELIVERED / CANCELLED, so map to the pill labels
                        const label = ORDER_STATUS_STYLES[order.status] ? order.status : STATUS_LABEL[order.group];
                        const count = order.items.length;
                        const image = order.items[0]?.image;

                        // first product name, plus "+N more" when the order has several items
                        const firstName = order.items[0]?.name || "Order";
                        const title = count > 1 ? `${firstName} +${count - 1} more` : firstName;

                        return (
                            <button
                                type="button"
                                key={order.raw._id ?? order.id}
                                onClick={() => navigate("/orders")}
                                className="flex items-center gap-3 text-left lg:border-r lg:border-gray-100 lg:px-4 lg:first:pl-0 lg:last:border-r-0 cursor-pointer" >
                                <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-gray-50 text-3xl rounded-md">
                                    {image ? (
                                        <img src={image} alt={order.items[0]?.name || "Order"} className="h-full w-full object-cover" loading="lazy" />
                                    ) : (
                                        order.emoji
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 truncate"> {title}</p>
                                    <p className="text-xs text-gray-500">{order.date}</p>
                                    <p className="text-xs text-gray-600">
                                        {count} {count === 1 ? "item" : "items"} • ₹{order.total}
                                    </p>
                                    <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${ORDER_STATUS_STYLES[label] || "bg-gray-100 text-gray-600"}`}>
                                        {label}
                                    </span>
                                </div>
                                <FiChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default RecentOrders;