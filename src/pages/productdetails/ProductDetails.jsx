import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FiShoppingCart,
    FiChevronRight,
    FiMinus,
    FiPlus,
    FiHeart,
    FiCheckCircle,
    FiTruck,
    FiRefreshCw,
    FiStar,
} from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { PiStorefrontLight } from "react-icons/pi";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { products } from "../../constants/products";
import { nutritionRows, ratingBars, reviews, themeVars, thumbnails } from "../../constants/Styles";
import { FaArrowCircleRight, FaArrowRight } from "react-icons/fa";


const tabs = [
    { id: "description", label: "Description & Nutrition" },
    { id: "reviews", label: "Reviews (124)" },
    { id: "vendor", label: "Vendor Profile" },
];

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                               */
/* ------------------------------------------------------------------ */
const StarRating = ({ rating, size = 16 }) => (
    <div className="flex gap-1 text-[var(--warning)]">
        {[0, 1, 2, 3, 4].map((i) => {
            const fillPercent = Math.min(Math.max(rating - i, 0), 1) * 100;
            return (
                <span
                    key={i}
                    className="relative inline-block"
                    style={{ width: size, height: size }}
                >
                    <FiStar
                        className="absolute inset-0 text-[var(--muted-foreground)]"
                        style={{ width: size, height: size }}
                    />
                    <span
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `₹{fillPercent}%` }}
                    >
                        <FiStar
                            className="fill-current text-[var(--warning)]"
                            style={{ width: size, height: size }}
                        />
                    </span>
                </span>
            );
        })}
    </div>
);

