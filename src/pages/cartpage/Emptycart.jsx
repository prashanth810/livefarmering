import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FiArrowRight,
    FiAward,
    FiChevronLeft,
    FiChevronRight,
    FiHeart,
    FiLock,
    FiMinus,
    FiPlus,
    FiRotateCcw,
    FiShield,
    FiShoppingBag,
    FiShoppingCart,
    FiStar,
    FiTrash2,
} from "react-icons/fi";
import { addtocart, removetocart } from "../../redux/Slices/AddtocartSlice";
import { getallproducts } from "../../redux/Slices/ProductSlice";
import { useWishlist } from "../../services/wishlist";
import { showErrorToast } from "../../components/Toast";
import Productloader from "../../reusables/Productloader";

const trustPoints = [
    { icon: FiAward, label: "Earn points" },
    { icon: FiShield, label: "Authorised retailer" },
    { icon: FiRotateCcw, label: "30-day returns" },
    { icon: FiLock, label: "Secure checkout" },
];

const RecommendedProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const cartItems = useSelector((state) => state.cart.carts.cartdata);
    const cartItem = cartItems.find((item) =>
        String(item.productId?._id ?? item.productId) === String(product.id) &&
        String(item.weight ?? item.unit ?? "") === String(product.unit)
    );
    const quantity = Number(cartItem?.quantity) || 0;

    const handleAdd = async () => {
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

    const handleRemove = async () => {
        try {
            await dispatch(removetocart({
                productId: product.id,
                weight: product.unit,
            })).unwrap();
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to update your cart");
        }
    };

    return (
        <div className="group relative flex h-full flex-col overflow-hidden border border-emerald-400/20 bg-white shadow-sm transition-shadow duration-500 hover:border-emerald-500/30 hover:shadow-md">
            <div className="relative bg-gray-50 p-6">
                {product.oldPrice > product.price && (
                    <span className="absolute left-3 top-3 bg-orange-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        SALE
                    </span>
                )}
                <button
                    type="button"
                    aria-label={`${isWishlisted(product.id) ? "Remove" : "Add"} ${product.name} ${isWishlisted(product.id) ? "from" : "to"} wishlist`}
                    onClick={() => toggleWishlist(product.id, product.unit)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-red-500"
                >
                    <FiHeart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </button>
                <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-32 w-full object-contain sm:h-36"
                    onClick={() => navigate(`/product-details/${product.id}`)}
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                {product.vendor && <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{product.vendor}</span>}
                <button
                    type="button"
                    onClick={() => navigate(`/product-details/${product.id}`)}
                    className="mt-1 text-left text-sm font-bold text-gray-900 sm:text-base"
                >
                    {product.name}
                </button>
                <span className="mt-1 text-xs text-gray-500">{product.unit}</span>

                <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-gray-900 sm:text-lg">
                            ₹{product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{product.oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {quantity > 0 ? (
                        <div className="flex h-9 items-center border border-emerald-600 text-emerald-700">
                            <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={handleRemove}
                                className="flex h-full w-9 items-center justify-center hover:bg-emerald-50"
                            >
                                {quantity === 1 ? <FiTrash2 className="h-3.5 w-3.5" /> : <FiMinus className="h-3.5 w-3.5" />}
                            </button>
                            <span className="flex h-full w-8 items-center justify-center text-sm font-semibold">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={handleAdd}
                                disabled={product.stock <= quantity}
                                className="flex h-full w-9 items-center justify-center hover:bg-emerald-50"
                            >
                                <FiPlus className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={product.stock <= 0}
                            className="flex cursor-pointer items-center gap-1 bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FiShoppingCart className="h-3.5 w-3.5" />
                            {product.stock <= 0 ? "Sold out" : "Add"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyCart = () => {
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const { allproductsdata, allproductsloading, allproductserror } = useSelector((state) => state.product.allproducts);

    useEffect(() => {
        dispatch(getallproducts({ page: 1, limit: 8 }));
    }, [dispatch]);

    const scrollBy = (dir) =>
        scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

    const recommendedProducts = allproductsdata.map((product) => {
        const variant = product.variants?.[0] || {};
        const createdBy = product.createdby;

        return {
            id: product._id,
            name: product.name || "Unnamed product",
            vendor: typeof createdBy === "object" ? createdBy.name || "" : "",
            unit: variant.weight || "",
            image: product.thumbnail || product.images?.[0] || "",
            price: Number(variant.selling_price) || 0,
            oldPrice: Number(variant.original_price) || 0,
            stock: Number(variant.stock ?? variant.stock_quantity) || 0,
        };
    }).filter((product) => product.id);

    return (
        <div className="overflow-hidden">
            {/* Empty state */}
            <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-10 text-center">
                <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-orange-50">
                    <FiShoppingBag className="h-20 w-20 text-[#FF6900]" strokeWidth={1.5} />
                    <FiStar className="absolute left-2 top-6 h-5 w-5 fill-[#FF6900] text-[#FF6900]" />
                    <FiStar className="absolute right-3 top-3 h-3 w-3 fill-[#FF6900] text-[#FF6900]" />
                    <FiStar className="absolute bottom-6 right-1 h-4 w-4 fill-[#FF6900] text-[#FF6900]" />
                </div>

                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                    Oops! Your cart feels a bit lonely!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    You haven't picked anything yet. Find something you love and add it here!
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                        to="/wishlist"
                        className="flex items-center justify-center gap-2 border border-[#FF6900] py-3 text-sm font-semibold uppercase tracking-wider text-[#FF6900] transition-colors hover:bg-yellow-50"
                    >
                        <FiHeart className="h-4 w-4" />
                        Go to wishlist
                    </Link>
                    <Link
                        to="/shop"
                        className="flex items-center justify-center gap-2 bg-[#038432] py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-transparent hover:text-[#00A63E] hover:ring-1 hover:ring-[#038432] duration-500"
                    >
                        Continue shopping
                        <FiArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-600">
                    {trustPoints.map(({ icon: Icon, label }) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-[#00A63E]" />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Recommended */}
            <div className="mt-10 bg-[#FFF7ED] px-4 py-6 sm:px-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        Recommended {" "}
                        <span className="font-serif italic text-[#00A63E]"> Products </span>
                    </h3>

                </div>

                {allproductsloading ? (
                    <Productloader count={4} />
                ) : allproductserror ? (
                    <p role="alert" className="py-8 text-center text-sm text-red-600">{allproductserror}</p>
                ) : recommendedProducts.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">No recommended products are available right now.</p>
                ) : (
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className="w-72 shrink-0">
                                <RecommendedProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex gap-4 items-center justify-end mt-4">
                    <button
                        type="button"
                        aria-label="Previous products"
                        onClick={() => scrollBy(-1)}
                        className="flex h-10 w-10 items-center justify-center bg-white text-[#008236] shadow-sm rounded-full border hover:bg-green-100 cursor-pointer duration-300"
                    >
                        <FiChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next products"
                        onClick={() => scrollBy(1)}
                        className="flex h-10 w-10 items-center justify-center bg-white text-[#FF6900] shadow-sm rounded-full border hover:bg-yellow-100 cursor-pointer duration-300"

                    >
                        <FiChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmptyCart;