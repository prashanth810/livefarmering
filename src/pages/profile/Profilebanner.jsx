const ProfileBanner = ({ name }) => (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 px-6 py-8 sm:px-8">
        <div className="relative z-10">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Hello, {name}! <span aria-hidden="true">👋</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">Manage your account, orders and more.</p>
        </div>
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 select-none gap-1 text-6xl sm:flex sm:text-7xl"
        >
            <span>🥬</span>
            <span>🍅</span>
            <span>🥕</span>
            <span>🥦</span>
            <span>🧺</span>
        </div>
    </section>
);

export default ProfileBanner;