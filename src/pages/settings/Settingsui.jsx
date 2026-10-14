export const inputClass =
    "w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none";

export const primaryBtn =
    "cursor-pointer bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70";

export const secondaryBtn =
    "cursor-pointer border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50";

export const Field = ({ label, htmlFor, error, className = "", children }) => (
    <div className={className}>
        <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-gray-900">
            {label}
        </label>
        {children}
        {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
);

export const SectionCard = ({ id, title, danger = false, children }) => (
    <section
        id={id}
        className={`scroll-mt-40 overflow-hidden border shadow-sm ${danger ? "border-red-200 bg-red-50/40" : "border-gray-200 bg-white"
            }`}
    >
        <div className={`border-b px-6 py-4 ${danger ? "border-red-100" : "border-gray-100"}`}>
            <h2 className={`text-base font-bold ${danger ? "text-red-600" : "text-gray-900"}`}>{title}</h2>
        </div>
        {children}
    </section>
);

export const Toggle = ({ checked, onChange, label }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${checked ? "bg-emerald-600" : "bg-gray-200"
            }`}
    >
        <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""
                }`}
        />
    </button>
);