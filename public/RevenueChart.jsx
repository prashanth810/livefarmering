import Card from "../common/Card";

const BAR_COLORS = ["bg-emerald-600", "bg-orange-500", "bg-blue-500", "bg-yellow-500"];

export default function TopCategories({ categories = [] }) {
    return (
        <Card title="Top Selling Categories" className="h-full">
            <div className="space-y-5">
                {categories.map((c, i) => (
                    <div key={c.name}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-800">{c.name}</span>
                            <span className="text-slate-400">{c.percent}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100">
                            <div
                                className={`h-1.5 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                                style={{ width: `${c.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
