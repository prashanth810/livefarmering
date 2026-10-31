import { FiSearch } from "react-icons/fi";

export default function ListToolbar({ search, onSearch, placeholder = "Search...", filter, onFilter, options = [] }) {
    return (
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
                />
            </div>

            {options.length > 0 && (
                <select
                    value={filter}
                    onChange={(e) => onFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                >
                    <option value="All">All statuses</option>
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