const IconCircle = ({ children, size = 24 }) => (
    <div
        className="flex shrink-0 items-center justify-center"
        style={{ width: size, height: size }}
    >
        {children}
    </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
const ProductDetails = () => {
    const { productId } = useParams();
    const product = products.find((item) => item.id === productId) || {
        id: "demo-product",
        vendor: "Green Valley Farms",
        name: "Premium Organic Hass Avocados",
        category: "Fruits & Vegetables",
        unit: "500 g",
        price: 6.99,
        oldPrice: 8.99,
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85",
        badge: "Bestseller",
    };
    const [activeThumb, setActiveThumb] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [wishlisted, setWishlisted] = useState(false);

    // Pull in the Inter font used by the design.
    useEffect(() => {
        const id = "pdp-inter-font";
        if (document.getElementById(id)) return;
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
        document.head.appendChild(link);
    }, []);

    return (
        <div
            style={themeVars}
            className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">

            <main className="mx-auto max-w-[95%] px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 py-6 text-sm text-[var(--muted-foreground)]">
                    <Link to="/">Home</Link>
                    <FiChevronRight className="h-4 w-4" />
                    <Link to="/shop">{product.category}</Link>
                    <FiChevronRight className="h-4 w-4" />
                    <span className="font-medium text-[var(--foreground)]">
                        {product.name}
                    </span>
                </div>

                {/* Main grid */}
                <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-10">
                            <div className="absolute left-6 top-6 z-10 flex flex-col gap-2">
                                <span className="bg-[var(--success)] px-3 py-1 text-sm font-bold text-[var(--success-foreground)]">
                                    Organic
                                </span>
                                <span className="bg-[var(--accent)] px-3 py-1 text-sm font-bold text-[var(--accent-foreground)]">
                                    Bestseller
                                </span>
                            </div>
                            <img
                                alt={product.name}
                                src={activeThumb === 0 ? product.image : thumbnails[activeThumb].src}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {thumbnails.map((thumb, index) => (
                                <button
                                    key={thumb.alt}
                                    type="button"
                                    onClick={() => setActiveThumb(index)}
                                    className={`flex w-30 h-30 aspect-square items-center justify-center border bg-[#f3f4f6] p-3 transition-shadow cursor-pointer ${activeThumb === index
                                        ? "border-[#FF6900]"
                                        : "border-[#cccccd]"
                                        }`}
                                >
                                    <img
                                        src={thumb.src}
                                        alt={thumb.alt}
                                        className="h-full w-full bg-[#f3f4f6] object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="flex flex-col">
                        <button
                            type="button"
                            className="mb-4 inline-flex w-fit items-center gap-2 bg-[var(--secondary)] px-3 py-1.5 text-[13px] font-semibold text-[var(--secondary-foreground)] outline-none"
                        >
                            <PiStorefrontLight className="h-4 w-4" />
                            {product.vendor}
                        </button>

                        <h1 className="mb-3 text-[28px] font-bold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl">
                            {product.name}
                        </h1>

                        <div className="mb-6 flex items-center gap-3">
                            <StarRating rating={product.rating} />
                            <button
                                type="button"
                                className="text-sm text-[var(--muted-foreground)] underline"
                            >
                                {product.rating} ({product.reviews} reviews)
                            </button>
                        </div>

                        <div className="mb-6 flex items-end gap-4 border-b border-[var(--border)] pb-6">
                            <div className="flex flex-col">
                                {product.oldPrice && <span className="text-xl font-medium text-[var(--muted-foreground)] line-through">
                                    ₹{product.oldPrice.toFixed(2)}
                                </span>}
                                <span className="text-4xl font-extrabold leading-none text-[var(--foreground)]">
                                    ₹{product.price.toFixed(2)}
                                </span>
                            </div>
                            {product.oldPrice && <span className="mb-0.5 bg-[var(--destructive)] px-2.5 py-1 text-sm font-bold text-[var(--destructive-foreground)]">
                                Save {Math.round((1 - product.price / product.oldPrice) * 100)}%
                            </span>}
                        </div>

                        <p className="mb-8 text-base leading-relaxed text-[var(--muted-foreground)]">
                            Freshly selected from trusted vendors, {product.name} is packed,
                            handled with care, and delivered ready for your everyday meals.
                        </p>

                        {/* Quantity + actions */}
                        <div className="mb-6">
                            <span className="mb-3 block text-sm font-semibold text-[var(--foreground)]">
                                Quantity ({product.unit})
                            </span>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex h-12 items-center bg-[#efeeee] border border-[var(--border)] p-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) => Math.max(1, q - 1))
                                        }
                                        aria-label="Decrease quantity"
                                        className="flex h-full w-10 items-center justify-center text-[var(--muted-foreground)] bg-white text-[#FF6900] cursor-pointer hover:bg-[#FF690075] hover:text-[#fff] duration-500">
                                        <FiMinus className="h-5 w-5" />
                                    </button>
                                    <span className="flex w-12 items-center justify-center text-base font-semibold text-[var(--foreground)]">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => q + 1)}
                                        aria-label="Increase quantity"
                                        className="flex h-full w-10 items-center justify-center text-[var(--muted-foreground)] bg-white text-[#059669] cursor-pointer hover:bg-[#05966875] hover:text-[#fff] duration-500"
                                    >
                                        <FiPlus className="h-5 w-5" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-6 text-base font-semibold text-[var(--primary-foreground)]"
                                >
                                    <FiShoppingCart className="h-5 w-5" />
                                    Add to Cart
                                </button>

                                <button
                                    type="button"
                                    className="flex h-12 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-6 text-base font-semibold text-[var(--accent-foreground)]"
                                >
                                    Buy Now
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setWishlisted((w) => !w)}
                                    aria-label="Add to wishlist"
                                    className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                                >
                                    <FiHeart
                                        className={`h-5 w-5 ₹{wishlisted
                                            ? "fill-[var(--destructive)] text-[var(--destructive)]"
                                            : ""
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input)] p-6">
                            <div className="flex items-center gap-3 text-[15px] text-[var(--foreground)]">
                                <IconCircle size={20}>
                                    <FiCheckCircle className="h-5 w-5 text-[var(--success)]" />
                                </IconCircle>
                                <span className="font-semibold text-[var(--success)]">
                                    In Stock (45 packs available)
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[15px] text-[var(--foreground)]">
                                <IconCircle size={20}>
                                    <FiTruck className="h-5 w-5 text-[var(--muted-foreground)]" />
                                </IconCircle>
                                <span>Free delivery on orders over ₹50</span>
                            </div>
                            <div className="flex items-center gap-3 text-[15px] text-[var(--foreground)]">
                                <IconCircle size={20}>
                                    <FiRefreshCw className="h-5 w-5 text-[var(--muted-foreground)]" />
                                </IconCircle>
                                <span>Easy 3-day freshness return guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-16 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]">
                    <div className="flex overflow-x-auto border-b border-[var(--border)] bg-[var(--input)]">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 whitespace-nowrap border-b border-gray-400 px-6 py-5 text-base font-semibold transition-colors sm:px-8 ₹{activeTab === tab.id
                                    ? "border-[var(--primary)] bg-[var(--card)] text-[var(--primary)]"
                                    : "border-transparent text-[var(--muted-foreground)]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 sm:p-10">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
                            {/* Description */}
                            <div>
                                <h3 className="mb-4 text-xl font-bold text-[var(--foreground)]">
                                    About this product
                                </h3>
                                <p className="mb-6 text-base leading-relaxed text-[var(--muted-foreground)]">
                                    Our premium Hass avocados are grown organically without the
                                    use of synthetic pesticides or fertilizers. They are
                                    characterized by their bumpy, dark green to purplish-black
                                    skin when ripe, and their incredibly creamy, rich pale green
                                    flesh.
                                </p>
                                <p className="mb-6 text-base leading-relaxed text-[var(--muted-foreground)]">
                                    Known as a superfood, avocados are an excellent source of
                                    heart-healthy monounsaturated fats, dietary fiber, and
                                    various essential vitamins and minerals, including
                                    potassium, vitamin K, vitamin E, and B vitamins.
                                </p>

                                <h4 className="mb-3 text-base font-bold text-[var(--foreground)]">
                                    Storage Instructions
                                </h4>
                                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                                    <li>
                                        Store unripe avocados at room temperature until they feel
                                        slightly soft to gentle pressure.
                                    </li>
                                    <li>
                                        Once ripe, store in the refrigerator to slow down further
                                        ripening for up to 3-5 days.
                                    </li>
                                    <li>
                                        To accelerate ripening, place in a brown paper bag with an
                                        apple or banana.
                                    </li>
                                </ul>
                            </div>

                            {/* Nutrition */}
                            <div>
                                <div className="max-w-[400px] rounded-[var(--radius-md)] border border-[var(--border)] p-6">
                                    <h3 className="mb-4 border-b-1 border-[#FF6900] pb-2 text-xl font-semibold">
                                        Nutrition Facts
                                    </h3>
                                    <div className="mb-4 text-sm">
                                        Serving size: 1/3 medium avocado (50g)
                                    </div>
                                    <div className="mb-4 border-b-1 border-[#FF6900] bg-[#FF6900]" />

                                    {nutritionRows.map((row) => (
                                        <div
                                            key={row.label}
                                            className={`flex justify-between border-b border-[var(--border)] py-3 text-[15px] ₹{row.bold ? "font-bold border-b-2" : ""}`}>
                                            <span className={row.indent ? "pl-4" : ""}>
                                                {row.label}
                                            </span>
                                            <span>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="my-16 h-px bg-[var(--border)]" />

                        {/* Reviews */}
                        <div>
                            <h3 className="mb-8 text-2xl font-extrabold text-[var(--foreground)]">
                                Customer Reviews
                            </h3>

                            <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-center">
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-6xl font-extrabold leading-none text-[var(--foreground)]">
                                        4.8
                                    </span>
                                    <div className="my-2">
                                        <StarRating rating={4.8} size={20} />
                                    </div>
                                    <span className="text-sm text-[var(--muted-foreground)]">
                                        Based on 124 reviews
                                    </span>
                                </div>

                                <div className="flex w-full max-w-[400px] flex-col gap-3">
                                    {ratingBars.map((bar) => (
                                        <div
                                            key={bar.label}
                                            className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]"
                                        >
                                            <span className="w-14 shrink-0">{bar.label}</span>
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--input)]">
                                                <div
                                                    className="h-full rounded-full bg-[var(--warning)]"
                                                    style={{ width: `₹{bar.percent}%` }}
                                                />
                                            </div>
                                            <span className="w-8 shrink-0 text-right">
                                                {bar.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-3 text-[15px] font-semibold text-[var(--foreground)] md:ml-auto"
                                >
                                    Write a Review
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.name}
                                        className="rounded-[var(--radius-md)] border border-[var(--border)] p-6"
                                    >
                                        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={review.avatar}
                                                    alt={review.name}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="font-bold text-[var(--foreground)]">
                                                        {review.name}
                                                    </div>
                                                    <div className="mt-1">
                                                        <StarRating rating={review.rating} size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-[13px] text-[var(--muted-foreground)]">
                                                {review.date}
                                            </div>
                                        </div>
                                        <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                                            {review.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 border border-[#f2a46c] px-6 py-3 text-sm font-semibold text-[#e87c30] transition duration-300 hover:border-[#FF6900] cursor-pointer" >
                                    Load More Reviews
                                    <FaArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-[var(--border)] bg-[var(--card)] px-6 pb-8 pt-20 md:px-12" />
        </div>
    );
};

export default ProductDetails;