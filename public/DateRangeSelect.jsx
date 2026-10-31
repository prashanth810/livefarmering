import { FiShoppingBag } from "react-icons/fi";

// Icon + name + sub line (used in vendor tables)
export default function ShopCell({ name, sub }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <FiShoppingBag size={15} />
            </span>
            <div>
                <p className="font-semibold text-slate-900">{name}</p>
                {sub && <p className="text-xs text-slate-400">{sub}</p>}
            </div>
        </div>
    );
}
