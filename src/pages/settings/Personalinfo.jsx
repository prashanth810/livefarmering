import { useState } from "react";
import { Field, SectionCard, inputClass, primaryBtn, secondaryBtn } from "./Settingsui";

const GENDERS = ["Female", "Male", "Other"];

const buildInitial = (profile) => {
    const [firstName = "", ...rest] = (profile?.name || "").trim().split(/\s+/);
    return {
        firstName,
        email: profile?.email || "",
        phone: profile?.phone || "",
        dob: profile?.dob ? String(profile.dob).slice(0, 10) : "",
        gender: profile?.gender || "",
    };
};

const PersonalInfo = ({ profile, onSave }) => {
    const [values, setValues] = useState(() => buildInitial(profile));
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!values.firstName.trim()) next.firstName = "First name is required";
        if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = "Enter a valid email address";
        if (values.phone && !/^\+?[0-9\s-]{10,15}$/.test(values.phone.trim())) next.phone = "Enter a valid phone number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;
        onSave({ ...values, name: `${values.firstName}`.trim() });
    };

    const handleCancel = () => {
        setValues(buildInitial(profile));
        setErrors({});
    };

    return (
        <SectionCard id="profile-settings" title="Personal Information">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
                    <Field label="First Name" htmlFor="firstName" error={errors.firstName}>
                        <input id="firstName" name="firstName" value={values.firstName} onChange={handleChange} className={inputClass} placeholder="Enter Name number..." />
                    </Field>
                    <Field label="Email Address" htmlFor="email" error={errors.email}>
                        <input id="email" name="email" type="email" value={values.email} onChange={handleChange} className={inputClass} placeholder="Enter Email number..." />
                    </Field>
                    <Field label="Phone Number" htmlFor="phone" error={errors.phone}>
                        <input id="phone" name="phone" type="tel" value={values.phone} onChange={handleChange} className={inputClass} placeholder="Enter Phone number..." />
                    </Field>
                    <Field label="Date of Birth" htmlFor="dob">
                        <input id="dob" name="dob" type="date" value={values.dob} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field label="Gender" htmlFor="gender">
                        <select id="gender" name="gender" value={values.gender} onChange={handleChange} className={inputClass}>
                            <option value="">Select gender</option>
                            {GENDERS.map((gender) => (
                                <option key={gender} value={gender}>{gender}</option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button type="button" onClick={handleCancel} className={secondaryBtn}>Cancel</button>
                    <button type="submit" className={primaryBtn}>Save Changes</button>
                </div>
            </form>
        </SectionCard>
    );
};

export default PersonalInfo;