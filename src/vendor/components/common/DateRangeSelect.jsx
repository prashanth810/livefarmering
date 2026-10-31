import { FiCalendar, FiChevronDown } from "react-icons/fi";

export default function DateRangeSelect({ value, onChange, options }) {
    return (
        <label className="relative inline-flex items-center">
            <FiCalendar className="pointer-events-none absolute left-3 text-slate-500" size={14} />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 text-slate-400" size={14} />
        </label>
    );
}
