import { Link } from "react-router-dom";

const OffersBanner = () => (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-100 px-6 py-7 sm:px-8">
        <div className="relative z-10 max-w-md">
            <h2 className="text-xl font-bold text-gray-900">Get Special Offers &amp; Discounts</h2>
            <p className="mt-1 text-sm text-gray-600">
                Be the first to know about new products, offers and exclusive deals.
            </p>
            <Link
                to="/shop"
                className="mt-4 inline-block rounded-md bg-amber-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-900 sm:hidden"
            >
                Shop Now
            </Link>
        </div>
        <div className="absolute inset-y-0 right-6 hidden items-center gap-6 sm:flex">
            <span aria-hidden="true" className="select-none text-6xl">🛍️🥖🍅</span>
            <Link
                to="/shop"
                onClick={() => window.screenTop(0, 0)}
                className="rounded-md bg-amber-800 px-8 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
            >
                Shop Now
            </Link>
        </div>
    </section>
);

export default OffersBanner;