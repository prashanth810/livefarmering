import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiPlus, FiArrowRight } from "react-icons/fi";

const products = [
    {
        id: "tomatoes",
        vendor: "Sunrise Farms",
        name: "Fresh Organic Red Tomatoes",
        unit: "1 kg",
        price: 4.25,
        oldPrice: 5.0,
        image:
            "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80",
        badges: [
            { label: "15% OFF", color: "bg-red-500" },
            { label: "Organic", color: "bg-green-600" },
        ],
    },
    {
        id: "milk",
        vendor: "Valley Dairy",
        name: "Farm Fresh Whole Milk",
        unit: "1 Liter",
        price: 2.5,
        oldPrice: null,
        image:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
        badges: [{ label: "Farm Fresh", color: "bg-green-600" }],
    },
    {
        id: "avocados",
        vendor: "Green Valley Organics",
        name: "Premium Hass Avocados",
        unit: "Pack of 3",
        price: 6.99,
        oldPrice: null,
        image:
            "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80",
        badges: [],
    },
    {
        id: "sourdough",
        vendor: "Artisan Bakers",
        name: "Classic Sourdough Loaf",
        unit: "400 g",
        price: 4.5,
        oldPrice: 5.0,
        image:
            "https://images.unsplash.com/photo-1585478259715-4d3c5ee36e2c?auto=format&fit=crop&w=400&q=80",
        badges: [{ label: "10% OFF", color: "bg-red-500" }],
    },
];

const ProductCard = ({ product }) => {
    return (
        <div className="group relative flex flex-col overflow-hidden border border-emerald-400/20 bg-white shadow-sm transition-shadow hover:shadow-md hover:border-emerald-500/30 duration-500 cursor-pointer">
            {/* Image + badges + favorite */}
            <div className="relative bg-gray-50 p-6">
                {product.badges.length > 0 && (
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                        {product.badges.map((badge) => (
                            <span
                                key={badge.label}
                                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${badge.color}`}
                            >
                                {badge.label}
                            </span>
                        ))}
                    </div>
                )}
                <button
                    type="button"
                    aria-label="Add to favorites"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-red-500"
                >
                    <FiHeart className="h-4 w-4" />
                </button>
                <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-32 w-full object-contain sm:h-36"
                />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {product.vendor}
                </span>
                <h3 className="mt-1 text-sm font-bold text-gray-900 sm:text-base">
                    {product.name}
                </h3>
                <span className="mt-1 text-xs text-gray-500">{product.unit}</span>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-gray-900 sm:text-lg">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-1 bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                        <FiPlus className="h-3.5 w-3.5" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeaturedProducts = () => {
    return (
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            Featured Products
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 sm:text-base">
                            Handpicked fresh arrivals from our top-rated local vendors
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="flex shrink-0 items-center justify-center gap-2 self-start border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                    >
                        View All Products
                        <FiArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;