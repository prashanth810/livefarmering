import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";

const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500";

export default function SettingsPage() {
    const [form, setForm] = useState({
        platformName: "Freshies",
        supportEmail: "support@greenleaf.com",
        commission: 8,
        autoApprove: false,
    });

    const update = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

    const save = () => toast.success("Settings saved");

    return (
        <>
            <PageHeader title="Settings" subtitle="Platform-wide preferences for the admin team." />
            <Card title="General" className="max-w-2xl">
                <div className="space-y-4">
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Platform name</span>
                        <input className={inputClass} value={form.platformName} onChange={update("platformName")} />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Support email</span>
                        <input type="email" className={inputClass} value={form.supportEmail} onChange={update("supportEmail")} />
                    </label>
                    <label className="block text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Vendor commission (%)</span>
                        <input type="number" min="0" max="100" className={inputClass} value={form.commission} onChange={update("commission")} />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" checked={form.autoApprove} onChange={update("autoApprove")} className="h-4 w-4 accent-emerald-600" />
                        Auto-approve vendors with verified documents
                    </label>
                    <button type="button" onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                        Save changes
                    </button>
                </div>
            </Card>
        </>
    );
}
