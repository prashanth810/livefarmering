import { FiPlus } from "react-icons/fi";

export default function AddProductButton({ onClick }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            <FiPlus size={16} />
            Add Product
        </button>
    );
}
