import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import ShopCell from "../components/common/ShopCell";
import StatusBadge from "../components/common/StatusBadge";
import { fetchVendors, updateVendorStatus } from "../redux/slices/VendorsSlice";
import { formatCurrency } from "../utils/format";

export default function VendorsPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.vendors);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        dispatch(fetchVendors());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter(
            (v) =>
                (status === "All" || v.status === status) &&
                (!q || [v.shop, v.owner, v.email, v.city].some((f) => f.toLowerCase().includes(q)))
        );
    }, [list, search, status]);

    const toggleStatus = async (vendor) => {
        const next = vendor.status === "Suspended" ? "Active" : "Suspended";
        const result = await dispatch(updateVendorStatus({ id: vendor.id, status: next }));
        if (updateVendorStatus.fulfilled.match(result)) toast.success(`${vendor.shop} is now ${next.toLowerCase()}`);
        else toast.error(result.payload || "Could not update vendor");
    };

    const columns = [
        { key: "shop", header: "Shop", render: (r) => <ShopCell name={r.shop} sub={r.email} /> },
        { key: "owner", header: "Owner" },
        { key: "category", header: "Category" },
        { key: "city", header: "City" },
        { key: "products", header: "Products" },
        { key: "revenue", header: "Revenue", render: (r) => formatCurrency(r.revenue, 0) },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (r) => (
                <button
                    type="button"
                    onClick={() => toggleStatus(r)}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                    {r.status === "Suspended" ? "Reactivate" : "Suspend"}
                </button>
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Vendors & Shops" subtitle="See every shop on the marketplace and manage their access." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchVendors())} />
            <Card>
                <ListToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search shop, owner or city"
                    filter={status}
                    onFilter={setStatus}
                    options={["Active", "Suspended", "Inactive"]}
                />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No vendors match your search" />
            </Card>
        </>
    );
}
