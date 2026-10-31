import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import ListToolbar from "../components/common/ListToolbar";
import ApprovalsTable from "../components/dashboard/ApprovalsTable";
import { decideApproval, fetchApprovals } from "../redux/slices/ApprovalsSlice";

export default function VendorApprovalsPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.approvals);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    useEffect(() => {
        dispatch(fetchApprovals());
    }, [dispatch]);

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return list.filter(
            (a) => (status === "All" || a.status === status) && (!q || [a.shop, a.email].some((f) => f.toLowerCase().includes(q)))
        );
    }, [list, search, status]);

    const decide = async (row, next) => {
        const result = await dispatch(decideApproval({ id: row.id, status: next }));
        if (decideApproval.fulfilled.match(result)) toast.success(`${row.shop} ${next.toLowerCase()}`);
        else toast.error(result.payload || "Could not update application");
    };

    return (
        <>
            <PageHeader title="Vendor Approvals" subtitle="Review new shop applications and verify their documents." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchApprovals())} />
            <Card>
                <ListToolbar
                    search={search}
                    onSearch={setSearch}
                    placeholder="Search shop or email"
                    filter={status}
                    onFilter={setStatus}
                    options={["Pending Review", "Pending Docs", "Approved", "Rejected"]}
                />
                <ApprovalsTable
                    rows={rows}
                    loading={loading}
                    pageSize={6}
                    onApprove={(r) => decide(r, "Approved")}
                    onReject={(r) => decide(r, "Rejected")}
                />
            </Card>
        </>
    );
}
