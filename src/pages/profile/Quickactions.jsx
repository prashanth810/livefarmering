import { FiChevronRight, FiHeart, FiMapPin, FiSettings } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";

const ACTIONS = [
    {
        key: "addresses",
        title: "Manage Addresses",
        desc: "Add or edit your delivery addresses",
        icon: FiMapPin,
        card: "bg-green-50",
        iconBox: "bg-green-100 text-green-600",
    },
    {
        key: "favourites",
        title: "View Favourites",
        desc: "Your saved products",
        icon: FiHeart,
        card: "bg-orange-50",
        iconBox: "bg-red-100 text-red-500",
        to: "/wishlist",
    },
    {
        key: "wallet",
        title: "Wallet & Offers",
        desc: "Check balance and offers",
        icon: LuWallet,
        card: "bg-violet-50",
        iconBox: "bg-violet-100 text-violet-600",
    },
    {
        key: "settings",
        title: "Account Settings",
        desc: "Update your profile, password",
        icon: FiSettings,
        card: "bg-blue-50",
        iconBox: "bg-blue-100 text-blue-600",
    },
];

// onAction(action) is called for every card; the parent decides whether to navigate.
const QuickActions = ({ onAction }) => (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.key}
                        type="button"
                        onClick={() => onAction(action)}
                        className={`flex items-center gap-3 rounded-xl p-4 text-left transition hover:shadow-md ${action.card}`}
                    >
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${action.iconBox}`}>
                            <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-gray-900">{action.title}</span>
                            <span className="block text-xs text-gray-500">{action.desc}</span>
                        </span>
                        <FiChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                    </button>
                );
            })}
        </div>
    </section>
);

export default QuickActions;