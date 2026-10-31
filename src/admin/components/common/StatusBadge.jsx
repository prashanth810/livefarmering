const STYLES = {
    Active: "bg-emerald-50 text-emerald-700",
    Live: "bg-emerald-50 text-emerald-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Delivered: "bg-emerald-50 text-emerald-700",
    "Pending Review": "bg-orange-50 text-orange-600",
    "Pending Docs": "bg-orange-50 text-orange-600",
    Processing: "bg-orange-50 text-orange-600",
    "On the way": "bg-blue-50 text-blue-600",
    Flagged: "bg-amber-50 text-amber-700",
    Suspended: "bg-red-50 text-red-600",
    Rejected: "bg-red-50 text-red-600",
    Cancelled: "bg-red-50 text-red-600",
    Blocked: "bg-red-50 text-red-600",
    "Out of Stock": "bg-slate-100 text-slate-600",
    Inactive: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ status }) {
    return (
        <span
            className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                STYLES[status] || "bg-slate-100 text-slate-600"
            }`}
        >
            {status}
        </span>
    );
}
