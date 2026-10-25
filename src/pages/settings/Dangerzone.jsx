import { FiTrash2 } from "react-icons/fi";
import { SectionCard } from "./Settingsui";

const DangerZone = ({
    onDelete,
    confirmWord = "DELETE",   // word the user must type
    confirmValue = "",        // typed text (state from parent)
    onConfirmChange,          // pass this to show the input
    loading = false,
}) => {
    const showInput = typeof onConfirmChange === "function";
    const disabled = loading || (showInput && confirmValue !== confirmWord);

    return (
        <SectionCard id="danger-zone" title="Danger Zone" danger>
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Permanently delete your account and all data. This cannot be undone.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onDelete}
                    disabled={disabled}
                    className="flex cursor-pointer items-center gap-2 border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-50 disabled:hover:text-red-600"
                >
                    <FiTrash2 className="h-3.5 w-3.5" />
                    {loading ? "Deleting..." : "Delete Account"}
                </button>

                {showInput && (
                    <div className="w-full">
                        <label htmlFor="delete-confirm" className="text-xs text-gray-600">
                            Type <strong>{confirmWord}</strong> to enable the delete button
                        </label>
                        <input
                            id="delete-confirm"
                            type="text"
                            value={confirmValue}
                            onChange={(e) => onConfirmChange(e.target.value)}
                            autoComplete="off"
                            placeholder={confirmWord}
                            className="mt-2 w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-red-400 sm:max-w-xs"
                        />
                    </div>
                )}
            </div>
        </SectionCard>
    );
};

export default DangerZone;