export default function Card({ title, action, children, className = "" }) {
    return (
        <section className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
            {(title || action) && (
                <div className="mb-4 flex items-center justify-between gap-3">
                    {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}
