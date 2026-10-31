import { FiBox, FiDollarSign, FiShoppingBag, FiStar } from "react-icons/fi";
import StatCard from "../common/StatCard";
import { formatCurrency, formatNumber } from "../../utils/format";

const META = {
    revenue: { icon: FiDollarSign, tone: "green", suffix: "%" },
    orders: { icon: FiShoppingBag, tone: "orange", suffix: "%" },
    products: { icon: FiBox, tone: "green", suffix: "%" },
    rating: { icon: FiStar, tone: "yellow", suffix: "" },
};

const formatValue = (s) => {
    if (s.format === "currency") return formatCurrency(s.value);
    if (s.format === "rating") return s.value.toFixed(1);
    return formatNumber(s.value);
};

export default function StatsGrid({ stats = [], loading }) {
    if (loading && stats.length === 0) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-[132px] animate-pulse rounded-xl border border-slate-200 bg-white" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
                <StatCard
                    key={s.key}
                    label={s.label}
                    value={formatValue(s)}
                    change={s.change}
                    changeSuffix={META[s.key]?.suffix}
                    icon={META[s.key]?.icon}
                    tone={META[s.key]?.tone}
                />
            ))}
        </div>
    );
}
