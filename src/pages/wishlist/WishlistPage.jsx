import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiHeart, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { featuredProducts, products } from "../../constants/products";
import { useWishlist } from "../../services/wishlist";

const WishlistPage = () => {
    const { wishlistIds, removeFromWishlist } = useWishlist();
    const catalog = [...products, ...featuredProducts];
    const wishlistItems = wishlistIds
        .map((id) => catalog.find((product) => product.id === id))
        .filter(Boolean);
    const estimatedValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <section className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[95%]">
                <nav className="mb-4 flex items-center gap-2 text-xs text-gray-400 sm:text-sm">
                    <Link to="/" className="hover:text-green-600">Home</Link>
                    <span>›</span>
                    <span className="font-medium text-green-600">Wishlist</span>
                </nav>
                <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Your Wishlist{" "}
                    <span className="text-base font-normal text-gray-400 sm:text-lg">
                        ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
                    </span>
                </h1>

                {wishlistItems.length === 0 ? (
                    <div className="bg-white p-10 text-center shadow-sm">
                        <FiHeart className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                        <p className="mb-4 text-gray-500">Your wishlist is empty.</p>
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
                            <FiArrowLeft className="h-4 w-4" /> Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                        <div className="bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
                            <div className="mb-2 hidden items-center justify-between border-b border-gray-100 pb-3 sm:flex">
                                <span className="text-sm font-semibold text-gray-700">Product Details</span>
                                <span className="text-sm font-semibold text-gray-700">Price</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {wishlistItems.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-4 py-5 first:pt-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 bg-gray-50 object-cover sm:h-28 sm:w-28" />
                                            <div className="min-w-0">
                                                <p className="py-1 text-xs text-gray-400">{item.vendor}</p>
                                                <Link to={`/product-details/${item.id}`} className="block truncate text-sm font-semibold text-gray-900 hover:text-green-600 sm:text-base">{item.name}</Link>
                                                <p className="mb-2 text-xs text-gray-400">{item.unit}</p>
                                                <button type="button" onClick={() => removeFromWishlist(item.id)} className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700">
                                                    <FiTrash2 className="h-3.5 w-3.5" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                                            <div className="text-left sm:text-right">
                                                <p className="text-base font-bold text-gray-900 sm:text-lg">${item.price.toFixed(2)}</p>
                                                {item.oldPrice && <p className="text-xs text-gray-400 line-through">${item.oldPrice.toFixed(2)}</p>}
                                            </div>
                                            <button type="button" className="flex items-center gap-1.5 bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600">
                                                <FiShoppingCart className="h-3.5 w-3.5" /> Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
                            <div className="bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-4 text-base font-bold text-gray-900 sm:text-lg">Wishlist Summary</h2>
                                <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
                                    <div className="flex items-center justify-between"><span className="text-gray-500">Saved items</span><span className="font-semibold text-gray-800">{wishlistItems.length}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-gray-500">Estimated value</span><span className="font-semibold text-gray-800">${estimatedValue.toFixed(2)}</span></div>
                                </div>
                                <Link to="/shop" className="mt-5 flex w-full items-center justify-center gap-2 bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600">Continue Shopping <FiArrowRight className="h-4 w-4" /></Link>
                            </div>
                            <div className="flex items-center gap-3 bg-[#027810dc] p-4 text-white shadow-sm">
                                <FiHeart className="h-8 w-8 shrink-0" />
                                <p className="text-xs font-medium sm:text-sm">Save your favorite fresh products here and come back when you are ready.</p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WishlistPage;