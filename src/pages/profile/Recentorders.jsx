import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { ORDER_STATUS_STYLES } from "./profileData";

const RecentOrders = ({ orders }) => (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/shop" className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800">
                View All Orders <FiArrowRight className="h-4 w-4" />
            </Link>
        </div>

        {orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">You have no orders yet.</p>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-3 lg:border-r lg:border-gray-100 lg:px-4 lg:first:pl-0 lg:last:border-r-0">
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-3xl">
                            {order.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">#{order.id}</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                            <p className="text-xs text-gray-600">
                                {order.items} items • ₹{order.total}
                            </p>
                            <span
                                className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${ORDER_STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <FiChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                    </div>
                ))}
            </div>
        )}
    </section>
);

export default RecentOrders;