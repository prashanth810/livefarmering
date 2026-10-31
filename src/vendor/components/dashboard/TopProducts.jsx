import { Link } from "react-router-dom";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/format";

export default function TopProducts({ products = [] }) {
    return (
        <Card
            title="Top Products"
            className="h-full"
            action={
                <Link to="/vendor/products" className="text-sm font-medium text-teal-600 hover:underline">
                    View All
                </Link>
            }
        >
            <ul className="divide-y divide-slate-100">
                {products.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">{p.emoji}</span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-400">
                                {p.category} • {formatCurrency(p.price)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold">{p.sold}</p>
                            <p className="text-xs text-slate-400">Sales</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
