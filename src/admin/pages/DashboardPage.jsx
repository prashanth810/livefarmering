import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import DateRangeSelect from "../components/common/DateRangeSelect";
import ErrorBanner from "../components/common/ErrorBanner";
import StatsGrid from "../components/dashboard/StatsGrid";
import RevenueOverview from "../components/dashboard/RevenueOverview";
import TopCategories from "../components/dashboard/TopCategories";
import PendingApprovals from "../components/dashboard/PendingApprovals";
import { fetchDashboard } from "../redux/slices/DashboardSlice";
import { fetchApprovals } from "../redux/slices/ApprovalsSlice";

export default function DashboardPage() {
    const dispatch = useDispatch();
    const [range, setRange] = useState("30d");

    const { stats, revenue, categories, loading, error } = useSelector((s) => s.dashboard);
    const approvals = useSelector((s) => s.approvals);

    useEffect(() => {
        dispatch(fetchDashboard(range));
    }, [dispatch, range]);

    useEffect(() => {
        dispatch(fetchApprovals());
    }, [dispatch]);

    return (
        <>
            <PageHeader title="Platform Overview" subtitle="Monitor your grocery marketplace performance and activities.">
                <DateRangeSelect value={range} onChange={setRange} />
            </PageHeader>

            <ErrorBanner message={error} onRetry={() => dispatch(fetchDashboard(range))} />

            <div className="space-y-6">
                <StatsGrid stats={stats} loading={loading} />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RevenueOverview data={revenue} />
                    </div>
                    <TopCategories categories={categories} />
                </div>

                <PendingApprovals rows={approvals.list} loading={approvals.loading} />
            </div>
        </>
    );
}
