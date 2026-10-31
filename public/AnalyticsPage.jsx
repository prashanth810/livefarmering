import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { NAV_SECTIONS } from "../constants/navItems";

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
    }`;

export default function Sidebar({ open, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <>
            {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} />}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <LuLeaf size={18} />
                    </span>
                    <span className="text-lg font-bold text-emerald-700">Freshies</span>
                </div>

                <nav className="admin-scroll flex-1 space-y-5 overflow-y-auto px-3 py-5">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {section.title}
                            </p>
                            <div className="space-y-1">
                                {section.items.map(({ label, to, icon: Icon, end }) => (
                                    <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
                                        <Icon size={18} />
                                        {label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="space-y-1 border-t border-slate-100 px-3 py-4">
                    <NavLink to="/admin/settings" className={linkClass} onClick={onClose}>
                        <FiSettings size={18} />
                        Settings
                    </NavLink>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
