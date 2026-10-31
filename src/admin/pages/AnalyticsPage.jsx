import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import DateRangeSelect from "../components/common/DateRangeSelect";
import ErrorBanner from "../components/common/ErrorBanner";
import Card from "../components/common/Card";
import RevenueOrdersChart from "../components/charts/RevenueOrdersChart";
import UserGrowthChart from "../components/charts/UserGrowthChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import TopVendorsChart from "../components/charts/TopVendorsChart";
import { fetchAnalytics } from "../redux/slices/AnalyticsSlice";
import { formatCurrency } from "../utils/format";

const formatKpi = (k) => (k.format === "currency" ? formatCurrency(k.value) : `${k.value}%`);

export default function AnalyticsPage() {
    const dispatch = useDispatch();
    const [range, setRange] = useState("30d");
    const { kpis, revenueOrders, userGrowth, categoryShare, topVendors, loading, error } = useSelector((s) => s.analytics);

    useEffect(() => {
        dispatch(fetchAnalytics(range));
    }, [dispatch, range]);

    return (
        <>
            <PageHeader title="Analytics" subtitle="Understand how revenue, orders and customers are trending.">
                <DateRangeSelect value={range} onChange={setRange} />
            </PageHeader>

            <ErrorBanner message={error} onRetry={() => dispatch(fetchAnalytics(range))} />

            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {(loading && kpis.length === 0 ? Array.from({ length: 4 }) : kpis).map((k, i) => (
                        <div key={k?.label || i} className="rounded-xl border border-slate-200 bg-white p-5">
                            {k ? (
                                <>
                                    <p className="text-sm text-slate-400">{k.label}</p>
                                    <p className="mt-2 text-2xl font-bold">{formatKpi(k)}</p>
                                </>
                            ) : (
                                <div className="h-14 animate-pulse rounded bg-slate-100" />
                            )}
                        </div>
                    ))}
                </div>

                <Card title="Revenue and orders">
                    <RevenueOrdersChart data={revenueOrders} />
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card title="Customer growth">
                        <UserGrowthChart data={userGrowth} />
                    </Card>
                    <Card title="Sales by category">
                        <CategoryPieChart data={categoryShare} />
                    </Card>
                </div>

                <Card title="Top vendors by revenue">
                    <TopVendorsChart data={topVendors} />
                </Card>
            </div>
        </>
    );
}
