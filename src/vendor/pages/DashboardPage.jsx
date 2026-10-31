import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import DateRangeSelect from "../components/common/DateRangeSelect";
import AddProductButton from "../components/common/AddProductButton";
import ErrorBanner from "../components/common/ErrorBanner";
import StatsGrid from "../components/dashboard/StatsGrid";
import RevenueAnalytics from "../components/dashboard/RevenueAnalytics";
import TopProducts from "../components/dashboard/TopProducts";
import RecentOrders from "../components/dashboard/RecentOrders";
import { fetchDashboard } from "../redux/slices/DashboardSlice";

const RANGES = [
    { value: "week", label: "Oct 18 - Oct 24, 2023" },
    { value: "month", label: "Sep 25 - Oct 24, 2023" },
];

export default function DashboardPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [range, setRange] = useState("week");
    const { stats, revenue, topProducts, recentOrders, loading, error } = useSelector((s) => s.dashboard);

    useEffect(() => {
        dispatch(fetchDashboard(range));
    }, [dispatch, range]);

    return (
        <>
            <PageHeader title="Dashboard Overview" subtitle="Welcome back! Here's what's happening with your store today.">
                <DateRangeSelect value={range} onChange={setRange} options={RANGES} />
                <AddProductButton onClick={() => navigate("/vendor/products?add=1")} />
            </PageHeader>

            <ErrorBanner message={error} onRetry={() => dispatch(fetchDashboard(range))} />

            <div className="space-y-6">
                <StatsGrid stats={stats} loading={loading} />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RevenueAnalytics revenue={revenue} />
                    </div>
                    <TopProducts products={topProducts} />
                </div>

                <RecentOrders orders={recentOrders} loading={loading && recentOrders.length === 0} />
            </div>
        </>
    );
}
