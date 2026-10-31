import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import AddProductButton from "../components/common/AddProductButton";
import ProductFormModal from "../components/products/ProductFormModal";
import { addProduct, fetchProducts, updateProductStatus } from "../redux/slices/ProductsSlice";
import { formatCurrency } from "../utils/format";

export default function ProductsPage() {
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const { list, loading, saving, error } = useSelector((s) => s.products);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const modalOpen = params.get("add") === "1"; // dashboard "Add Product" opens this

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter((p) => (status === "All" || p.status === status) && (!q || [p.name, p.category].some((f) => f.toLowerCase().includes(q))));
    }, [list, search, status]);

    const openModal = () => setParams({ add: "1" });
    const closeModal = () => setParams({});

    const handleAdd = async (data) => {
        const result = await dispatch(addProduct(data));
        if (addProduct.fulfilled.match(result)) {
            toast.success("Product added");
            return true;
        }
        toast.error(result.payload || "Could not add product");
        return false;
    };

    const toggleStatus = async (product) => {
        const next = product.status === "Inactive" ? "Active" : "Inactive";
        const result = await dispatch(updateProductStatus({ id: product.id, status: next }));
        if (updateProductStatus.fulfilled.match(result)) toast.success(`${product.name} is now ${next.toLowerCase()}`);
        else toast.error(result.payload || "Could not update product");
    };

    const columns = [
        {
            key: "name",
            header: "Product",
            render: (r) => (
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">{r.emoji}</span>
                    <span className="font-semibold text-slate-900">{r.name}</span>
                </div>
            ),
        },
        { key: "category", header: "Category" },
        { key: "price", header: "Price", render: (r) => formatCurrency(r.price) },
        { key: "stock", header: "Stock", render: (r) => (r.stock === 0 ? <span className="text-red-500">0</span> : r.stock) },
        { key: "sold", header: "Sold" },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (r) => (
                <button
                    type="button"
                    onClick={() => toggleStatus(r)}
                    disabled={r.status === "Out of Stock"}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                >
                    {r.status === "Inactive" ? "Activate" : "Deactivate"}
                </button>
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Products" subtitle="Manage everything you sell in your store.">
                <AddProductButton onClick={openModal} />
            </PageHeader>
            <ErrorBanner message={error} onRetry={() => dispatch(fetchProducts())} />
            <Card>
                <ListToolbar search={search} onSearch={setSearch} placeholder="Search product or category" filter={status} onFilter={setStatus} options={["Active", "Inactive", "Out of Stock"]} />
                <DataTable columns={columns} rows={rows} loading={loading} pageSize={6} emptyText="No products match your search" />
            </Card>
            <ProductFormModal open={modalOpen} saving={saving} onClose={closeModal} onSubmit={handleAdd} />
        </>
    );
}
