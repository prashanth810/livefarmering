import { useEffect, useState } from "react";
import { FiInfo, FiMapPin, FiTruck, FiX, FiXCircle } from "react-icons/fi";

const MAX_LENGTH = 300;

const CancelOrderModal = ({
    open,
    onClose,
    onSubmit,
    loading = false,
    image, // optional: pass your rider illustration, e.g. image={riderImg}
}) => {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    // start fresh every time the modal opens
    useEffect(() => {
        if (open) {
            setReason("");
            setError("");
        }
    }, [open]);

    // close on Escape
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, loading, onClose]);

    if (!open) return null;

    const close = () => {
        if (loading) return;
        onClose();
    };

    const submit = () => {
        if (loading) return;
        const trimmed = reason.trim();
        if (!trimmed) {
            setError("Please enter a reason for cancellation.");
            return;
        }
        onSubmit(trimmed);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
            onClick={close}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-title"
                className="relative max-h-full w-full max-w-4xl overflow-y-auto bg-gradient-to-br from-orange-50 via-white to-orange-50/40"
                onClick={(e) => e.stopPropagation()}
            >
                {/* close (X) */}
                <button
                    type="button"
                    onClick={close}
                    disabled={loading}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition hover:bg-orange-200 disabled:opacity-60"
                >
                    <FiX className="h-6 w-6" />
                </button>

                {/* top: illustration + text */}
                <div className="grid items-center gap-4 px-6 pb-6 pt-8 md:grid-cols-2 md:px-10">
                    <div className="relative flex h-40 items-center justify-center md:h-56">
                        {image ? (
                            <img
                                src={image}
                                alt=""
                                draggable={false}
                                className="h-full w-full select-none object-contain"
                            />
                        ) : (
                            <div className="relative flex h-full w-full items-center justify-center">
                                <span className="flex h-28 w-28 items-center justify-center rounded-full bg-orange-100 text-orange-500 md:h-36 md:w-36">
                                    <FiTruck className="h-14 w-14 md:h-20 md:w-20" />
                                </span>
                                <FiMapPin className="absolute right-6 top-2 h-10 w-10 text-orange-500 md:right-10" />
                            </div>
                        )}
                    </div>

                    <div className="md:pr-10">
                        <h3 id="cancel-title" className="text-xl font-bold text-gray-900 md:text-3xl">
                            <span className="text-orange-600">Cancel</span> this Order?
                        </h3>
                        <p className="mt-3 text-base text-gray-500">
                            Your order will be cancelled and the restaurant will be notified.
                        </p>

                        <div className="mt-5 flex items-start gap-3 bg-orange-100/60 px-4 py-3">
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                                <FiInfo className="h-4 w-4" />
                            </span>
                            <p className="text-sm text-orange-900">
                                Once cancelled, your order cannot be restored.
                            </p>
                        </div>
                    </div>
                </div>

                {/* bottom: reason + buttons */}
                <div className="mx-3 mb-3 rounded-lg bg-white p-5 md:mx-6 md:mb-6">
                    <div className="flex items-center justify-between">
                        <label htmlFor="cancel-reason" className="text-base font-medium text-gray-900">
                            Reason for cancellation <span className="text-orange-600">*</span>
                        </label>
                        <span className="text-sm text-gray-500">
                            {reason.length}/{MAX_LENGTH}
                        </span>
                    </div>

                    <textarea
                        id="cancel-reason"
                        rows={4}
                        maxLength={MAX_LENGTH}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError("");
                        }}
                        disabled={loading}
                        placeholder="Tell us why you want to cancel..."
                        className={`mt-3 w-full resize-none border bg-orange-50/50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 ${error ? "border-red-500" : "border-orange-300"
                            }`}
                    />
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={close}
                            disabled={loading}
                            className="border border-gray-300 bg-white py-3.5 text-base font-bold text-gray-900 transition hover:bg-gray-50 disabled:opacity-60"
                        >
                            Keep Order
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-400 to-orange-600 py-3.5 text-base font-bold text-white shadow-orange-200 transition hover:from-orange-500 hover:to-orange-700 disabled:opacity-60"
                        >
                            <FiXCircle className="h-6 w-6" />
                            {loading ? "Cancelling..." : "Cancel Order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;