import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import Avatar from "../components/common/Avatar";
import { fetchCustomers } from "../redux/slices/CustomersSlice";
import { formatCurrency, formatDate } from "../utils/format";

const columns = [
    {
        key: "name",
        header: "Customer",
        render: (r) => (
            <div className="flex items-center gap-3">
                <Avatar name={r.name} />
                <div>
                    <p className="font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.email}</p>
                </div>
            </div>
        ),
    },
    { key: "orders", header: "Orders" },
    { key: "spent", header: "Total spent", render: (r) => formatCurrency(r.spent) },
    { key: "lastOrder", header: "Last order", render: (r) => formatDate(r.lastOrder) },
];

export default function CustomersPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.customers);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter((c) => !q || [c.name, c.email].some((f) => f.toLowerCase().includes(q)));
    }, [list, search]);

    return (
        <>
            <PageHeader title="Customers" subtitle="People who have ordered from your store." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchCustomers())} />
            <Card>
                <ListToolbar search={search} onSearch={setSearch} placeholder="Search name or email" />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No customers match your search" />
            </Card>
        </>
    );
}
