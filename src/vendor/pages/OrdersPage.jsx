import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import Avatar from "../components/common/Avatar";
import StatusBadge from "../components/common/StatusBadge";
import { fetchOrders, updateOrderStatus } from "../redux/slices/OrdersSlice";
import { formatCurrency, formatDate, formatTime } from "../utils/format";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.orders);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter((o) => (status === "All" || o.status === status) && (!q || [o.id, o.customer, o.email].some((f) => f.toLowerCase().includes(q))));
    }, [list, search, status]);

    const changeStatus = async (order, next) => {
        const result = await dispatch(updateOrderStatus({ id: order.id, status: next }));
        if (updateOrderStatus.fulfilled.match(result)) toast.success(`${order.id} marked ${next.toLowerCase()}`);
        else toast.error(result.payload || "Could not update order");
    };

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
        { key: "items", header: "Items" },
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
            header: "Update status",
            render: (r) => (
                <select
                    value={r.status}
                    onChange={(e) => changeStatus(r, e.target.value)}
                    disabled={r.status === "Delivered" || r.status === "Cancelled"}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-emerald-500 disabled:opacity-50"
                >
                    {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Orders" subtitle="Track and update the orders placed in your store." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchOrders())} />
            <Card>
                <ListToolbar search={search} onSearch={setSearch} placeholder="Search order, customer or email" filter={status} onFilter={setStatus} options={STATUSES} />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No orders match your search" />
            </Card>
        </>
    );
}
