import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiChevronRight, FiEye, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useWishlist } from "../../services/wishlist";
import {
    getallcategories,
    handlegetproductsbycategory,
    setSelectedCategory,
} from "../../redux/Slices/ProductSlice";
import Productloader from "../../reusables/Productloader";

/* ---------------- normalize api product ---------------- */
const normalizeProduct = (product) => {
    const variant = product.variants?.[0] || {};
    return {
        id: product._id,
        name: product.name || "Unnamed product",
        vendor: product.createdby?.name || "Local vendor",
        unit: variant.weight || "",
        image: product.thumbnail || product.images?.[0] || "",
        price: Number(variant.selling_price) || 0,
        oldPrice: Number(variant.original_price) || null,
        rating: Number(product.rating) || 0,
        reviews: product.reviews?.length || 0,
        badge: variant.discount_price ? "DISCOUNT" : null,
        categoryId: product.category?._id || product.category || null,
    };
};

/* ---------------- product card ---------------- */
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist } = useWishlist();

    return (
        <article className="flex min-w-0 flex-col overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md">
            <div className="relative flex h-36 items-center justify-center bg-gray-50 p-4 sm:h-44 sm:p-5">
                {product.badge && (
                    <span className="absolute left-3 top-3 bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                        {product.badge}
                    </span>
                )}
                <button
                    type="button"
                    aria-label={`Preview ${product.name}`}
                    onClick={() => navigate(`/product-details/${product.id}`)}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-green-600 cursor-pointer"
                >
                    <FiEye className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    aria-label={`${isWishlisted(product.id) ? "Remove" : "Add"} ${product.name} ${isWishlisted(product.id) ? "from" : "to"} wishlist`}
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-12 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-red-500 cursor-pointer"
                >
                    <FiHeart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
            </div>

            <div className="flex flex-1 flex-col p-3">
                <span className="truncate text-[10px] uppercase tracking-wide text-green-600">{product.vendor}</span>
                <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-gray-900">{product.name}</h2>
                <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                    <FiStar className="h-3 w-3 fill-current" />
                    <span>{product.rating || "0.0"}</span>
                    <span className="text-gray-400">({product.reviews})</span>
                </div>
                <span className="mt-1 text-xs text-gray-400">{product.unit}</span>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
                    <div>
                        <strong className="block text-base text-gray-900">${product.price.toFixed(2)}</strong>
                        {product.oldPrice ? (
                            <span className="text-xs text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                        ) : null}
                    </div>
                    <button type="button" className="flex items-center gap-1 bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 cursor-pointer">
                        <FiShoppingCart className="h-3.5 w-3.5" />
                        Add
                    </button>
                </div>
            </div>
        </article>
    );
};

const PriceRangeFilter = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
    const minValue = Math.max(0, Math.min(Number(minPrice) || 0, 500));
    const maxValue = Math.max(minValue, Math.min(Number(maxPrice) || 0, 500));
    const minPercent = (minValue / 500) * 100;
    const maxPercent = (maxValue / 500) * 100;

    const sanitizePrice = (value) => value.replace(/[^0-9]/g, "");

    return (
        <div className="mt-5">
            <div className="relative h-5">
                <div
                    className="absolute top-2 h-1 w-full rounded bg-gray-200"
                    style={{
                        background: `linear-gradient(to right, #e5e7eb ${minPercent}%, #059669 ${minPercent}%, #059669 ${maxPercent}%, #e5e7eb ${maxPercent}%)`,
                    }}
                />
                <input
                    type="range"
                    min="0"
                    max="500"
                    value={minValue}
                    onChange={(event) => onMinChange(String(Math.min(Number(event.target.value), maxValue)))}
                    className="pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent accent-emerald-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-600"
                    aria-label="Minimum price slider"
                />
                <input
                    type="range"
                    min="0"
                    max="500"
                    value={maxValue}
                    onChange={(event) => onMaxChange(String(Math.max(Number(event.target.value), minValue)))}
                    className="pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent accent-emerald-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-emerald-600"
                    aria-label="Maximum price slider"
                />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-500">
                <label className="flex w-20 items-center rounded-sm bg-white px-2 py-2 shadow-sm">
                    <span>$</span>
                    <input
                        type="number"
                        min="0"
                        max={maxValue}
                        value={minPrice}
                        onChange={(event) => onMinChange(sanitizePrice(event.target.value))}
                        className="w-full bg-transparent pl-1 text-center outline-none"
                        aria-label="Minimum price"
                    />
                </label>
                <span>-</span>
                <label className="flex w-20 items-center rounded-sm bg-white px-2 py-2 shadow-sm">
                    <span>$</span>
                    <input
                        type="number"
                        min={minValue}
                        max="500"
                        value={maxPrice}
                        onChange={(event) => onMaxChange(sanitizePrice(event.target.value))}
                        className="w-full bg-transparent pl-1 text-center outline-none"
                        aria-label="Maximum price"
                    />
                </label>
            </div>
        </div>
    );
};

