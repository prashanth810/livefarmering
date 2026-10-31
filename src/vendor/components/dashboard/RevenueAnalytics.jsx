import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Card from "../common/Card";
import RevenueBars from "../charts/RevenueBars";

export default function RevenueAnalytics({ revenue }) {
    const [period, setPeriod] = useState("week");

    return (
        <Card
            title="Revenue Analytics"
            className="h-full"
            action={
                <label className="relative inline-flex items-center">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                    <FiChevronDown className="pointer-events-none absolute right-2.5 text-slate-400" size={13} />
                </label>
            }
        >
            <RevenueBars data={revenue?.[period] || []} height={290} />
        </Card>
    );
}
