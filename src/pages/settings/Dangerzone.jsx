import { FiTrash2 } from "react-icons/fi";
import { SectionCard } from "./Settingsui";

const DangerZone = ({ onDelete }) => (
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
                className="flex cursor-pointer items-center gap-2 border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
                <FiTrash2 className="h-3.5 w-3.5" />
                Delete Account
            </button>
        </div>
    </SectionCard>
);

export default DangerZone;