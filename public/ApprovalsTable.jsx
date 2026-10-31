import { FiCalendar, FiChevronDown } from "react-icons/fi";

const OPTIONS = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
];

export default function DateRangeSelect({ value, onChange }) {
    return (
        <label className="relative inline-flex items-center">
            <FiCalendar className="pointer-events-none absolute left-3 text-slate-500" size={15} />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
            >
                {OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 text-slate-400" size={15} />
        </label>
    );
}
