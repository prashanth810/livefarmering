import { Link, useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import Card from "../common/Card";
import DataTable from "../common/DataTable";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatDate, formatTime } from "../../utils/format";

export default function RecentOrders({ orders, loading }) {
    const navigate = useNavigate();

    const columns = [
        { key: "id", header: "Order ID", render: (r) => <span className="font-semibold text-slate-900">{r.id}</span> },
        {
            key: "customer",
            header: "Customer",
            render: (r) => (
                <div className="flex items-center gap-3">
                    <Avatar name={r.customer} />
                    <div>
                        <p className="font-medium text-slate-900">{r.customer}</p>
                        <p className="text-xs text-slate-400">{r.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "date",
            header: "Date & Time",
            render: (r) => (
                <div>
                    <p className="font-medium text-slate-900">{formatDate(r.date)}</p>
                    <p className="text-xs text-slate-400">{formatTime(r.date)}</p>
                </div>
            ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { key: "total", header: "Total", render: (r) => <span className="font-semibold text-slate-900">{formatCurrency(r.total)}</span> },
        {
            key: "action",
            header: "Action",
            render: () => (
                <button type="button" aria-label="Order actions" onClick={() => navigate("/vendor/orders")} className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50">
                    <FiMoreVertical size={14} />
                </button>
            ),
        },
    ];

    return (
        <Card
            title="Recent Orders"
            action={
                <Link to="/vendor/orders" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    View All Orders
                </Link>
            }
        >
            <DataTable columns={columns} rows={orders} loading={loading} emptyText="No orders yet" />
        </Card>
    );
}
