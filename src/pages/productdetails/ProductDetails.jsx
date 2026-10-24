import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    FiShoppingCart,
    FiChevronRight,
    FiChevronLeft,
    FiMinus,
    FiPlus,
    FiHeart,
    FiCheckCircle,
    FiTruck,
    FiRefreshCw,
    FiStar,
    FiUser,
} from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import { PiStorefrontLight } from "react-icons/pi";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { useWishlist } from "../../services/wishlist";
import { nutritionRows, themeVars } from "../../constants/Styles";
import { FaArrowCircleRight, FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getsingleproduct } from "../../redux/Slices/ProductSlice";
import { addtocart, getcartitems, removetocart } from "../../redux/Slices/AddtocartSlice";
import { fetchprofilebyid, handlefetchprofileinfo } from "../../redux/Slices/AuthSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast";
import FeedbackModal from "../../reusables/FeedbackModal";
import { clearfeedbacks, createfeedback, getfeedbacks, editfeedback, removefeedback } from "../../redux/Slices/FeedbackSlice";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DeleteConfirmModal from "../../reusables/DeleteConfirmModal";


const tabs = [
    { id: "description", label: "Description & Nutrition" },
    { id: "reviews", label: "Reviews" },
    { id: "vendor", label: "Vendor Profile" },
];

// "2026-10-22T08:22:51.448Z" -> "22 Oct 2026, 08:22 AM"
const formatReviewDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const formattedTime = date
        .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
        .replace(/\b(am|pm)\b/i, (period) => period.toUpperCase());

    return `${formattedDate}, ${formattedTime}`;
};

