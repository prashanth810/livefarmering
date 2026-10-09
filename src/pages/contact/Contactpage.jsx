import { useState } from "react";
import { FiChevronDown, FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import { showSuccessToast, showWarningToast } from "../../components/Toast";

const contactCards = [
    {
        title: "Headquarters",
        icon: FiMapPin,
        lines: ["123 Green Valley Road", "Freshville, CA 90210, United States"],
    },
    {
        title: "Phone Support",
        icon: FiPhone,
        lines: ["+1 (800) 123-4567", "Mon - Fri, 8:00 AM - 6:00 PM"],
    },
    {
        title: "Email Us",
        icon: FiMail,
        lines: ["support@greenleaf.com", "vendors@greenleaf.com"],
    },
];

const subjects = [
    "Order Issue",
    "Become a Vendor",
    "Delivery Question",
    "Payment & Refunds",
    "Feedback",
    "Other",
];

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
};

const inputBase =
    "w-full border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";

const Field = ({ label, error, children, className = "" }) => (
    <div className={className}>
        <label className="mb-1.5 block text-sm font-medium text-gray-500">{label}</label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const ContactPage = () => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.firstName.trim()) newErrors.firstName = "First name is required";
        if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!form.subject) newErrors.subject = "Please select a topic";

        if (!form.message.trim()) {
            newErrors.message = "Message is required";
        } else if (form.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showWarningToast("Please fix the highlighted fields");
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        setSending(true);
        try {
            // TODO: replace with your API call, e.g. await handlesendcontact(form)
            await new Promise((resolve) => setTimeout(resolve, 800));
            showSuccessToast("Message sent! We'll get back to you soon.");
            setForm(initialForm);
            setErrors({});
        } finally {
            setSending(false);
        }
    };

    return (
        <main className="bg-[#f6f7f5] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
                {/* Heading */}
                <header className="mx-auto mb-10 max-w-xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Contact Us
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                        Have a question about your order, want to become a vendor, or just want to
                        say hi? We&apos;re always here to help you out.
                    </p>
                </header>

                <div className="grid items-start gap-8 lg:grid-cols-[5fr_6fr]">
                    {/* Info cards */}
                    <div className="flex flex-col gap-y-6">
                        {contactCards.map(({ title, icon: Icon, lines }) => (
                            <div
                                key={title}
                                className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-green-50 text-emerald-600 border border-green-50">
                                    <Icon className="h-[18px] w-[18px]" />
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-sm font-bold text-gray-900">{title}</h2>
                                    <div className="mt-1.5 space-y-1">
                                        {lines.map((line) => (
                                            <p key={line} className="break-words text-xs text-slate-400">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form card */}
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="rounded-lg border border-gray-200 bg-white p-6 sm:p-8"
                    >
                        <h2 className="mb-6 text-lg font-bold text-gray-900">Send us a message</h2>

                        <div className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="First Name" error={errors.firstName}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="e.g. John"
                                        className={`${inputBase} ${errors.firstName ? "border-red-400" : "border-gray-200"}`}
                                    />
                                </Field>
                                <Field label="Last Name" error={errors.lastName}>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g. Doe"
                                        className={`${inputBase} ${errors.lastName ? "border-red-400" : "border-gray-200"}`}
                                    />
                                </Field>
                            </div>

                            <Field label="Email Address" error={errors.email}>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="john.doe@example.com"
                                    className={`${inputBase} ${errors.email ? "border-red-400" : "border-gray-200"}`}
                                />
                            </Field>

                            <Field label="Subject" error={errors.subject}>
                                <div className="relative">
                                    <select
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        className={`${inputBase} cursor-pointer appearance-none pr-10 ${form.subject ? "text-gray-800" : "text-gray-400"
                                            } ${errors.subject ? "border-red-400" : "border-gray-200"}`}
                                    >
                                        <option value="" disabled>
                                            Select a topic
                                        </option>
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject} className="text-gray-800">
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            </Field>

                            <Field label="Message" error={errors.message}>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="How can we help you today?"
                                    className={`${inputBase} resize-none ${errors.message ? "border-red-400" : "border-gray-200"}`}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={sending}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {sending ? "Sending..." : "Send Message"}
                                {!sending && <FiSend className="h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ContactPage;