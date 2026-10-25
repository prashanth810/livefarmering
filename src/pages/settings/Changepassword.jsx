import { useState } from "react";
import { Field, SectionCard, inputClass, primaryBtn } from "./Settingsui";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { resetpassword } from "../../redux/Slices/AuthSlice";
import { showErrorToast, showSuccessToast } from "../../components/Toast";

const EMPTY = { current: "", next: "", confirm: "" };

const ChangePassword = () => {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const { resetpasswordloading: loading } = useSelector((s) => s.auth.resetpassword);

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

        try {
            const result = await dispatch(
                resetpassword({
                    currentPassword: values.current,  // verified by backend
                    password: values.next,
                })
            ).unwrap();

            showSuccessToast(result?.message || "Password changed successfully");
            setValues(EMPTY);
            sessionStorage.removeItem("resetToken");
        } catch (message) {
            setErrors({ form: typeof message === "string" ? message : "Unable to change password" });
            showErrorToast(message || "failed to reset password !!!");
        }
    };

    return (
        <SectionCard id="reset-password" title="Change Password">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
                    <Field label="Current Password" htmlFor="current" error={errors.current} className="sm:col-span-2">
                        <div className="relative">
                            <input id="current" name="current" type={showCurrentPassword ? "text" : "password"} autoComplete="current-password" value={values.current} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="Enter current password..." />
                            <button type="button" onClick={() => setShowCurrentPassword((visible) => !visible)} aria-label={showCurrentPassword ? "Hide current password" : "Show current password"} aria-pressed={showCurrentPassword} className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                {showCurrentPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                            </button>
                        </div>
                    </Field>
                    <Field label="New Password" htmlFor="next" error={errors.next}>
                        <div className="relative">
                            <input id="next" name="next" type={showPassword ? "text" : "password"} autoComplete="new-password" value={values.next} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="Enter new password..." />
                            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide new password" : "Show new password"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                            </button>
                        </div>
                    </Field>
                    <Field label="Confirm New Password" htmlFor="confirm" error={errors.confirm}>
                        <div className="relative">
                            <input id="confirm" name="confirm" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={values.confirm} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="Confirm new password..." />
                            <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"} aria-pressed={showConfirmPassword} className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                {showConfirmPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                            </button>
                        </div>
                    </Field>

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