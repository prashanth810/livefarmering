import { useState } from "react";
import { SectionCard, Toggle } from "./Settingsui";

const PREFS = [
    { key: "orders", title: "Order Updates", desc: "Get notified when your order status changes", on: true },
    { key: "promos", title: "Promotional Emails", desc: "Receive deals, offers and exclusive discounts", on: true },
    { key: "sms", title: "SMS Notifications", desc: "Get delivery updates via text message", on: false },
    { key: "newsletter", title: "Newsletter", desc: "Weekly fresh tips, recipes and farm news", on: false },
];

const NotificationPrefs = ({ onChange }) => {
    const [values, setValues] = useState(() => Object.fromEntries(PREFS.map((p) => [p.key, p.on])));

    const handleToggle = (key) => {
        const next = !values[key];
        setValues((prev) => ({ ...prev, [key]: next }));
        onChange?.(key, next);
    };

    return (
        <SectionCard id="notifications" title="Notification Preferences">
            <ul className="divide-y divide-gray-100">
                {PREFS.map((pref) => (
                    <li key={pref.key} className="flex items-center justify-between gap-4 px-6 py-4">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{pref.title}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{pref.desc}</p>
                        </div>
                        <Toggle checked={values[pref.key]} onChange={() => handleToggle(pref.key)} label={pref.title} />
                    </li>
                ))}
            </ul>
        </SectionCard>
    );
};

export default NotificationPrefs;