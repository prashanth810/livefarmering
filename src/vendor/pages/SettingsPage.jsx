import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";

const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function SettingsPage() {
    const [form, setForm] = useState({
        storeName: "Daily Fresh Store",
        email: "store@dailyfresh.com",
        phone: "",
        address: "",
        acceptingOrders: true,
    });

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    return (
        <>
            <PageHeader title="Shop Settings" subtitle="Update your store details." />
            <Card title="Store details" className="max-w-2xl">
                <div className="space-y-4">
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Store name</span>
                        <input className={inputClass} value={form.storeName} onChange={update("storeName")} />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Contact email</span>
                        <input type="email" className={inputClass} value={form.email} onChange={update("email")} />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Phone</span>
                        <input className={inputClass} value={form.phone} onChange={update("phone")} />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Pickup address</span>
                        <textarea rows={3} className={inputClass} value={form.address} onChange={update("address")} />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" checked={form.acceptingOrders} onChange={update("acceptingOrders")} className="h-4 w-4 accent-emerald-600" />
                        Accepting new orders
                    </label>
                    <button type="button" onClick={() => toast.success("Settings saved")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                        Save changes
                    </button>
                </div>
            </Card>
        </>
    );
}
