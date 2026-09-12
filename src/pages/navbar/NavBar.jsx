import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FiSearch,
    FiShoppingCart,
    FiUser,
    FiMenu,
    FiX,
    FiChevronDown,
    FiTag,
} from "react-icons/fi";
import { PiStorefrontLight } from "react-icons/pi";
import { LuLeaf } from "react-icons/lu";
import { MdOutlineGridView } from "react-icons/md";
import { getSearchSuggestions } from "../../constants/products";

const categories = [
    { label: "All Categories", href: "/categories", hasIcon: true },
    { label: "Fruits & Vegetables", href: "/category/fruits-vegetables" },
    { label: "Dairy & Breakfast", href: "/category/dairy-breakfast" },
    { label: "Meat & Seafood", href: "/category/meat-seafood" },
    { label: "Bakery & Biscuits", href: "/category/bakery-biscuits" },
    { label: "Snacks & Branded Foods", href: "/category/snacks-branded-foods" },
    { label: "Beverages", href: "/category/beverages" },
];

const SearchField = ({ value, onChange, onSubmit, onSearchComplete, mobile = false }) => {
    const navigate = useNavigate();
    const suggestions = getSearchSuggestions(value);
    const showSuggestions = value.trim().length > 0;

    const openResults = (query = value) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            onSearchComplete();
            navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit(event);
                openResults();
            }}
            className={`relative flex items-center overflow-visible border border-gray-300 bg-white ${mobile ? "mx-4 mb-3 rounded-full md:hidden" : "mx-auto hidden max-w-xl flex-1 md:flex"}`}
        >
            <FiSearch className="ml-4 h-4 w-4 shrink-0 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={mobile ? "Search groceries..." : "Search for groceries, vegetables, meat..."}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                aria-label="Search products"
            />
            {!mobile && (
                <button
                    type="submit"
                    className="shrink-0 bg-green-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                    Search
                </button>
            )}

            {showSuggestions && (
                <div className="absolute left-0 right-0 top-full z-[60] mt-1 overflow-hidden border border-gray-200 bg-white shadow-xl">
                    {suggestions.length > 0 ? (
                        suggestions.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => openResults(product.name)}
                                className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-green-50 cursor-pointer"
                            >
                                <img
                                    src={product.image}
                                    alt=""
                                    className="h-11 w-11 rounded-md bg-gray-50 object-contain"
                                />
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-gray-800">
                                        {product.name}
                                    </span>
                                    <span className="block text-xs text-gray-400">
                                        {product.category}
                                    </span>
                                </span>
                            </button>
                        ))
                    ) : (
                        <button
                            type="button"
                            onClick={() => openResults()}
                            className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm text-gray-600 hover:bg-green-50"
                        >
                            <FiSearch className="h-4 w-4 text-gray-400" />
                            Search all products for <strong className="text-gray-900">{value}</strong>
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

const NavBar = ({ cartTotal = "24.50" }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleSearchSubmit = () => { };
    const handleSearchComplete = () => setSearchValue("");

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
            {/* Announcement bar */}
            <div className="bg-orange-500 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
                Free delivery on all orders over $50! Shop now.
            </div>

            {/* Main nav */}
            <div className="mx-auto flex max-w-[95%] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex shrink-0 items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
                        <LuLeaf className="h-5 w-5" />
                    </span>
                    <span className="hidden text-lg font-bold text-emerald-800 sm:inline">
                        Freshies
                    </span>
                </Link>

                {/* Search - desktop */}
                <SearchField
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onSubmit={handleSearchSubmit}
                    onSearchComplete={handleSearchComplete}
                />

                {/* Right actions - desktop */}
                <nav className="ml-auto hidden items-center gap-6 lg:flex">
                    <Link
                        to="/vendors"
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
                    >
                        <PiStorefrontLight className="h-5 w-5" />
                        Vendors
                    </Link>
                    <Link
                        to="/account"
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
                    >
                        <FiUser className="h-5 w-5" />
                        Account
                    </Link>
                    <Link
                        to="/cart"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
                    >
                        <span className="relative">
                            <FiShoppingCart className="h-5 w-5" />
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                                3
                            </span>
                        </span>
                        ${cartTotal}
                    </Link>
                </nav>

                {/* Mobile: cart + menu toggle */}
                <div className="ml-auto flex items-center gap-4 lg:hidden">
                    <Link to="/cart" className="relative text-gray-700">
                        <FiShoppingCart className="h-6 w-6" />
                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                            3
                        </span>
                    </Link>
                    <button
                        type="button"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMobileOpen((open) => !open)}
                        className="text-gray-700"
                    >
                        {mobileOpen ? (
                            <FiX className="h-6 w-6" />
                        ) : (
                            <FiMenu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Search - mobile */}
            <SearchField
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onSubmit={handleSearchSubmit}
                onSearchComplete={handleSearchComplete}
                mobile
            />

            {/* Category row - desktop */}
            <div className="hidden border-t border-gray-200 md:block">
                <div className="mx-auto flex max-w-[95%] items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
                    {categories.map((category) => (
                        <NavLink
                            key={category.label}
                            to={category.href}
                            className={({ isActive }) =>
                                `flex shrink-0 items-center gap-4 whitespace-nowrap text-sm font-medium  transition-colors ${isActive
                                    ? "text-green-700"
                                    : "text-gray-700 hover:text-green-600"
                                }`
                            }
                        >
                            {category.hasIcon && < MdOutlineGridView className="h-4 w-4" />}
                            {category.label}
                            {category.label === "All Categories" && (
                                <FiChevronDown className="h-3.5 w-3.5" />
                            )}
                        </NavLink>
                    ))}
                    <Link
                        to="/special-offers"
                        className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-orange-600 transition-colors hover:text-orange-500"
                    >
                        <FiTag className="h-4 w-4" />
                        Special Offers
                    </Link>
                </div>
            </div>

            {/* Mobile menu panel */}
            {mobileOpen && (
                <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
                    <nav className="flex flex-col divide-y divide-gray-100">
                        <Link
                            to="/vendors"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 py-3 text-sm font-medium text-gray-700"
                        >
                            <PiStorefrontLight className="h-5 w-5" />
                            Vendors
                        </Link>
                        <Link
                            to="/account"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 py-3 text-sm font-medium text-gray-700"
                        >
                            <FiUser className="h-5 w-5" />
                            Account
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.label}
                                to={category.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-3 text-sm font-medium text-gray-700"
                            >
                                {category.label}
                            </Link>
                        ))}
                        <Link
                            to="/special-offers"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 py-3 text-sm font-medium text-orange-600"
                        >
                            <FiTag className="h-4 w-4" />
                            Special Offers
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default NavBar;