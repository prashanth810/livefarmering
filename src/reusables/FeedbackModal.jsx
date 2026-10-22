import { useCallback, useEffect, useId, useRef, useState } from "react";
import { FiSend, FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const MAX_STARS = 5;

export const getRatingLabel = (value) => {
    if (value <= 0) return "Tap to rate";
    if (value <= 1) return "Very Poor";
    if (value <= 2) return "Poor";
    if (value <= 3) return "Average";
    if (value <= 4) return "Good";
    return "Excellent";
};

/* ------------------------------------------------------------------ */
/*  Star (supports full / half / empty)                                */
/* ------------------------------------------------------------------ */

const STAR_PATH =
    "M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8L12 2.6z";

const Star = ({ fill }) => {
    // fill: 0 .. 1  (0 = empty, 0.5 = half, 1 = full)
    const uid = useId().replace(/:/g, "");
    const goldId = `gold-${uid}`;
    const clipId = `clip-${uid}`;

    return (
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
            <defs>
                <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFC83D" />
                    <stop offset="100%" stopColor="#F5A100" />
                </linearGradient>
                <clipPath id={clipId}>
                    <rect x="0" y="0" width={24 * fill} height="24" />
                </clipPath>
            </defs>
            {/* empty base */}
            <path d={STAR_PATH} fill="#D9DCE1" stroke="#D9DCE1" strokeWidth="1.2" strokeLinejoin="round" />
            {/* filled part */}
            {fill > 0 && (
                <path
                    d={STAR_PATH}
                    fill={`url(#${goldId})`}
                    stroke={`url(#${goldId})`}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    clipPath={`url(#${clipId})`}
                />
            )}
        </svg>
    );
};

/* ------------------------------------------------------------------ */
/*  Star rating input (half-star steps, mouse + touch + keyboard)      */
/* ------------------------------------------------------------------ */

const StarRating = ({ value, onChange, disabled = false }) => {
    const [hover, setHover] = useState(0);
    const shown = hover || value;

    const getValueFromEvent = (event, index) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const isLeftHalf = event.clientX - rect.left < rect.width / 2;
        return index + (isLeftHalf ? 0.5 : 1);
    };

    const onKeyDown = (event) => {
        if (disabled) return;
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            onChange(Math.min(MAX_STARS, value + 0.5));
        } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            onChange(Math.max(0.5, value - 0.5));
        } else if (event.key === "Home") {
            event.preventDefault();
            onChange(0.5);
        } else if (event.key === "End") {
            event.preventDefault();
            onChange(MAX_STARS);
        }
    };

    return (
        <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="Rating"
            aria-valuemin={0.5}
            aria-valuemax={MAX_STARS}
            aria-valuenow={value}
            aria-valuetext={`${value} out of ${MAX_STARS}, ${getRatingLabel(value)}`}
            aria-disabled={disabled}
            onKeyDown={onKeyDown}
            onMouseLeave={() => setHover(0)}
            className="flex items-center justify-center gap-2.5 rounded-xl py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 sm:gap-3.5"
        >
            {Array.from({ length: MAX_STARS }, (_, index) => {
                const fill = Math.max(0, Math.min(1, shown - index));
                return (
                    <button
                        key={index}
                        type="button"
                        tabIndex={-1}
                        disabled={disabled}
                        aria-label={`Rate ${index + 1} star${index ? "s" : ""}`}
                        onMouseMove={(event) => !disabled && setHover(getValueFromEvent(event, index))}
                        onClick={(event) => onChange(getValueFromEvent(event, index))}
                        className="h-10 w-10 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 disabled:cursor-not-allowed sm:h-[52px] sm:w-[52px]"
                    >
                        <Star fill={fill} />
                    </button>
                );
            })}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  Illustration (inline SVG – no external assets needed)              */
/* ------------------------------------------------------------------ */

const OrderIllustration = () => (
    <svg viewBox="0 0 260 170" className="h-full w-full" aria-hidden="true">
        {/* soft blob */}
        <path
            d="M38 78C30 40 62 14 108 16c28 1 40-10 68 0 34 12 62 40 54 78-6 30-30 50-74 54-34 3-52 8-82 0-36-10-68-32-36-70z"
            fill="#FFF1C2"
        />
        {/* confetti */}
        <g fill="#F5B921">
            <rect x="56" y="30" width="5" height="16" rx="2.5" transform="rotate(-30 58 38)" />
            <rect x="40" y="62" width="5" height="14" rx="2.5" transform="rotate(-20 42 69)" />
            <rect x="212" y="42" width="5" height="16" rx="2.5" transform="rotate(35 214 50)" />
            <path d="M92 22l2.2 4.6 4.6 2.2-4.6 2.2L92 35.6l-2.2-4.6-4.6-2.2 4.6-2.2z" />
            <path d="M196 20l1.8 3.8 3.8 1.8-3.8 1.8L196 31l-1.8-3.6-3.8-1.8 3.8-1.8z" />
        </g>
        <rect x="116" y="26" width="4" height="12" rx="2" fill="#F08A24" transform="rotate(25 118 32)" />

        {/* paper bag – back fold */}
        <path d="M96 52h74v96H96z" fill="#C99468" />
        {/* paper bag – front */}
        <path d="M82 60l14-8h58l14 8v90H82z" fill="#E3B183" />
        <path d="M154 52l14 8v90h-14z" fill="#C99468" opacity=".55" />
        <path d="M82 60h86" stroke="#C99468" strokeWidth="2" />
        <path d="M82 66h86" stroke="#F0C79C" strokeWidth="1.5" opacity=".8" />

        {/* chef-hat badge */}
        <g
            fill="none"
            stroke="#B77B4B"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M104 106c-8-1-12-8-10-14s9-9 15-5c2-7 12-9 17-3 5-6 15-4 17 3 6-4 14-1 15 5s-2 13-10 14" />
            <path d="M107 106v14h50v-14" />
            <path d="M107 112h50" />
        </g>

        {/* back leaves */}
        <path d="M196 78c18-6 34 4 36 24-18 4-34-6-36-24z" fill="#4F8A3C" />
        <path d="M196 78c12 6 24 14 36 24" stroke="#3A6E2C" strokeWidth="1.8" fill="none" />
        <path d="M208 120c14-14 30-12 38 4-16 10-32 8-38-4z" fill="#6AA84F" />

        {/* coconut / nut */}
        <ellipse cx="214" cy="142" rx="11" ry="12" fill="#8A5A3B" />
        <ellipse cx="211" cy="138" rx="4" ry="5" fill="#A8734E" opacity=".7" />

        {/* bowl */}
        <path d="M30 122h124c0 24-22 40-62 40s-62-16-62-40z" fill="#B8552E" />
        <path d="M30 122h124c0 4-1 8-3 12H33c-2-4-3-8-3-12z" fill="#D2693B" />
        <path d="M44 150c14 8 28 10 48 10" stroke="#8E3E20" strokeWidth="2" fill="none" opacity=".5" />

        {/* rice mound */}
        <ellipse cx="92" cy="118" rx="58" ry="16" fill="#F7EBD0" />
        <path d="M40 118c8-22 30-30 52-30s44 8 52 30z" fill="#F4E3BE" />
        <g fill="#FFF8E6">
            <ellipse cx="62" cy="108" rx="4" ry="2" transform="rotate(-20 62 108)" />
            <ellipse cx="78" cy="100" rx="4" ry="2" transform="rotate(15 78 100)" />
            <ellipse cx="110" cy="104" rx="4" ry="2" transform="rotate(-10 110 104)" />
            <ellipse cx="126" cy="112" rx="4" ry="2" transform="rotate(25 126 112)" />
            <ellipse cx="94" cy="112" rx="4" ry="2" />
        </g>
        {/* shrimp */}
        <g fill="#F08A3C">
            <path d="M58 96c4-8 14-10 20-4 4 4 2 10-4 12-8 2-14-2-16-8z" />
            <path d="M92 90c6-8 18-8 22-1 3 5-1 10-7 11-8 1-14-3-15-10z" />
        </g>
        <path d="M62 98c4-3 9-3 13 0M96 93c4-3 9-3 13 0" stroke="#C9631F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* herbs */}
        <g fill="#6AA84F">
            <path d="M124 92c10-6 20 0 22 10-10 4-20-2-22-10z" />
            <path d="M48 104c-8-8-4-20 6-22 4 10 0 20-6 22z" />
        </g>
        {/* front leaf */}
        <path d="M24 112c-4-14 4-26 18-26 2 14-6 26-18 26z" fill="#4F8A3C" />
    </svg>
);

const FeedbackModal = ({
    open,
    onClose,
    onSubmit,
    loading = false,
    title = "How was your order?",
    subtitle = "We’d love to hear your feedback to help us serve you better.",
    initialRating = 4.5,
    initialFeedback = "",
    maxLength = 500,
    placeholder = "Tell us about the food quality, delivery experience or anything you liked or disliked...",
    submitLabel = "Submit Feedback",
    cancelLabel = "Cancel",
    ratingLabel = "Rate your experience",
    feedbackLabel = "Your feedback",
}) => {
    const [rating, setRating] = useState(initialRating);
    const [feedback, setFeedback] = useState(initialFeedback);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const textareaRef = useRef(null);
    const titleId = useId();

    // reset the form every time the modal opens
    useEffect(() => {
        if (!open) return;
        setRating(initialRating);
        setFeedback(initialFeedback);
        setErrors({});
        setSubmitError("");
    }, [open, initialRating, initialFeedback]);

    // close on Escape + lock body scroll while open
    useEffect(() => {
        if (!open) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape" && !loading) onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, loading, onClose]);

    const handleRatingChange = useCallback((value) => {
        setRating(value);
        setErrors((prev) => ({ ...prev, rating: undefined }));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;

        const nextErrors = {};
        if (!rating) nextErrors.rating = "Please select a rating";
        if (!feedback.trim()) nextErrors.feedback = "Please share your feedback";

        setErrors(nextErrors);
        setSubmitError("");
        if (Object.keys(nextErrors).length) {
            if (nextErrors.feedback) textareaRef.current?.focus();
            return;
        }

        try {
            await onSubmit?.({ rating, feedback: feedback.trim() });
        } catch (error) {
            setSubmitError(error?.message || "Something went wrong. Please try again.");
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3 sm:p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) onClose();
            }}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onSubmit={handleSubmit}
                noValidate
                className="relative max-h-[95vh] w-full max-w-[520px] overflow-y-auto bg-white shadow-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {/* close */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:right-4 sm:top-4"
                >
                    <FiX className="h-5 w-5" />
                </button>

                <div className="px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                    {/* header */}
                    <div className="flex items-center gap-3 pr-10 sm:gap-5">
                        <div className="h-[104px] w-[150px] shrink-0 sm:h-[130px] sm:w-[200px]">
                            <OrderIllustration />
                        </div>
                        <div className="min-w-0">
                            <h2
                                id={titleId}
                                className="text-lg font-semibold font-mono leading-tight text-slate-900 sm:text-lg"
                            >
                                {title}
                            </h2>
                            <p className="mt-1.5 text-[13px] leading-snug text-slate-500 sm:text-sm">{subtitle}</p>
                        </div>
                    </div>

                    {/* rating */}
                    <div className="mt-5">
                        <div className="flex items-center justify-between gap-3">
                            <label className="text-sm text-gray-600 sm:text-sm">
                                {ratingLabel}
                                <span className="ml-0.5 text-red-500">*</span>
                            </label>

                            <div
                                aria-live="polite"
                                className="flex items-center gap-2 rounded-xl bg-amber-50 py-1.5 pl-1.5 pr-3 text-sm ring-1 ring-amber-100"
                            >
                                <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 font-bold text-amber-900">
                                    {rating ? rating.toFixed(1) : "0.0"} / {MAX_STARS}
                                </span>
                                <span className="font-semibold text-amber-950">{getRatingLabel(rating)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <StarRating value={rating} onChange={handleRatingChange} disabled={loading} />
                        </div>
                        {errors.rating && <p className="mt-1 text-center text-xs text-red-500">{errors.rating}</p>}
                    </div>

                    {/* feedback */}
                    <div className="mt-5">
                        <label htmlFor={`${titleId}-feedback`} className="mb-2 block text-sm  text-gray-600 sm:text-sm">
                            {feedbackLabel}
                            <span className="ml-0.5 text-red-500">*</span>
                        </label>
                        <textarea
                            id={`${titleId}-feedback`}
                            ref={textareaRef}
                            rows={4}
                            value={feedback}
                            maxLength={maxLength}
                            disabled={loading}
                            placeholder={placeholder}
                            onChange={(event) => {
                                setFeedback(event.target.value);
                                if (errors.feedback) setErrors((prev) => ({ ...prev, feedback: undefined }));
                            }}
                            className={`w-full resize-none border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400/30 focus:border-amber-100 disabled:bg-gray-50 sm:text-[15px] ${errors.feedback ? "border-red-400" : "border-gray-200"
                                }`}
                        />
                        <div className="mt-1 flex items-start justify-between gap-3">
                            <p className="text-xs text-red-500">{errors.feedback || ""}</p>
                            <span className="shrink-0 text-xs text-slate-400">
                                {feedback.length}/{maxLength}
                            </span>
                        </div>
                    </div>

                    {submitError && (
                        <p role="alert" className="mt-2 bg-red-50 px-3 py-2 text-xs text-red-600">
                            {submitError}
                        </p>
                    )}

                    {/* actions */}
                    <div className="mt-4 flex gap-3 sm:gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 cursor-pointer border border-gray-200 bg-gradient-to-b from-gray-50 to-gray-200/70 py-3 text-sm font-bold text-slate-900 transition-colors hover:from-gray-100 hover:to-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex flex-[1.4] cursor-pointer items-center justify-center gap-2.5 bg-gradient-to-b from-amber-300 to-amber-500 py-3 text-sm font-bold text-slate-900 shadow-sm shadow-amber-500/30 transition hover:from-amber-300 hover:to-amber-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FiSend className="h-[18px] w-[18px]" />
                                    {submitLabel}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FeedbackModal;