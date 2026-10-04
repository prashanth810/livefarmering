import { FiCamera, FiEdit2, FiPhone, FiUser, FiHeart, FiPercent } from "react-icons/fi";
import { LuShoppingBag, LuWallet } from "react-icons/lu";

const StatItem = ({ icon: Icon, value, label, iconClass }) => (
    <div className="flex flex-col items-center gap-1 px-2 text-center">
        <Icon className={`h-6 w-6 ${iconClass}`} />
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
    </div>
);

const ProfileSummary = ({ name, email, phone, image, role, memberSince, stats, onEdit, onChangePhoto }) => {
    return (
        <section className="grid gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:items-center">
            {/* User info */}
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    {image ? (
                        <img src={image} alt={name} className="h-24 w-24 rounded-full object-cover" />
                    ) : (
                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <FiUser className="h-10 w-10" />
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={onChangePhoto}
                        aria-label="Change photo"
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white hover:bg-green-700"
                    >
                        <FiCamera className="h-4 w-4" />
                    </button>
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="truncate text-lg font-semibold text-gray-900">{name}</h2>
                        <button type="button" onClick={onEdit} aria-label="Edit profile" className="text-gray-400 hover:text-green-600">
                            <FiEdit2 className="h-4 w-4" />
                        </button>
                    </div>
                    {email && <p className="truncate text-sm text-gray-500">{email}</p>}
                    {phone && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
                            <FiPhone className="h-3.5 w-3.5" />
                            {phone}
                        </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        {role && <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium capitalize text-green-800">{role}</span>}
                        {memberSince && <span className="text-xs text-gray-500">Member since {memberSince}</span>}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-y-5 divide-gray-100 sm:grid-cols-4 sm:divide-x">
                <StatItem icon={LuShoppingBag} value={stats.orders ?? "—"} label="Total Orders" iconClass="text-green-600" />
                <StatItem icon={FiHeart} value={stats.favourites ?? "—"} label="Favourites" iconClass="text-red-500" />
                <StatItem icon={LuWallet} value={stats.wallet != null ? `₹${stats.wallet}` : "—"} label="Wallet Balance" iconClass="text-orange-500" />
                <StatItem icon={FiPercent} value={stats.offers ?? "—"} label="Active Offers" iconClass="text-emerald-600" />
            </div>
        </section>
    );
};

export default ProfileSummary;