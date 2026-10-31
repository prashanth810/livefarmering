import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader";
import ErrorBanner from "../components/common/ErrorBanner";
import Card from "../components/common/Card";
import RevenueTrendChart from "../components/charts/RevenueTrendChart";
import OrderStatusPie from "../components/charts/OrderStatusPie";
import TopProductsBar from "../components/charts/TopProductsBar";
import RatingBars from "../components/charts/RatingBars";
import { fetchAnalytics } from "../redux/slices/AnalyticsSlice";
import { formatCurrency } from "../utils/format";

const formatKpi = (k) => (k.format === "currency" ? formatCurrency(k.value) : `${k.value}%`);

export default function AnalyticsPage() {
    const dispatch = useDispatch();
    const { kpis, revenueTrend, orderStatus, topProducts, ratings, loading, error } = useSelector((s) => s.analytics);

    useEffect(() => {
        dispatch(fetchAnalytics("week"));
    }, [dispatch]);

    return (
        <>
            <PageHeader title="Analytics" subtitle="See how your store is performing over time." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchAnalytics("week"))} />

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
                    <RevenueTrendChart data={revenueTrend} />
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card title="Orders by status">
                        <OrderStatusPie data={orderStatus} />
                    </Card>
                    <Card title="Ratings breakdown">
                        <RatingBars data={ratings} />
                    </Card>
                </div>

                <Card title="Best-selling products">
                    <TopProductsBar data={topProducts} />
                </Card>
            </div>
        </>
    );
}