const getReviewUserId = (review) => {
    const user = review.user ?? review.userId;
    return user && typeof user === "object" ? user._id : user;
};

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
                        style={{ width: `${fillPercent}%` }}
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
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { singleproductdata, singleloading, singleerror } = useSelector(
        (state) => state.product.singleproduct,
    );
    const token = useSelector((state) => state.auth.login.token) || sessionStorage.getItem("token");
    const cartloading = useSelector((state) => state.cart.carts.cartloading);
    const cartItems = useSelector((state) => state.cart.carts.cartdata);
    const getcartloading = useSelector((state) => state.cart.getcart.getcartloading);
    const profile = useSelector((state) => state.auth.profile.profiledata);
    const profileLoading = useSelector((state) => state.auth.profile.profileloading);
    const userId = profile?._id || profile?.id || profile?.userId || profile?.user?._id;
    const [activeThumb, setActiveThumb] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [openfeedback, setOpenfeedback] = useState(false);

    const [submittingfeedback, setSubmittingfeedback] = useState(false);

    const [editingReview, setEditingReview] = useState(null);

    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [deletingReview, setDeletingReview] = useState(false);

    const isMyReview = (review) => {
        const reviewUserId = review.userId?._id ?? review.userId ?? review.user?._id ?? review.user;
        return Boolean(userId) && String(reviewUserId) === String(userId);
    };

    const handleopenedit = (review) => {
        setEditingReview(review);
        setOpenfeedback(true);
    };

    const handleclosefeedback = () => {
        setOpenfeedback(false);
        setEditingReview(null);
    };

    const handleopenfeedback = () => {
        if (!token) {
            showErrorToast("Please login to write a review");
            navigate("/login");
            return;
        }
        setOpenfeedback(true);
    };

    // handle update feedbacks
    const handlesubmitfeedback = async ({ rating, feedback }) => {
        try {
            setSubmittingfeedback(true);
            if (editingReview) {
                await dispatch(
                    editfeedback({
                        id: editingReview._id,
                        data: { rating, comment: feedback },
                    })
                ).unwrap();
                showSuccessToast("Your review was updated!");
            } else {
                await dispatch(
                    createfeedback({
                        id: productId,
                        data: { rating, comment: feedback },
                    })
                ).unwrap();
                showSuccessToast("Thanks for your review!");
                dispatch(clearfeedbacks());
            }
            handleclosefeedback();
            // reload the list and the rating summary
            dispatch(getfeedbacks({ productId, page: 1, limit: 5 }));
        } catch (error) {
            throw new Error(typeof error === "string" ? error : error?.message || "Unable to submit your review");
        } finally {
            setSubmittingfeedback(false);
        }
    };

    // feedback of this product: list + summary (average, total, 1-5 star counts) + pagination
    const { feedbackloading, feedbackdata, feedbackerror, summary, pagination } = useSelector(
        (state) => state.feedback.feedback,
    );
    const reviewerProfiles = useSelector((state) => state.auth.reviewerProfiles.byId);

    useEffect(() => {
        if (productId) {
            setActiveThumb(0);
            setSelectedVariantIndex(0);
            setQuantity(1);
            dispatch(getsingleproduct(productId));
            dispatch(clearfeedbacks());
            dispatch(getfeedbacks({ productId, page: 1, limit: 5 }));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        const reviewerIds = [...new Set(feedbackdata
            .map(getReviewUserId)
            .filter(Boolean)
            .map(String))];

        reviewerIds.forEach((id) => {
            dispatch(fetchprofilebyid(id));
        });
    }, [dispatch, feedbackdata]);

    useEffect(() => {
        if (token && !userId && !profileLoading) {
            dispatch(handlefetchprofileinfo());
        }
    }, [dispatch, profileLoading, token, userId]);

    useEffect(() => {
        if (token && userId) {
            dispatch(getcartitems(userId));
        }
    }, [dispatch, token, userId]);

    const variants = Array.isArray(singleproductdata?.variants) ? singleproductdata.variants : [];
    const variant = variants[selectedVariantIndex] || variants[0] || {};
    const variantStock = Number(variant.stock ?? variant.stock_quantity) || 0;
    const product = singleproductdata && {
        ...singleproductdata,
        id: singleproductdata._id || productId,
        vendor: singleproductdata.createdby?.name || "Local vendor",
        category: singleproductdata.category?.name || "Category unavailable",
        unit: variant.weight || "Unit unavailable",
        price: Number(variant.selling_price) || 0,
        oldPrice: Number(variant.original_price) || null,
        rating: summary.totalReviews ? summary.averageRating : Number(singleproductdata.rating) || 0,
        reviews: summary.totalReviews,
        image: singleproductdata.thumbnail || singleproductdata.images?.[0] || "",
    };
    const aboutProduct = singleproductdata?.about_product || [];
    const nutritionFacts = singleproductdata?.nutrition_facts || {};
    const productImages = [...new Set([singleproductdata?.thumbnail, ...(singleproductdata?.images || [])].filter(Boolean))];
    const activeImageIndex = Math.min(activeThumb, Math.max(productImages.length - 1, 0));
    const activeImage = productImages[activeImageIndex];
    const selectedWeight = variant.weight || product?.unit || "";
    const selectedCartItem = cartItems.find((item) => {
        const itemProductId = item.productId?._id ?? item.productId ?? item._id;
        const itemWeight = item.weight ?? item.unit ?? "";
        return String(itemProductId) === String(product?.id) &&
            String(itemWeight) === String(selectedWeight);
    });
    const isInCart = Boolean(selectedCartItem);
    const displayedQuantity = isInCart
        ? Number(selectedCartItem.quantity) || 1
        : quantity;
    const cartIsLoading = cartloading || getcartloading;

    // star bars: 5 Stars ... 1 Stars with count and percent from the API summary
    const ratingRows = [5, 4, 3, 2, 1].map((star) => {
        const count = summary.breakdown?.[star] || 0;
        return {
            label: `${star} Stars`,
            count,
            percent: summary.totalReviews ? (count / summary.totalReviews) * 100 : 0,
        };
    });

    const showPreviousImage = () => {
        setActiveThumb((current) => current === 0 ? productImages.length - 1 : current - 1);
    };

    const showNextImage = () => {
        setActiveThumb((current) => (current + 1) % productImages.length);
    };

    const handleAddToCart = async () => {
        if (!token) {
            showErrorToast("Please login to add items to your cart");
            navigate("/login");
            return;
        }

        try {
            await dispatch(
                addtocart({
                    productId: product.id,
                    name: product.name,
                    weight: variant.weight || product.unit,
                    quantity,
                })
            ).unwrap();
            setQuantity(1);
            showSuccessToast(`${product.name} added to cart`);
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to add this item to your cart");
        }
    };

    const updateCartQuantity = async (delta) => {
        if (!token) {
            showErrorToast("Please login to update your cart");
            navigate("/login");
            return;
        }

        try {
            if (delta > 0) {
                await dispatch(addtocart({
                    productId: product.id,
                    name: product.name,
                    weight: selectedWeight,
                    quantity: 1,
                })).unwrap();
            } else {
                await dispatch(removetocart({
                    productId: product.id,
                    weight: selectedWeight,
                })).unwrap();
            }

            if (userId) {
                await dispatch(getcartitems(userId)).unwrap();
            }
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to update your cart");
        }
    };

    const decreaseQuantity = () => {
        if (isInCart) {
            updateCartQuantity(-1);
            return;
        }

        setQuantity((current) => Math.max(1, current - 1));
    };

    const increaseQuantity = () => {
        if (variantStock <= 0 || displayedQuantity >= variantStock) return;

        if (isInCart) {
            updateCartQuantity(1);
            return;
        }

        setQuantity((current) => Math.min(variantStock, current + 1));
    };


    const handleconfirmdelete = async () => {
        if (!reviewToDelete) return;
        try {
            setDeletingReview(true);
            await dispatch(removefeedback(reviewToDelete._id)).unwrap();
            showSuccessToast("Your review was deleted");
            setReviewToDelete(null);
            // reload the list and the rating summary
            dispatch(getfeedbacks({ productId, page: 1, limit: 5 }));
        } catch (error) {
            showErrorToast(typeof error === "string" ? error : "Unable to delete your review");
        } finally {
            setDeletingReview(false);
        }
    };

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

    if (singleloading) {
        return <main className="min-h-screen px-6 py-16 text-center text-gray-500">Loading product...</main>;
    }

    if (singleerror || !product) {
        return <main className="min-h-screen px-6 py-16 text-center text-gray-500">Product information is not available.</main>;
    }

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
                                src={activeImage}
                                className="h-full w-full object-contain"
                            />
                            {productImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={showPreviousImage}
                                        aria-label="Previous product image"
                                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white cursor-pointer"
                                    >
                                        <FiChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={showNextImage}
                                        aria-label="Next product image"
                                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white cursor-pointer"
                                    >
                                        <FiChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                        {productImages.length > 0 ? (
                            <div className="flex items-center gap-3">
                                {productImages.length > 5 && (
                                    <button
                                        type="button"
                                        onClick={showPreviousImage}
                                        aria-label="Previous product thumbnails"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--border)] bg-white text-gray-600 hover:border-[#FF6900]"
                                    >
                                        <FiChevronLeft className="h-5 w-5" />
                                    </button>
                                )}
                                <div className="flex min-w-0 flex-1 gap-4 overflow-hidden">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={image}
                                            type="button"
                                            onClick={() => setActiveThumb(index)}
                                            className={`flex h-20 w-20 shrink-0 aspect-square items-center justify-center border bg-[#f3f4f6] p-2 transition-shadow cursor-pointer ${activeImageIndex === index
                                                ? "border-2 border-[#FF6900]"
                                                : "border-[#cccccd]"
                                                }`}>
                                            <img
                                                src={image}
                                                alt={`${product.name} image ${index + 1}`}
                                                className="h-full w-full bg-[#f3f4f6] object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                                {productImages.length > 5 && (
                                    <button
                                        type="button"
                                        onClick={showNextImage}
                                        aria-label="Next product thumbnails"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--border)] bg-white text-gray-600 hover:border-[#FF6900]"
                                    >
                                        <FiChevronRight className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)]">
                                Product images not available.
                            </div>
                        )}
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
                                onClick={() => setActiveTab("reviews")}
                                className="text-sm text-[var(--muted-foreground)] underline"
                            >
                                {product.rating} ({product.reviews} reviews)
                            </button>
                        </div>

                        <div className="mb-6 flex items-end gap-4 border-b border-[var(--border)] pb-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold leading-none font-mono text-[var(--foreground)]">
                                    ₹{product.price.toFixed(2)}
                                </span>

                                {product.oldPrice && (
                                    <span className="text-md font-medium text-[var(--muted-foreground)] line-through font-mono">
                                        ₹{product.oldPrice.toFixed(2)}
                                    </span>
                                )}

                                {product.oldPrice && (
                                    <span className="self-center bg-[var(--destructive)] px-2.5 py-1 text-sm font-bold text-[var(--destructive-foreground)]">
                                        Save {Math.round((1 - product.price / product.oldPrice) * 100)}%
                                    </span>
                                )}
                            </div>

                        </div>

                        {variants.length > 0 && (
                            <div className="mb-6">
                                <span className="mb-3 block text-sm font-semibold text-[var(--foreground)]">
                                    Select variant
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    {variants.map((item, index) => {
                                        const itemPrice = Number(item.selling_price) || 0;
                                        const itemStock = Number(item.stock ?? item.stock_quantity) || 0;
                                        const isSelected = variants[index] === variant;
                                        return (
                                            <button
                                                key={`${item.weight || "variant"}-${index}`}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedVariantIndex(index);
                                                    setQuantity(1);
                                                }}
                                                className={`min-w-28 border px-4 py-3 text-left transition-colors ${isSelected
                                                    ? "border-[#FF6900] bg-orange-50"
                                                    : "border-[var(--border)] bg-[var(--card)] hover:border-[#FF6900]"
                                                    }`}
                                            >
                                                <span className="block text-sm font-semibold text-[var(--foreground)]">
                                                    {item.weight || "Variant"}
                                                </span>
                                                <span className="mt-1 block text-sm text-[var(--muted-foreground)]">
                                                    ₹{itemPrice.toFixed(2)}
                                                </span>
                                                <span className={`mt-1 block text-xs ${itemStock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                    {itemStock > 0 ? "In stock" : "Out of stock"}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                                        onClick={decreaseQuantity}
                                        disabled={cartIsLoading || (!isInCart && displayedQuantity <= 1)}
                                        aria-label="Decrease quantity"
                                        className="flex h-full w-10 items-center justify-center text-[var(--muted-foreground)] bg-white text-[#FF6900] cursor-pointer hover:bg-[#FF690075] hover:text-[#fff] duration-500 disabled:cursor-not-allowed disabled:opacity-40">
                                        <FiMinus className="h-5 w-5" />
                                    </button>
                                    <span
                                        className="flex w-12 items-center justify-center text-base font-semibold text-[var(--foreground)]"
                                        aria-live="polite"
                                    >
                                        {displayedQuantity}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={cartIsLoading || variantStock <= 0 || displayedQuantity >= variantStock}
                                        onClick={increaseQuantity}
                                        aria-label="Increase quantity"
                                        className="flex h-full w-10 items-center justify-center text-[var(--muted-foreground)] bg-white text-[#059669] cursor-pointer hover:bg-[#05966875] hover:text-[#fff] duration-500 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FiPlus className="h-5 w-5" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={cartIsLoading || isInCart || (variantStock <= 0 && variants.length > 0)}
                                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-6 text-base font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer" >
                                    <FiShoppingCart className="h-5 w-5" />
                                    {cartloading
                                        ? isInCart ? "Updating..." : "Adding..."
                                        : isInCart ? "Added to Cart" : "Add to Cart"}
                                </button>

                                {variantStock > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!token) {
                                                showErrorToast("Please login to continue");
                                                navigate("/login");
                                                return;
                                            }
                                            navigate("/checkout", {
                                                state: {
                                                    buyNow: {
                                                        productId: product.id,
                                                        name: product.name,
                                                        weight: selectedWeight,
                                                        quantity: displayedQuantity,
                                                        price: product.price,
                                                        image: product.image,
                                                    },
                                                },
                                            });
                                        }}
                                        className="flex h-12 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] px-6 text-base font-semibold text-[var(--accent-foreground)] cursor-pointer"
                                    >
                                        Buy Now
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => toggleWishlist(product.id, selectedWeight)}
                                    aria-label={`${isWishlisted(product.id) ? "Remove" : "Add"} from wishlist`}
                                    className="flex h-10 w-10 items-center justify-center border border-gray-400 bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[#059669] hover:text-[#fff] hover:border-[#fff] transition-all duration-300 cursor-pointer"
                                >
                                    <FiHeart
                                        className={`h-5 w-5 ${isWishlisted(product.id)
                                            ? "fill-[var(--destructive)] text-[var(--destructive)]"
                                            : ""
                                            }`}
                                    />
                                </button>
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
                                className={`shrink-0 whitespace-nowrap border-b border-gray-400 px-6 py-5 text-base font-semibold transition-colors sm:px-8 ${activeTab === tab.id
                                    ? "border-[var(--primary)] bg-[var(--card)] text-[var(--primary)]"
                                    : "border-transparent text-[var(--muted-foreground)]"
                                    }`}
                            >
                                {tab.id === "reviews" ? `Reviews (${summary.totalReviews})` : tab.label}
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
                                    {product.description || "Description not available."}
                                </p>

                                {aboutProduct.length > 0 && (
                                    <ul className="mb-6 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                                        {aboutProduct.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                )}

                                <h4 className="mb-3 text-base font-bold text-[var(--foreground)]">
                                    Storage Instructions
                                </h4>
                                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                                    <li>{product.storage_instructions || "Storage instructions not available."}</li>
                                </ul>

                                {/* Meta */}
                                <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--input)] p-5 mt-5">
                                    <p className="text-lg font-semibold border-b border-gray-200 pb-2"> Stock Details </p>
                                    <div className="flex items-center gap-3 text-[15px] text-[var(--foreground)]">
                                        <IconCircle size={20}>
                                            <FiCheckCircle className="h-5 w-5 text-[var(--success)]" />
                                        </IconCircle>
                                        <span className="font-semibold text-[var(--success)]">
                                            {variantStock > 0 ? `In Stock (${variantStock} available)` : "Out of stock"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[15px] text-[var(--foreground)]">
                                        <IconCircle size={20}>
                                            <FiTruck className="h-5 w-5 text-[var(--muted-foreground)]" />
                                        </IconCircle>
                                        <span>Free delivery on orders over <span className="text-green-700 font-semibold text-md"> ₹199 </span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[15px] text-[var(--foreground)]">
                                        <IconCircle size={20}>
                                            <FiRefreshCw className="h-5 w-5 text-[var(--muted-foreground)]" />
                                        </IconCircle>
                                        <span>Easy 3-day freshness return guarantee</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nutrition */}
                            <div>
                                <div className="max-w-[400px] rounded-[var(--radius-md)] border border-[var(--border)] p-6">
                                    <h3 className="mb-4 border-b-1 border-[#FF6900] pb-2 text-xl font-semibold">
                                        Nutrition Facts
                                    </h3>
                                    <div className="mb-4 text-sm">
                                        Serving size: {nutritionFacts.serving_size || "Not available"}
                                    </div>
                                    <div className="mb-4 border-b-1 border-[#FF6900] bg-[#FF6900]" />

                                    {(Object.keys(nutritionFacts).length > 0 ? Object.entries(nutritionFacts)
                                        .filter(([key]) => key !== "serving_size")
                                        .map(([label, value]) => ({ label: label.replaceAll("_", " "), value })) : nutritionRows).map((row) => (
                                            <div
                                                key={row.label}
                                                className={`flex justify-between border-b border-[var(--border)] py-3 text-[15px] ${row.bold ? "font-bold border-b-2" : ""}`}>
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
                            <h3 className="mb-8 text-2xl font-semibold text-[var(--foreground)]">
                                Customer Reviews
                            </h3>

                            <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-center">
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-6xl font-extrabold leading-none text-[var(--foreground)]">
                                        {Number(summary.averageRating).toFixed(1)}
                                    </span>
                                    <div className="my-2">
                                        <StarRating rating={summary.averageRating} size={20} />
                                    </div>
                                    <span className="text-sm text-[var(--muted-foreground)]">
                                        Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                <div className="flex w-full max-w-[400px] flex-col gap-3">
                                    {ratingRows.map((bar) => (
                                        <div
                                            key={bar.label}
                                            className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]"
                                        >
                                            <span className="w-14 shrink-0">{bar.label}</span>
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--input)]">
                                                <div
                                                    className="h-full rounded-full bg-[var(--warning)]"
                                                    style={{ width: `${bar.percent}%` }}
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
                                    onClick={handleopenfeedback}
                                    className="border border-[#FF6900] px-6 py-3 text-sm text-[#FF6900] md:ml-auto hover:bg-[#FF6900] hover:text-white duration-500 cursor-pointer"
                                >
                                    Write a Review
                                </button>
                            </div>

                            {feedbackloading && feedbackdata.length === 0 && (
                                <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">Loading reviews...</p>
                            )}
                            {feedbackerror && feedbackdata.length === 0 && (
                                <p className="py-6 text-center text-sm text-red-500" role="alert">{feedbackerror}</p>
                            )}
                            {!feedbackloading && !feedbackerror && feedbackdata.length === 0 && (
                                <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
                                    No reviews yet. Be the first to review this product.
                                </p>
                            )}

                            <div className="flex flex-col gap-6">
                                {feedbackdata.map((review) => (
                                    <div
                                        key={review._id}
                                        className="rounded-[var(--radius-md)] border border-[var(--border)] p-6"
                                    >
                                        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--secondary)] text-lg font-bold uppercase text-[var(--secondary-foreground)]">
                                                    <FiUser className="h-6 w-6" aria-hidden="true" />
                                                    {reviewerProfiles[String(getReviewUserId(review))]?.profile_pic && (
                                                        <img
                                                            src={reviewerProfiles[String(getReviewUserId(review))].profile_pic}
                                                            alt={`${review.userName || "Customer"} profile`}
                                                            className="absolute inset-0 h-full w-full object-cover"
                                                            onError={(event) => {
                                                                event.currentTarget.style.display = "none";
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-[var(--foreground)] flex items-baseline gap-2">
                                                        <p className="font-bold">{review.userName || "Customer"}</p>
                                                        <span className="text-xs text-[var(--muted-foreground)]">
                                                            {formatReviewDate(review.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <StarRating rating={review.rating} size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            {isMyReview(review) && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleopenedit(review)}
                                                        aria-label="Edit your review"
                                                        title="Edit review"
                                                        className="flex h-8 w-8 items-center justify-center border border-gray-300 text-[var(--muted-foreground)] hover:border-[#FF6900] hover:bg-[#FF6900] hover:text-white duration-300 cursor-pointer"
                                                    >
                                                        <FiEdit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setReviewToDelete(review)}
                                                        aria-label="Delete your review"
                                                        title="Delete review"
                                                        className="flex h-8 w-8 items-center justify-center border border-gray-300 text-[var(--muted-foreground)] hover:border-red-600 hover:bg-red-600 hover:text-white duration-300 cursor-pointer"
                                                    >
                                                        <FiTrash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                        <p className="text-[15px] leading-relaxed text-[var(--foreground)]">
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {pagination?.hasNext && (
                                <div className="mt-8 text-center">
                                    <button
                                        type="button"
                                        disabled={feedbackloading}
                                        onClick={() => dispatch(getfeedbacks({ productId, page: pagination.page + 1, limit: pagination.limit }))}
                                        className="inline-flex items-center justify-center gap-2 border border-[#f2a46c] px-6 py-3 text-sm font-semibold text-[#e87c30] transition duration-300 hover:border-[#FF6900] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60" >
                                        {feedbackloading ? "Loading..." : "Load More Reviews"}
                                        <FaArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <FeedbackModal
                open={openfeedback}
                onClose={handleclosefeedback}
                onSubmit={handlesubmitfeedback}
                loading={submittingfeedback}
                initialRating={editingReview?.rating || 0}
                initialFeedback={editingReview?.comment || ""}
                title={editingReview ? "Edit your review" : "Rate this product"}
                subtitle={`Tell us what you think about ${product.name}.`}
                submitLabel={editingReview ? "Update Review" : "Submit Review"}
                placeholder="Tell us about the quality, freshness, packaging or anything you liked or disliked..."
            />


            <DeleteConfirmModal
                open={Boolean(reviewToDelete)}
                onClose={() => setReviewToDelete(null)}
                onConfirm={handleconfirmdelete}
                loading={deletingReview}
                title="Delete Review"
                message="Are you sure you want to delete your review? This action cannot be undone."
                confirmLabel="Delete"
            />

            {/* Footer */}
            <footer className="mt-20 border-t border-[var(--border)] bg-[var(--card)] px-6 pb-8 pt-20 md:px-12" />
        </div>
    );
};

export default ProductDetails;