import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiChevronRight, FiEye, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { products } from "../../constants/products";
import { useWishlist } from "../../services/wishlist";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist } = useWishlist();

    return (
        <article className="flex min-w-0 flex-col overflow-hidden border border-gray-200 bg-white transition-shadow hover:shadow-md">
            <div className="relative flex h-44 items-center justify-center bg-gray-50 p-5">
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
                <span className="text-[10px] uppercase tracking-wide text-green-600">{product.vendor}</span>
                <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-gray-900">{product.name}</h2>
                <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                    <FiStar className="h-3 w-3 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400">({product.reviews})</span>
                </div>
                <span className="mt-1 text-xs text-gray-400">{product.unit}</span>
                <div className="mt-auto flex items-end justify-between gap-2 pt-4">
                    <div>
                        <strong className="block text-base text-gray-900">${product.price.toFixed(2)}</strong>
                        {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>}
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

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.trim() || "all products";
    const [sort, setSort] = useState("Popularity");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [minPrice, setMinPrice] = useState("0");
    const [maxPrice, setMaxPrice] = useState("50");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minimumRating, setMinimumRating] = useState(0);
    const [page, setPage] = useState(1);

    const categories = [
        { label: "Fresh Fruits", value: "Fruits & Vegetables" },
        { label: "Fresh Vegetables", value: "Fruits & Vegetables" },
        { label: "Vegetarian", value: "Vegetarian" },
        { label: "Non-Vegetarian", value: "Non-Vegetarian" },
        { label: "Dairy & Breakfast", value: "Dairy & Breakfast" },
        { label: "Bakery & Biscuits", value: "Bakery & Biscuits" },
        { label: "Meat & Seafood", value: "Meat & Seafood" },
    ].map((category) => ({
        ...category,
        count: products.filter((product) => product.category === category.value).length,
    }));

    const brands = [
        { label: "Green Valley Farms" },
        { label: "Organic Oasis" },
        { label: "Local Harvest" },
        { label: "Sunshine Orchards" },
        { label: "Fresh Meat Co." },
        { label: "Ocean Catch" },
    ];

    const getBrandCount = (brand) => products.filter((product) => product.vendor === brand).length;
    const displayCategory = selectedCategory === "All Categories"
        ? "Fruits & Vegetables"
        : selectedCategory;

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const toggleBrand = (brand) => {
        setSelectedBrands((current) =>
            current.includes(brand)
                ? current.filter((item) => item !== brand)
                : [...current, brand],
        );
        setPage(1);
    };

    const updatePrice = (setter, value) => {
        setter(value.replace(/[^0-9.]/g, ""));
        setPage(1);
    };

    const getResults = () => {
        const normalizedQuery = query.toLowerCase();
        const filtered = products.filter((product) => {
            const matchesQuery =
                selectedCategory !== "All Categories" ||
                query === "all products" ||
                `${product.name} ${product.vendor} ${product.category}`.toLowerCase().includes(normalizedQuery);
            const matchesCategory =
                selectedCategory === "All Categories" ||
                product.category === selectedCategory ||
                ((selectedCategory === "Fresh Fruits" || selectedCategory === "Fresh Vegetables") &&
                    product.category === "Fruits & Vegetables");
            const matchesPrice = product.price >= Number(minPrice || 0) && product.price <= Number(maxPrice || 50);
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.vendor);
            const matchesRating = product.rating >= minimumRating;
            return matchesQuery && matchesCategory && matchesPrice && matchesBrand && matchesRating;
        });

        if (sort === "Price: Low to High") return [...filtered].sort((a, b) => a.price - b.price);
        if (sort === "Price: High to Low") return [...filtered].sort((a, b) => b.price - a.price);
        return filtered;
    };

    const visibleProducts = getResults();

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[95%]">
                <div className="flex items-center gap-2 py-6 text-sm text-[var(--muted-foreground)]">
                    <Link to="/">Home</Link>
                    <FiChevronRight className="h-4 w-4" />
                    <Link to="/shop">{"Search"}</Link>
                    <FiChevronRight className="h-4 w-4" />
                    <span className="font-medium text-[var(--foreground)]">
                        {displayCategory}
                    </span>
                </div>

                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 sm:text-3xl">{displayCategory}</h1>
                        <p className="mt-2 text-sm text-gray-400"> Showing {visibleProducts.length} of {products.length} products</p>
                    </div>
                    <label className="flex items-center gap-2 self-start bg-white px-3 py-2 text-xs text-gray-500 shadow-sm sm:self-auto">
                        Sort by:
                        <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent font-semibold text-gray-700 outline-none">
                            <option>Popularity</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </label>
                </div>

                <div className="grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)]">
                    <aside className="hidden lg:block">
                        <h2 className="text-sm font-bold text-gray-900">Categories</h2>
                        <div className="mt-3 space-y-3 border-t border-gray-200 pt-4">
                            <button type="button" onClick={() => handleCategoryChange("All Categories")} className={`flex w-full items-center justify-between text-left text-xs ${selectedCategory === "All Categories" ? "font-semibold text-green-600" : "text-gray-500"}`}>
                                <span className="flex items-center gap-2"><input type="checkbox" checked={selectedCategory === "All Categories"} readOnly className="accent-emerald-600" />All Categories</span>
                                <span>({products.length})</span>
                            </button>
                            {categories.map((category) => (
                                <button key={category.label} type="button" onClick={() => handleCategoryChange(category.label)} className={`flex w-full items-center justify-between text-left text-xs cursor-pointer ${selectedCategory === category.label ? "font-semibold text-green-600" : "text-gray-500"}`}>
                                    <span className="flex items-center gap-2">
                                        <input type="checkbox" checked={selectedCategory === category.label} readOnly className="accent-emerald-600 cursor-pointer" />{category.label}</span>
                                    <span>({category.count})</span>
                                </button>
                            ))}
                        </div>
                        <h2 className="mt-8 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">Price Range</h2>
                        <div className="relative mt-7 h-1 bg-gray-200">
                            <span className="absolute inset-x-8 h-1 bg-emerald-500" />
                            <span className="absolute left-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white" />
                            <span className="absolute right-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-emerald-500 bg-white" />
                        </div>
                        <div className="mt-7 flex items-center justify-between gap-2 text-xs text-gray-500">
                            <label className="flex w-20 items-center rounded-sm bg-white px-2 py-2 shadow-sm">
                                <span>$</span>
                                <input type="number" min="0" max={maxPrice || 50} value={minPrice} onChange={(event) => updatePrice(setMinPrice, event.target.value)} className="w-full bg-transparent pl-1 text-center outline-none" aria-label="Minimum price" />
                            </label>
                            <span>-</span>
                            <label className="flex w-20 items-center rounded-sm bg-white px-2 py-2 shadow-sm">
                                <span>$</span>
                                <input type="number" min={minPrice || 0} value={maxPrice} onChange={(event) => updatePrice(setMaxPrice, event.target.value)} className="w-full bg-transparent pl-1 text-center outline-none" aria-label="Maximum price" />
                            </label>
                        </div>
                        <h2 className="mt-8 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">Brands</h2>
                        <div className="mt-4 space-y-3 text-xs text-gray-500">
                            {brands.map((brand) => (
                                <label key={brand.label} className="flex gap-2 cursor-pointer">
                                    <input type="checkbox" checked={selectedBrands.includes(brand.label)} onChange={() => toggleBrand(brand.label)} className="accent-emerald-600 cursor-pointer" />
                                    {brand.label} <span className="ml-auto">({getBrandCount(brand.label)})</span>
                                </label>
                            ))}
                        </div>
                        <h2 className="mt-8 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">Rating</h2>
                        <div className="mt-4 space-y-3 text-xs text-amber-500">
                            {[5, 4, 3].map((rating) => (
                                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={minimumRating === rating} onChange={() => setMinimumRating((current) => current === rating ? 0 : rating)} className="accent-emerald-600 cursor-pointer" />
                                    <span>☆ ☆ ☆ ☆ ☆</span><span className="ml-auto text-gray-400">{rating === 5 ? "5.0" : "& Up"}</span>
                                </label>
                            ))}
                        </div>
                    </aside>

                    <section>
                        <details className="mb-4 overflow-hidden border border-gray-200 bg-white lg:hidden">
                            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800">
                                Filters
                                <span className="text-xs font-normal text-gray-400">{selectedCategory !== "All Categories" || selectedBrands.length > 0 || minimumRating > 0 ? "Active" : "All products"}</span>
                            </summary>
                            <div className="space-y-5 border-t border-gray-100 px-4 py-4">
                                <label className="block text-xs font-semibold text-gray-700">
                                    Category
                                    <select value={selectedCategory} onChange={(event) => handleCategoryChange(event.target.value)} className="mt-2 w-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-normal text-gray-700 outline-none">
                                        <option>All Categories</option>
                                        {categories.map((category) => <option key={category.label}>{category.label}</option>)}
                                    </select>
                                </label>
                                <div>
                                    <h2 className="text-xs font-semibold text-gray-700">Price Range</h2>
                                    <div className="mt-2 grid grid-cols-2 gap-3">
                                        <label className="flex items-center border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-500">
                                            $<input type="number" min="0" max={maxPrice || 50} value={minPrice} onChange={(event) => updatePrice(setMinPrice, event.target.value)} className="w-full bg-transparent pl-1 outline-none" aria-label="Minimum price" />
                                        </label>
                                        <label className="flex items-center border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-500">
                                            $<input type="number" min={minPrice || 0} value={maxPrice} onChange={(event) => updatePrice(setMaxPrice, event.target.value)} className="w-full bg-transparent pl-1 outline-none" aria-label="Maximum price" />
                                        </label>
                                    </div>
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
                                                <input type="checkbox" checked={minimumRating === rating} onChange={() => setMinimumRating((current) => current === rating ? 0 : rating)} className="accent-emerald-600" />
                                                {rating}+ stars
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                <button type="button" onClick={() => { handleCategoryChange("All Categories"); setMinPrice("0"); setMaxPrice("50"); setSelectedBrands([]); setMinimumRating(0); }} className="text-xs font-semibold text-green-700 hover:text-green-800">
                                    Clear all filters
                                </button>
                            </div>
                        </details>
                        <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
                            <button type="button" onClick={() => handleCategoryChange("All Categories")} className="whitespace-nowrap bg-white px-3 py-2 text-xs text-gray-600 shadow-sm">
                                All Categories
                            </button>
                            {categories.map((category) => (
                                <button key={category.label} type="button" onClick={() => handleCategoryChange(category.label)} className="whitespace-nowrap bg-white px-3 py-2 text-xs text-gray-600 shadow-sm">
                                    {category.label} ({category.count})
                                </button>
                            ))}
                        </div>
                        {visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                                {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                            </div>
                        ) : (
                            <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm text-gray-500">
                                No products match the selected filters.
                            </div>
                        )}
                        <div className="mt-8 flex items-center justify-center gap-2 text-xs">
                            <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="bg-white px-3 py-2 text-gray-500 disabled:opacity-40">Previous</button>
                            {[1, 2, 3].map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`h-8 w-8 ${page === number ? "bg-emerald-600 text-white" : "bg-white text-gray-600"}`}>{number}</button>)}
                            <span className="px-1 text-gray-400">...</span>
                            <button type="button" onClick={() => setPage(12)} className={`h-8 w-8 ${page === 12 ? "bg-emerald-600 text-white" : "bg-white text-gray-600"}`}>12</button>
                            <button type="button" onClick={() => setPage((current) => Math.min(12, current + 1))} className="bg-white px-3 py-2 text-gray-500">Next</button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default SearchResults;
