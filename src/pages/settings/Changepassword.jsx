import { useState } from "react";
import { Field, SectionCard, inputClass, primaryBtn } from "./Settingsui";
import { useDispatch, useSelector } from "react-redux";
import { updatepassword } from "../../redux/Slices/AuthSlice";

const EMPTY = { current: "", next: "", confirm: "" };

const ChangePassword = () => {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch();
    const loading = useSelector((state) => state.auth.changepassword.changepasswordloading);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
        setSuccess("");
    };

    const validate = () => {
        const next = {};
        if (!values.current) next.current = "Enter your current password";
        if (values.next.length < 8) next.next = "Password must be at least 8 characters";
        else if (values.next === values.current) next.next = "New password must be different from the current one";
        if (values.confirm !== values.next) next.confirm = "Passwords do not match";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        const token = sessionStorage.getItem("resetToken") || sessionStorage.getItem("token");

        try {
            const result = await dispatch(
                updatepassword({
                    password: values.next,            // NEW password
                    currentPassword: values.current,  // verified by backend
                    token,
                })
            ).unwrap();

            setSuccess(result?.message || "Password changed successfully");
            setValues(EMPTY);
            sessionStorage.removeItem("resetToken");
        } catch (message) {
            setErrors({ form: typeof message === "string" ? message : "Unable to change password" });
        }
    };

    return (
        <SectionCard id="reset-password" title="Change Password">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
                    <Field label="Current Password" htmlFor="current" error={errors.current} className="sm:col-span-2">
                        <input id="current" name="current" type="password" autoComplete="current-password" value={values.current} onChange={handleChange} className={inputClass} placeholder="Enter current password..." />
                    </Field>
                    <Field label="New Password" htmlFor="next" error={errors.next}>
                        <input id="next" name="next" type="password" autoComplete="new-password" value={values.next} onChange={handleChange} className={inputClass} placeholder="Enter new password..." />
                    </Field>
                    <Field label="Confirm New Password" htmlFor="confirm" error={errors.confirm}>
                        <input id="confirm" name="confirm" type="password" autoComplete="new-password" value={values.confirm} onChange={handleChange} className={inputClass} placeholder="Confirm new password..." />
                    </Field>

                    {errors.form && <p className="text-sm text-red-600 sm:col-span-2">{errors.form}</p>}
                    {success && <p className="text-sm text-green-600 sm:col-span-2">{success}</p>}
                </div>

                <div className="flex justify-end border-t border-gray-100 px-6 py-4">
                    <button type="submit" disabled={loading} className={primaryBtn}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </form>
        </SectionCard>
    );
};

export default ChangePassword;