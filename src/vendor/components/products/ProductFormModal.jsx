import { useState } from "react";
import Modal from "../common/Modal";
import { PRODUCT_CATEGORIES } from "../../constants/navItems";

const EMPTY = { name: "", category: PRODUCT_CATEGORIES[0], price: "", stock: "" };
const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function ProductFormModal({ open, saving, onClose, onSubmit }) {
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleClose = () => {
        setForm(EMPTY);
        setErrors({});
        onClose();
    };

    const handleSubmit = async () => {
        const next = {};
        if (!form.name.trim()) next.name = "Enter a product name";
        if (!(Number(form.price) > 0)) next.price = "Enter a price above 0";
        if (form.stock === "" || Number(form.stock) < 0) next.stock = "Enter the stock quantity";
        setErrors(next);
        if (Object.keys(next).length) return;

        const ok = await onSubmit({
            name: form.name.trim(),
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
            emoji: "🛒",
        });
        if (ok) handleClose();
    };

    return (
        <Modal open={open} title="Add product" onClose={handleClose}>
            <div className="space-y-4">
                <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Product name</span>
                    <input className={inputClass} value={form.name} onChange={update("name")} placeholder="e.g. Organic Carrots 500g" />
                    {errors.name && <span className="mt-1 block text-xs text-red-500">{errors.name}</span>}
                </label>

                <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Category</span>
                    <select className={inputClass} value={form.category} onChange={update("category")}>
                        {PRODUCT_CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Price ($)</span>
                        <input type="number" min="0" step="0.01" className={inputClass} value={form.price} onChange={update("price")} />
                        {errors.price && <span className="mt-1 block text-xs text-red-500">{errors.price}</span>}
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Stock</span>
                        <input type="number" min="0" className={inputClass} value={form.stock} onChange={update("stock")} />
                        {errors.stock && <span className="mt-1 block text-xs text-red-500">{errors.stock}</span>}
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={handleClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                        {saving ? "Adding..." : "Add product"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
