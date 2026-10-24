import { useEffect } from "react";
import { FiTrash2, FiX } from "react-icons/fi";

const DeleteConfirmModal = ({
    open,
    onClose,
    onConfirm,
    loading = false,
    title = "Delete Address",
    message = "Are you sure you want to delete this address? This action cannot be undone.",
    confirmLabel = "Delete",
}) => {
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

    if (!open) return null;

    return (
        <div
            className="dcm-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) onClose();
            }}
        >
            <style>{`
                @keyframes dcm-fade { from { opacity: 0 } to { opacity: 1 } }
                @keyframes dcm-pop {
                    from { opacity: 0; transform: translateY(12px) scale(0.96) }
                    to { opacity: 1; transform: translateY(0) scale(1) }
                }
                .dcm-backdrop { animation: dcm-fade 150ms ease-out }
                .dcm-card { animation: dcm-pop 200ms ease-out }
            `}</style>

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-message"
                className="dcm-card relative w-full max-w-md overflow-hidden border-t-4 border-red-600 bg-white shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                    className="absolute right-3 top-3 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                    <FiX className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center sm:px-8">
                    {/* Icon with soft ring */}
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <FiTrash2 className="h-7 w-7" />
                        </span>
                    </span>

                    <h2
                        id="delete-modal-title"
                        className="mt-5 text-xl font-bold tracking-tight text-gray-900"
                    >
                        {title}
                    </h2>
                    <p
                        id="delete-modal-message"
                        className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500"
                    >
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 cursor-pointer border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <FiTrash2 className="h-4 w-4" />
                                {confirmLabel}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;