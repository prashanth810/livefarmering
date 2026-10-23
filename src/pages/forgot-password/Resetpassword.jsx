import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { forgotpassword } from "../../constants/Imageconstants";
import { Link, useNavigate } from "react-router-dom";
import { updatepassword } from "../../redux/Slices/AuthSlice";
import {
    showErrorToast,
    showSuccessToast,
    showWarningToast,
} from "../../components/Toast";

const Resetpassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // token returned by verify-otp (redux first, sessionStorage as backup)
    const verifyToken = useSelector((state) => state.auth.verifyotp.verifyotpdata?.token);
    const loading = useSelector((state) => state.auth.changepassword.changepasswordloading);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "New password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showWarningToast("Please fix the highlighted fields");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = verifyToken || sessionStorage.getItem("resetToken");

        if (!token) {
            showErrorToast("Reset session expired. Please verify your OTP again.");
            navigate("/forgot-password"); // change to your forgot-password route
            return;
        }

        try {
            const result = await dispatch(
                updatepassword({ password, token })
            ).unwrap();

            showSuccessToast(result?.message || "Password changed successfully");
            sessionStorage.removeItem("resetToken");
            navigate("/login");
        } catch (message) {
            showErrorToast(
                typeof message === "string" ? message : "Unable to reset password"
            );
        }
    };

    return (
        <div className="min-h-screen w-full bg-white font-sans text-[#22261F]">
            <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[58%_42%]">

                {/* Left hero panel */}
                <div className="relative hidden min-h-[520px] overflow-hidden lg:block lg:min-h-screen">
                    <img
                        src={forgotpassword}
                        alt="Freshies secure password reset"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>

                {/* Right form panel */}
                <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-8">

                    {/* Top bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center bg-[#1E8449]">
                                <FaLeaf size={15} className="text-white" />
                            </span>

                            <span className="text-lg font-semibold tracking-tight text-[#1E8449]">
                                Freshies
                            </span>
                        </div>

                        <Link
                            to="/login"
                            className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>

                    {/* Reset password form */}
                    <div className="mt-3 flex flex-1 flex-col justify-center py-6">
                        <div className="mx-auto w-full max-w-lg">

                            <div className="mb-8 flex items-start gap-4">
                                <div>
                                    <h1 className="text-xl font-semibold tracking-tight text-[#1B1F17]">
                                        Reset Password
                                    </h1>

                                    <p className="text-xs leading-relaxed text-[#6B7166]">
                                        Create a strong new password for your Freshies account.
                                    </p>
                                </div>
                            </div>

                            <form
                                className="flex flex-col gap-5"
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                {/* New password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1.5 block text-sm font-medium text-[#4e4e4e]"
                                    >
                                        New Password
                                    </label>

                                    <div
                                        className={`flex items-center border bg-white px-3.5 py-4 text-sm transition focus-within:border-[#1E8449] focus-within:ring-2 focus-within:ring-[#1E8449]/15 ${errors.password ? "border-red-500" : "border-[#b0afaf]"}`}
                                    >
                                        <FiLock className="mr-3 shrink-0 text-gray-400" />

                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            autoComplete="new-password"
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    password: undefined,
                                                    confirmPassword: undefined,
                                                }));
                                            }}
                                            className="w-full outline-none"
                                            placeholder="Enter new password"
                                        />

                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="ml-2 text-gray-500"
                                        >
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                    )}

                                    <p className="mt-2 text-xs leading-5 text-[#7A8292]">
                                        Use at least 8 characters, including uppercase, lowercase,
                                        a number, and a special character.
                                    </p>
                                </div>

                                {/* Confirm password */}
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-1.5 block text-sm font-medium text-[#4e4e4e]"
                                    >
                                        Confirm Password
                                    </label>

                                    <div
                                        className={`flex items-center border bg-white px-3.5 py-4 text-sm transition focus-within:border-[#1E8449] focus-within:ring-2 focus-within:ring-[#1E8449]/15 ${errors.confirmPassword ? "border-red-500" : "border-[#b0afaf]"}`}
                                    >
                                        <FiLock className="mr-3 shrink-0 text-gray-400" />

                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            autoComplete="new-password"
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    confirmPassword: undefined,
                                                }));
                                            }}
                                            className="w-full outline-none"
                                            placeholder="Confirm new password"
                                        />

                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="ml-2 text-gray-500"
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 flex w-full items-center justify-center bg-[#1E8449] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166638] focus:outline-none focus:ring-2 focus:ring-[#1E8449]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Resetting Password..." : "Reset Password"}
                                </button>
                            </form>

                            <div className="mt-7 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#1E8449] hover:text-[#166638]"
                                >
                                    <FiArrowLeft />
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resetpassword;