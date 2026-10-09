import { useEffect, useRef, useState } from "react";
import { FiBriefcase, FiHome, FiMapPin, FiX } from "react-icons/fi";

// Hides the scrollbar in all browsers (Tailwind 3.1+)
const hideScrollbar = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export const emptyAddress = {
    full_name: "",
    phone: "",
    building_number: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    address_type: "Home",
    is_default: false,
};

const addressTypes = [
    { value: "Home", icon: FiHome },
    { value: "Office", icon: FiBriefcase },
    { value: "Other", icon: FiMapPin },
];

const inputClass = (hasError) =>
    `w-full border bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${hasError ? "border-red-400" : "border-gray-200"
    }`;

const Field = ({ label, error, required = false, className = "", children }) => (
    <div className={className}>
        <label className="mb-1.5 block text-xs font-semibold text-gray-900">
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const validate = (values) => {
    const errors = {};
    const phoneDigits = values.phone.replace(/\D/g, "");

    if (!values.full_name.trim()) errors.full_name = "Full name is required";

    if (!values.phone.trim()) errors.phone = "Phone number is required";
    else if (phoneDigits.length < 10 || phoneDigits.length > 15) errors.phone = "Enter a valid phone number";

    if (!values.building_number.trim()) errors.building_number = "Building / house no. is required";
    if (!values.street.trim()) errors.street = "Street is required";
    if (!values.city.trim()) errors.city = "City is required";
    if (!values.state.trim()) errors.state = "State is required";
    if (!values.country.trim()) errors.country = "Country is required";

    if (!values.pincode.trim()) errors.pincode = "Pincode is required";
    else if (values.country.trim().toLowerCase() === "india" && !/^\d{6}$/.test(values.pincode.trim())) {
        errors.pincode = "Enter a valid 6-digit pincode";
    } else if (!/^[A-Za-z0-9 -]{3,10}$/.test(values.pincode.trim())) {
        errors.pincode = "Enter a valid pincode";
    }

    return errors;
};

/**
 * Reusable address modal (add + edit).
 *
 * Props
 * - open:        boolean, show / hide the modal
 * - onClose:     () => void
 * - onSubmit:    (values) => void | Promise  -> values has the exact backend fields:
 *                full_name, phone, building_number, street, landmark, city,
 *                state, pincode, country, address_type, is_default
 * - initialData: optional address object, pass it to open the modal in edit mode
 * - loading:     boolean, disables the form while saving
 * - title:       optional, overrides the default heading
 * - submitLabel: optional, overrides the default button text
 */
const AddressModal = ({
    open,
    onClose,
    onSubmit,
    initialData = null,
    loading = false,
    title,
    submitLabel,
}) => {
    const [values, setValues] = useState(emptyAddress);
    const [errors, setErrors] = useState({});
    const firstInputRef = useRef(null);
    const isEdit = Boolean(initialData);

    // reset the form every time the modal opens
    useEffect(() => {
        if (open) {
            setValues({ ...emptyAddress, ...(initialData || {}) });
            setErrors({});
            const timer = window.setTimeout(() => firstInputRef.current?.focus(), 50);
            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [open, initialData]);

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

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        let next = type === "checkbox" ? checked : value;

        if (name === "phone") next = value.replace(/[^\d+\s-]/g, "");
        if (name === "pincode") next = value.slice(0, 10);

        setValues((prev) => ({ ...prev, [name]: next }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validate(values);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        await onSubmit({
            ...values,
            full_name: values.full_name.trim(),
            phone: values.phone.trim(),
            building_number: values.building_number.trim(),
            street: values.street.trim(),
            landmark: values.landmark.trim(),
            city: values.city.trim(),
            state: values.state.trim(),
            pincode: values.pincode.trim(),
            country: values.country.trim(),
        });
    };

    return (
        <div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="address-modal-title"
                className="flex max-h-[86vh] w-full max-w-xl flex-col overflow-hidden bg-white shadow-lg"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <FiMapPin className="h-4 w-4" />
                        </span>
                        <div>
                            <h2 id="address-modal-title" className="text-base font-bold text-gray-900">
                                {title || (isEdit ? "Edit Address" : "Add New Address")}
                            </h2>
                            <p className="text-xs text-slate-400">Fields marked * are required</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
                    <div className={`flex-1 space-y-4 overflow-y-auto px-5 py-5 ${hideScrollbar}`}>
                        {/* Address type */}
                        <Field label="Address Type">
                            <div className="flex gap-2">
                                {addressTypes.map(({ value, icon: Icon }) => {
                                    const selected = values.address_type === value;
                                    return (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setValues((prev) => ({ ...prev, address_type: value }))}
                                            aria-pressed={selected}
                                            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border py-2 text-xs font-semibold transition-colors ${selected
                                                ? "border-emerald-500 bg-[#dff7e9] text-emerald-700"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Full Name" required error={errors.full_name}>
                                <input
                                    ref={firstInputRef}
                                    type="text"
                                    name="full_name"
                                    value={values.full_name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    placeholder="e.g. John Doe"
                                    className={inputClass(errors.full_name)}
                                />
                            </Field>
                            <Field label="Phone Number" required error={errors.phone}>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    placeholder="e.g. +91 98765 43210"
                                    className={inputClass(errors.phone)}
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Building / House No." required error={errors.building_number}>
                                <input
                                    type="text"
                                    name="building_number"
                                    value={values.building_number}
                                    onChange={handleChange}
                                    placeholder="e.g. 4B, Green Heights"
                                    className={inputClass(errors.building_number)}
                                />
                            </Field>
                            <Field label="Street" required error={errors.street}>
                                <input
                                    type="text"
                                    name="street"
                                    value={values.street}
                                    onChange={handleChange}
                                    autoComplete="address-line1"
                                    placeholder="e.g. Green Meadow Lane"
                                    className={inputClass(errors.street)}
                                />
                            </Field>
                        </div>

                        <Field label="Landmark (optional)" error={errors.landmark}>
                            <input
                                type="text"
                                name="landmark"
                                value={values.landmark}
                                onChange={handleChange}
                                placeholder="e.g. Near City Mall"
                                className={inputClass(errors.landmark)}
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="City" required error={errors.city}>
                                <input
                                    type="text"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    autoComplete="address-level2"
                                    placeholder="e.g. Hyderabad"
                                    className={inputClass(errors.city)}
                                />
                            </Field>
                            <Field label="State" required error={errors.state}>
                                <input
                                    type="text"
                                    name="state"
                                    value={values.state}
                                    onChange={handleChange}
                                    autoComplete="address-level1"
                                    placeholder="e.g. Telangana"
                                    className={inputClass(errors.state)}
                                />
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Pincode" required error={errors.pincode}>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="pincode"
                                    value={values.pincode}
                                    onChange={handleChange}
                                    autoComplete="postal-code"
                                    placeholder="e.g. 500001"
                                    className={inputClass(errors.pincode)}
                                />
                            </Field>
                            <Field label="Country" required error={errors.country}>
                                <input
                                    type="text"
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                    autoComplete="country-name"
                                    placeholder="e.g. India"
                                    className={inputClass(errors.country)}
                                />
                            </Field>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                name="is_default"
                                checked={values.is_default}
                                onChange={handleChange}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-emerald-600"
                            />
                            Make this my default address
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 border-t border-gray-100 bg-white px-5 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 cursor-pointer border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-yellow-600 hover:bg-gray-50 hover:text-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 cursor-pointer py-2.5 text-sm font-semibold border border-green-500 text-green-600 transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70 hover:text-white duration-300"
                        >
                            {loading ? "Saving..." : submitLabel || (isEdit ? "Update Address" : "Save Address")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;