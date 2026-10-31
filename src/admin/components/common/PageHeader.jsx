export default function PageHeader({ title, subtitle, children }) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}
