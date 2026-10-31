import { FiCheckCircle, FiClock } from "react-icons/fi";
import DataTable from "../common/DataTable";
import ShopCell from "../common/ShopCell";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/format";

const DocumentsCell = ({ value }) =>
    value === "Verified" ? (
        <span className="flex items-center gap-1.5 text-emerald-600">
            <FiCheckCircle size={14} /> Verified
        </span>
    ) : (
        <span className="flex items-center gap-1.5 text-slate-400">
            <FiClock size={14} /> {value}
        </span>
    );

const btn = "rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100";

/**
 * Used on the dashboard (Review / Manage buttons) and on the Vendor Approvals page
 * (pass onApprove + onReject to get Approve / Reject buttons).
 */
export default function ApprovalsTable({ rows, loading, onReview, onApprove, onReject, pageSize }) {
    const columns = [
        { key: "shop", header: "Vendor Info", render: (r) => <ShopCell name={r.shop} sub={r.email} /> },
        { key: "category", header: "Shop Category" },
        { key: "registeredOn", header: "Registration Date", render: (r) => formatDate(r.registeredOn) },
        { key: "documents", header: "Documents", render: (r) => <DocumentsCell value={r.documents} /> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
            key: "actions",
            header: "Actions",
            render: (r) => {
                const pending = r.status.startsWith("Pending");

                if (onApprove && pending) {
                    return (
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={r.documents !== "Verified"}
                                onClick={() => onApprove(r)}
                                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                                title={r.documents !== "Verified" ? "Documents must be verified first" : undefined}
                            >
                                Approve
                            </button>
                            <button type="button" onClick={() => onReject(r)} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                                Reject
                            </button>
                        </div>
                    );
                }

                return (
                    <button type="button" onClick={() => onReview?.(r)} className={btn}>
                        {r.status === "Approved" ? "Manage" : "Review"}
                    </button>
                );
            },
        },
    ];

    return <DataTable columns={columns} rows={rows} loading={loading} pageSize={pageSize} emptyText="No vendor applications" />;
}