/* ---------------- page ---------------- */
const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.trim() || "";

    const dispatch = useDispatch();
    const { categorydata, categoryloading } = useSelector((state) => state.product.category);
    const { productdata, productloading, producterror } = useSelector((state) => state.product.products);
    const selectedCategoryId = useSelector((state) => state.product.selectedCategoryId);

    const [sort, setSort] = useState("Popularity");
    const [minPrice, setMinPrice] = useState("0");
    const [maxPrice, setMaxPrice] = useState("500");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minimumRating, setMinimumRating] = useState(0);
    const [page, setPage] = useState(1);

    /* load categories once */
    useEffect(() => {
        if (categorydata.length === 0) dispatch(getallcategories());
    }, [categorydata.length, dispatch]);

    /* default to first category if nothing selected */
    useEffect(() => {
        if (!selectedCategoryId && categorydata.length > 0) {
            dispatch(setSelectedCategory(categorydata[0]._id));
        }
    }, [categorydata, selectedCategoryId, dispatch]);

    /* fetch products whenever the category changes */
    useEffect(() => {
        if (selectedCategoryId) {
            dispatch(handlegetproductsbycategory(selectedCategoryId));
            setPage(1);
        }
    }, [selectedCategoryId, dispatch]);

    const allProducts = useMemo(
        () => (Array.isArray(productdata) ? productdata.map(normalizeProduct) : []),
        [productdata],
    );

    /* brands from the current category products */
    const brands = useMemo(() => {
        const map = {};
        allProducts.forEach((p) => {
            map[p.vendor] = (map[p.vendor] || 0) + 1;
        });
        return Object.entries(map).map(([label, count]) => ({ label, count }));
    }, [allProducts]);

    const activeCategory = categorydata.find((c) => c._id === selectedCategoryId);
    const displayCategory = activeCategory?.name || "All Products";

    const handleCategoryChange = (id) => {
        dispatch(setSelectedCategory(id));
    };

    const toggleBrand = (brand) => {
        setSelectedBrands((current) =>
            current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand],
        );
        setPage(1);
    };

    const updatePrice = (setter, value) => {
        setter(value.replace(/[^0-9.]/g, ""));
        setPage(1);
    };

    const clearFilters = () => {
        setMinPrice("0");
        setMaxPrice("500");
        setSelectedBrands([]);
        setMinimumRating(0);
        setPage(1);
    };

    /* filters + sort applied on category products */
    const visibleProducts = useMemo(() => {
        const q = query.toLowerCase();
        const filtered = allProducts.filter((product) => {
            const matchesQuery = !q || `${product.name} ${product.vendor}`.toLowerCase().includes(q);
            const matchesPrice =
                product.price >= Number(minPrice || 0) && product.price <= Number(maxPrice || 999999);
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.vendor);
            const matchesRating = product.rating >= minimumRating;
            return matchesQuery && matchesPrice && matchesBrand && matchesRating;
        });

        if (sort === "Price: Low to High") return [...filtered].sort((a, b) => a.price - b.price);
        if (sort === "Price: High to Low") return [...filtered].sort((a, b) => b.price - a.price);
        return filtered;
    }, [allProducts, query, minPrice, maxPrice, selectedBrands, minimumRating, sort]);

    const hasActiveFilters = selectedBrands.length > 0 || minimumRating > 0;

    return (
        <main className="min-h-screen bg-gray-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto w-full max-w-[95%]">
                {/* breadcrumb */}
                <div className="flex flex-wrap items-center gap-2 py-4 text-xs text-gray-500 sm:py-6 sm:text-sm">
                    <Link to="/">Home</Link>
                    <FiChevronRight className="h-4 w-4" />
                    <Link to="/shop">Search</Link>
                    {/* <FiChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-800">{displayCategory}</span> */}
                </div>

                {/* heading + sort */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 sm:text-2xl lg:text-3xl">{displayCategory}</h1>
                        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                            Showing {visibleProducts.length} of {allProducts.length} products
                        </p>
                    </div>
                    <label className="flex items-center gap-2 self-start bg-white px-3 py-2 text-xs text-gray-500 shadow-sm sm:self-auto">
                        Sort by:
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                            className="bg-transparent font-semibold text-gray-700 outline-none"
                        >
                            <option>Popularity</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </label>
                </div>

                <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
                    {/* ---------- desktop sidebar ---------- */}
                    <aside className="hidden lg:block">
                        <h2 className="text-sm font-bold text-gray-900">Categories</h2>
                        <div className="mt-3 space-y-3 border-t border-gray-200 pt-4">
                            {categoryloading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div className="flex items-center gap-3" key={i}>
                                        <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
                                        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                                    </div>
                                ))
                            ) : (
                                categorydata.map((category) => (
                                    <button
                                        key={category._id}
                                        type="button"
                                        onClick={() => handleCategoryChange(category._id)}
                                        className={`flex w-full items-center gap-2 text-left text-xs cursor-pointer ${selectedCategoryId === category._id ? "font-semibold text-green-600" : "text-gray-500"}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategoryId === category._id}
                                            readOnly
                                            className="accent-emerald-600 cursor-pointer"
                                        />
                                        <span className="truncate">{category.name}</span>
                                    </button>
                                ))
                            )}
                        </div>

                        <h2 className="mt-8 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">Price Range</h2>
                        <PriceRangeFilter
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onMinChange={(value) => updatePrice(setMinPrice, value)}
                            onMaxChange={(value) => updatePrice(setMaxPrice, value)}
                        />

                        <h2 className="mt-8 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">Brands</h2>
                        <div className="mt-4 space-y-3 text-xs text-gray-500">
                            {brands.length === 0 ? (
                                <p className="text-gray-400">No brands</p>
                            ) : (
                                brands.map((brand) => (
                                    <label key={brand.label} className="flex gap-2 cursor-pointer">
                                        <input type="checkbox" checked={selectedBrands.includes(brand.label)} onChange={() => toggleBrand(brand.label)} className="accent-emerald-600 cursor-pointer" />
                                        <span className="truncate">{brand.label}</span>
                                        <span className="ml-auto">({brand.count})</span>
                                    </label>
                                ))
                            )}
                        </div>

                        <h2 className="mt-8 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">Rating</h2>
                        <div className="mt-4 space-y-3 text-xs text-amber-500">
                            {[5, 4, 3].map((rating) => (
                                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={minimumRating === rating} onChange={() => setMinimumRating((c) => (c === rating ? 0 : rating))} className="accent-emerald-600 cursor-pointer" />
                                    <span>{rating}+ stars</span>
                                </label>
                            ))}
                        </div>

                        {hasActiveFilters && (
                            <button type="button" onClick={clearFilters} className="mt-6 text-xs font-semibold text-green-700 hover:text-green-800">
                                Clear all filters
                            </button>
                        )}
                    </aside>

                    {/* ---------- results ---------- */}
                    <section className="min-w-0">
                        {/* mobile filters */}
                        <details className="mb-4 overflow-hidden border border-gray-200 bg-white lg:hidden">
                            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800">
                                Filters
                                <span className="text-xs font-normal text-gray-400">{hasActiveFilters ? "Active" : "All products"}</span>
                            </summary>
                            <div className="space-y-5 border-t border-gray-100 px-4 py-4">
                                <label className="block text-xs font-semibold text-gray-700">
                                    Category
                                    <select
                                        value={selectedCategoryId || ""}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="mt-2 w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-700 outline-none"
                                    >
                                        {categorydata.map((category) => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                </label>

                                <div>
                                    <h2 className="text-xs font-semibold text-gray-700">Price Range</h2>
                                    <PriceRangeFilter
                                        minPrice={minPrice}
                                        maxPrice={maxPrice}
                                        onMinChange={(value) => updatePrice(setMinPrice, value)}
                                        onMaxChange={(value) => updatePrice(setMaxPrice, value)}
                                    />
                                </div>

                                <fieldset>
                                    <legend className="text-xs font-semibold text-gray-700">Brands</legend>
                                    <div className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                                        {brands.map((brand) => (
                                            <label key={brand.label} className="flex items-center gap-2 text-xs text-gray-600">
                                                <input type="checkbox" checked={selectedBrands.includes(brand.label)} onChange={() => toggleBrand(brand.label)} className="accent-emerald-600" />
                                                <span className="truncate">{brand.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <fieldset>
                                    <legend className="text-xs font-semibold text-gray-700">Rating</legend>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        {[5, 4, 3].map((rating) => (
                                            <label key={rating} className="flex items-center gap-1 text-xs text-amber-500">
                                                <input type="checkbox" checked={minimumRating === rating} onChange={() => setMinimumRating((c) => (c === rating ? 0 : rating))} className="accent-emerald-600" />
                                                {rating}+ stars
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <button type="button" onClick={clearFilters} className="text-xs font-semibold text-green-700 hover:text-green-800">
                                    Clear all filters
                                </button>
                            </div>
                        </details>

                        {/* mobile category chips */}
                        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar lg:hidden">
                            {categorydata.map((category) => (
                                <button
                                    key={category._id}
                                    type="button"
                                    onClick={() => handleCategoryChange(category._id)}
                                    className={`whitespace-nowrap px-3 py-2 text-xs shadow-sm ${selectedCategoryId === category._id ? "bg-emerald-600 text-white" : "bg-white text-gray-600"}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* grid / loader / empty */}
                        {productloading ? (
                            <Productloader count={8} />
                        ) : producterror ? (
                            <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-500">
                                Something went wrong. Please try again.
                            </div>
                        ) : visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                                {visibleProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-500">
                                No products match the selected filters.
                            </div>
                        )}

                        {/* pagination */}
                        {!productloading && visibleProducts.length > 0 && (
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
                                <button type="button" disabled={page === 1} onClick={() => setPage((c) => Math.max(1, c - 1))} className="bg-white px-3 py-2 text-gray-500 disabled:opacity-40">Previous</button>
                                {[1, 2, 3].map((n) => (
                                    <button key={n} type="button" onClick={() => setPage(n)} className={`h-8 w-8 ${page === n ? "bg-emerald-600 text-white" : "bg-white text-gray-600"}`}>{n}</button>
                                ))}
                                <button type="button" onClick={() => setPage((c) => c + 1)} className="bg-white px-3 py-2 text-gray-500">Next</button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default SearchResults;