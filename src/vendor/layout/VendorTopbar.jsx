import { FiBell, FiChevronDown, FiMenu, FiSearch } from "react-icons/fi";
import { VENDOR_PROFILE } from "../constants/navItems";
import Avatar from "../components/common/Avatar";

export default function VendorTopbar({ onMenuClick }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
            <button type="button" onClick={onMenuClick} aria-label="Open menu" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
                <FiMenu size={20} />
            </button>

            <div className="relative w-full max-w-sm">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search orders, products..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white"
                />
            </div>

            <div className="ml-auto flex items-center gap-4">
                <button type="button" aria-label="Notifications" className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                    <FiBell size={17} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
                </button>

                <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                <button type="button" className="flex items-center gap-3 text-left">
                    <Avatar name={VENDOR_PROFILE.store} size="md" />
                    <span className="hidden sm:block">
                        <span className="block text-sm font-semibold leading-tight">{VENDOR_PROFILE.store}</span>
                        <span className="block text-xs text-slate-400">{VENDOR_PROFILE.role}</span>
                    </span>
                    <FiChevronDown className="hidden text-slate-400 sm:block" size={16} />
                </button>
            </div>
        </header>
    );
}
