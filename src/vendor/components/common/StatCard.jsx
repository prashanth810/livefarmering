import { FiMinus, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const TONES = {
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-500",
    yellow: "bg-amber-50 text-amber-500",
};

export default function StatCard({ label, value, change, changeSuffix = "%", icon: Icon, tone = "green" }) {
    const flat = change === 0;
    const positive = change > 0;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
                <p className="text-sm text-slate-400">{label}</p>
                {Icon && (
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}>
                        <Icon size={17} />
                    </span>
                )}
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
            {change !== undefined && (
                <p className={`mt-3 flex items-center gap-1 text-xs font-medium ${flat ? "text-slate-400" : positive ? "text-emerald-600" : "text-red-500"}`}>
                    {flat ? <FiMinus size={13} /> : positive ? <FiTrendingUp size={13} /> : <FiTrendingDown size={13} />}
                    {positive ? "+" : ""}
                    {change}
                    {changeSuffix} <span className="font-normal text-slate-400">from last month</span>
                </p>
            )}
        </div>
    );
}
