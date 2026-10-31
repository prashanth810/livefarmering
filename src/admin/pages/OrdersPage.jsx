import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import { fetchOrders } from "../redux/slices/OrdersSlice";
import { formatCurrency, formatDate } from "../utils/format";

const columns = [
    { key: "id", header: "Order", render: (r) => <span className="font-semibold text-slate-900">{r.id}</span> },
    { key: "customer", header: "Customer" },
    { key: "vendor", header: "Vendor" },
    { key: "items", header: "Items" },
    { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

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
        return list.filter(
            (o) => (status === "All" || o.status === status) && (!q || [o.id, o.customer, o.vendor].some((f) => f.toLowerCase().includes(q)))
        );
    }, [list, search, status]);

    return (
        <>
            <PageHeader title="All Orders" subtitle="Track every order placed across the marketplace." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchOrders())} />
            <Card>
                <ListToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search order, customer or vendor"
                    filter={status}
                    onFilter={setStatus}
                    options={["Processing", "On the way", "Delivered", "Cancelled"]}
                />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No orders match your search" />
            </Card>
        </>
    );
}
