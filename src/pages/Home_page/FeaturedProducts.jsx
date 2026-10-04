import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiEye, FiArrowRight, FiShoppingCart, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useWishlist } from "../../services/wishlist";
import { getallcategories, handlegetproductsbycategory } from "../../redux/Slices/ProductSlice";
import { addtocart, getcartitems, removetocart } from "../../redux/Slices/AddtocartSlice";
import { showErrorToast } from "../../components/Toast";
import Productloader from "../../reusables/Productloader";

const normalizeProduct = (product) => {
    const variant = product.variants?.[0] || {};
    const badges = [];

    if (variant.discount_price) {
        badges.push({ label: "DISCOUNT", color: "bg-orange-500" });
    }

    if (product.coupons?.some((coupon) => coupon.is_active)) {
        badges.push({ label: "COUPON", color: "bg-emerald-600" });
    }

    return {
        ...product,
        id: product._id,
        name: product.name || "Unnamed product",
        vendor: product.createdby?.name || "Local vendor",
        unit: variant.weight || "",
        image: product.thumbnail || product.images?.[0] || "",
        price: Number(variant.selling_price) || 0,
        oldPrice: Number(variant.original_price) || null,
        stock: product.is_active ? 1 : 0,
        badges,
    };
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const cartItem = useSelector((state) => state.cart.carts.cartdata.find(
        (item) =>
            String(item.productId?._id ?? item.productId) === String(product.id) &&
            String(item.weight ?? item.unit ?? "") === String(product.unit ?? "")
    ));
    const quantity = Number(cartItem?.quantity) || 0;

    const handleAddToCart = async () => {
        try {
            await dispatch(addtocart({
                productId: product.id,
                name: product.name,
                weight: product.unit,
                quantity: 1,
            })).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to add this product to your cart");
        }
    };

    const handleRemoveFromCart = async () => {
        try {
            await dispatch(removetocart({
                productId: product.id,
                weight: product.unit,
            })).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to remove this product from your cart");
        }
    };

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
                    aria-label={`View ${product.name}`}
                    onClick={() => {
                        navigate(`/product-details/${product.id}`);
                        window.scrollTo(0, 0);
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-emerald-600"
                >
                    <FiEye className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    aria-label={`${isWishlisted(product.id) ? "Remove" : "Add"} ${product.name} ${isWishlisted(product.id) ? "from" : "to"} wishlist`}
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-12 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-red-500"
                >
                    <FiHeart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""}`} />
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
                        <span className="text-base font-bold text-gray-900 sm:text-lg">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ${product.oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    {product.stock > 0 ? (
                        quantity > 0 ? (
                            <div className="flex h-9 items-center border border-emerald-600 text-emerald-700">
                                <button
                                    type="button"
                                    aria-label={quantity === 1 ? `Remove ${product.name} from cart` : `Decrease ${product.name} quantity`}
                                    onClick={handleRemoveFromCart}
                                    className="flex h-full w-9 items-center justify-center hover:bg-emerald-50"
                                >
                                    {quantity === 1 ? <FiTrash2 className="h-3.5 w-3.5" /> : <FiMinus className="h-3.5 w-3.5" />}
                                </button>
                                <span className="flex h-full w-8 items-center justify-center text-sm font-semibold" aria-live="polite">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    aria-label={`Increase ${product.name} quantity`}
                                    onClick={handleAddToCart}
                                    className="flex h-full w-9 items-center justify-center hover:bg-emerald-50"
                                >
                                    <FiPlus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex items-center gap-1 bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 cursor-pointer"
                            >
                                <FiShoppingCart className="h-3.5 w-3.5" />
                                Add
                            </button>
                        )
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="cursor-not-allowed bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500"
                        >
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FeaturedProducts = () => {
    const dispatch = useDispatch();
    const { categorydata } = useSelector((state) => state.product.category);
    const { productdata, productloading, producterror } = useSelector((state) => state.product.products);
    const selectedCategoryId = useSelector((state) => state.product.selectedCategoryId);
    const profile = useSelector((state) => state.auth.profile.profiledata);
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const userId = profile?._id || profile?.id || profile?.userId || profile?.user?._id;

    useEffect(() => {
        if (categorydata.length === 0) {
            dispatch(getallcategories());
        }
    }, [categorydata.length, dispatch]);

    useEffect(() => {
        if (selectedCategoryId) {
            dispatch(handlegetproductsbycategory(selectedCategoryId));
        }
    }, [selectedCategoryId, dispatch]);

    useEffect(() => {
        if (token && userId) {
            dispatch(getcartitems(userId));
        }
    }, [dispatch, token, userId]);

    const products = Array.isArray(productdata)
        ? productdata.slice(0, 4).map(normalizeProduct)
        : [];

    return (
        <section id="featured-products" className="scroll-mt-24 bg-white px-4 py-12 sm:px-6 lg:px-8 xl:pt-16 xl:pb-30">
            <div className="mx-auto max-w-[95%]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Featured Products
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            Handpicked fresh arrivals from our top-rated local vendors
                        </p>
                    </div>
                    <Link
                        to="/shop" onClick={() => window.scrollTo(0, 0)}
                        className="flex shrink-0 items-center justify-center gap-2 self-start border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50" >
                        View All Products
                        <FiArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {productloading ? (
                    <Productloader />
                ) : producterror || products.length === 0 ? (
                    <p className="mt-8 text-center text-sm text-gray-500">Products not available</p>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;