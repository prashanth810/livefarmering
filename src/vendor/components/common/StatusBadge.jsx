const STYLES = {
    Delivered: "bg-emerald-50 text-emerald-700",
    Active: "bg-emerald-50 text-emerald-700",
    Processing: "border border-slate-200 bg-white text-slate-700",
    Shipped: "bg-slate-100 text-slate-700",
    Cancelled: "bg-red-600 text-white",
    "Out of Stock": "bg-orange-50 text-orange-600",
    Inactive: "bg-slate-100 text-slate-500",
};

export default function StatusBadge({ status }) {
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status] || "bg-slate-100 text-slate-600"}`}>
            {status}
        </span>
    );
}
