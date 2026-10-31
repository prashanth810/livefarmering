import { FiDollarSign, FiShoppingBag, FiShoppingCart, FiUsers } from "react-icons/fi";
import StatCard from "../common/StatCard";
import { formatCurrency, formatNumber } from "../../utils/format";

const ICONS = {
    revenue: { icon: FiDollarSign, tone: "green" },
    orders: { icon: FiShoppingBag, tone: "orange" },
    users: { icon: FiUsers, tone: "blue" },
    vendors: { icon: FiShoppingCart, tone: "yellow" },
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
                    value={s.format === "currency" ? formatCurrency(s.value) : formatNumber(s.value)}
                    change={s.change}
                    icon={ICONS[s.key]?.icon}
                    tone={ICONS[s.key]?.tone}
                />
            ))}
        </div>
    );
}
