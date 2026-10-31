import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import { fetchUsers } from "../redux/slices/UsersSlice";
import { formatCurrency, formatDate } from "../utils/format";

const columns = [
    {
        key: "name",
        header: "Customer",
        render: (r) => (
            <div>
                <p className="font-semibold text-slate-900">{r.name}</p>
                <p className="text-xs text-slate-400">{r.email}</p>
            </div>
        ),
    },
    { key: "orders", header: "Orders" },
    { key: "spent", header: "Total spent", render: (r) => formatCurrency(r.spent) },
    { key: "joinedOn", header: "Joined", render: (r) => formatDate(r.joinedOn) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
];

export default function UsersPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.users);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter((u) => (status === "All" || u.status === status) && (!q || [u.name, u.email].some((f) => f.toLowerCase().includes(q))));
    }, [list, search, status]);

    return (
        <>
            <PageHeader title="Customers" subtitle="People who shop on Freshies." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchUsers())} />
            <Card>
                <ListToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search name or email"
                    filter={status}
                    onFilter={setStatus}
                    options={["Active", "Blocked"]}
                />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No customers match your search" />
            </Card>
        </>
    );
}
