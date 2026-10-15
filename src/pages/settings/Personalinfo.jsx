
import { useState, useRef } from "react";
import { Field, SectionCard, inputClass, primaryBtn, secondaryBtn } from "./Settingsui";

const GENDERS = ["female", "male", "other"];

const buildInitial = (profile) => {
    return {
        fullName: profile?.name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        dob: profile?.date_of_birth ? String(profile.date_of_birth).slice(0, 10) : "",
        gender: profile?.gender?.toLowerCase() || "",
    };
};

const PersonalInfo = ({ profile, onSave, saving = false }) => {
    const [values, setValues] = useState(() => buildInitial(profile));
    const [errors, setErrors] = useState({});
    const [profilePic, setProfilePic] = useState(profile?.profile_pic || "");
    const [previewPic, setPreviewPic] = useState("");
    const fileInputRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleProfilePicChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
            setErrors((prev) => ({ ...prev, profile_pic: "Choose a JPG, PNG, WEBP, or GIF image." }));
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, profile_pic: "Image size must be less than 5 MB." }));
            event.target.value = "";
            return;
        }

        setProfilePic(file);
        setPreviewPic(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, profile_pic: "" }));
    };

    const validate = () => {
        const next = {};

        if (!values.fullName.trim()) {
            next.fullName = "Full name is required";
        }

        const normalizedPhone = values.phone.trim().replace(/[\s-]/g, "");
        if (normalizedPhone && !/^(?:\+?91|0)?[6-9]\d{9}$/.test(normalizedPhone)) {
            next.phone = "Enter a valid phone number";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        await onSave({
            ...values,
            name: values.fullName.trim(),
            date_of_birth: values.dob,
            profile_pic: profilePic,
        });
    };

    const handleCancel = () => {
        setValues(buildInitial(profile));
        setProfilePic(profile?.profile_pic || "");
        setPreviewPic("");
        setErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <SectionCard id="profile-settings" title="Personal Information">
            <form onSubmit={handleSubmit}>
                {/* Profile Picture - Top Center */}
                <div className="flex flex-col items-center border-b border-gray-100 px-6 py-6">
                    <div className="relative">
                        <img
                            src={
                                previewPic ||
                                (typeof profilePic === "string" ? profilePic : "") ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    values.fullName || "User"
                                )}&background=e5e7eb&color=374151&size=160`
                            }
                            alt="Profile"
                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                            aria-label="Upload profile picture"
                            title="Change profile picture"
                        >
                            {/* Camera Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14 4h-4L8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
                                <circle cx="12" cy="13" r="3" />
                            </svg>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleProfilePicChange}
                            className="hidden"
                        />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                        JPG, PNG or other image formats · Max 5 MB
                    </p>
                    {errors.profile_pic && (
                        <p role="alert" className="mt-1 text-xs text-red-600">{errors.profile_pic}</p>
                    )}
                </div>

                <div className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
                    <Field label="Full Name" htmlFor="fullName" error={errors.fullName}>
                        <input
                            id="fullName"
                            name="fullName"
                            value={values.fullName}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter your name..."
                        />
                    </Field>

                    <Field label="Email Address" htmlFor="email">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            readOnly
                            className={inputClass}
                            aria-describedby="email-update-note"
                        />
                        <p id="email-update-note" className="mt-1 text-xs text-gray-500">
                            Email address cannot be changed here.
                        </p>
                    </Field>

                    <Field label="Phone Number" htmlFor="phone" error={errors.phone}>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={values.phone}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Enter your phone number..."
                        />
                    </Field>

                    <Field label="Date of Birth" htmlFor="dob">
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={values.dob}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Gender" htmlFor="gender">
                        <select
                            id="gender"
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select gender</option>
                            {GENDERS.map((gender) => (
                                <option key={gender} value={gender}>
                                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className={secondaryBtn}
                    >
                        Cancel
                    </button>

                    <button type="submit" disabled={saving} className={primaryBtn}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </SectionCard>
    );
};

export default PersonalInfo;