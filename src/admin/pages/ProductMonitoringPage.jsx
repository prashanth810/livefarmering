import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import { fetchProducts, updateProductStatus } from "../redux/slices/ProductsSlice";
import { formatCurrency } from "../utils/format";

export default function ProductMonitoringPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.products);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter(
            (p) => (status === "All" || p.status === status) && (!q || [p.name, p.vendor, p.category].some((f) => f.toLowerCase().includes(q)))
        );
    }, [list, search, status]);

    const toggleFlag = async (product) => {
        const next = product.status === "Flagged" ? "Live" : "Flagged";
        const result = await dispatch(updateProductStatus({ id: product.id, status: next }));
        if (updateProductStatus.fulfilled.match(result)) toast.success(next === "Flagged" ? "Product flagged" : "Flag removed");
        else toast.error(result.payload || "Could not update product");
    };

    const columns = [
        { key: "name", header: "Product", render: (r) => <span className="font-semibold text-slate-900">{r.name}</span> },
        { key: "vendor", header: "Vendor" },
        { key: "category", header: "Category" },
        { key: "price", header: "Price", render: (r) => formatCurrency(r.price) },
        { key: "stock", header: "Stock", render: (r) => (r.stock === 0 ? <span className="text-red-500">0</span> : r.stock) },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (r) => (
                <button
                    type="button"
                    onClick={() => toggleFlag(r)}
                    disabled={r.status === "Out of Stock"}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                    {r.status === "Flagged" ? "Remove flag" : "Flag"}
                </button>
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Product Monitoring" subtitle="Keep an eye on listings, stock levels and flagged products." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchProducts())} />
            <Card>
                <ListToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search product, vendor or category"
                    filter={status}
                    onFilter={setStatus}
                    options={["Live", "Flagged", "Out of Stock"]}
                />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No products match your search" />
            </Card>
        </>
    );
}
