import { useState } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { PiStorefrontLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { showWarningToast } from "../../../components/Toast";
import useAuthRateLimit from "../../../hooks/useAuthRateLimit";
import { adminlogin } from "../../../constants/Imageconstants";

const Adminregister = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(true);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const { registerOtp } = useSelector((state) => state.auth);
    const { sendloading, senderror } = registerOtp;

    const { remainingSeconds, countdownLabel } = useAuthRateLimit();

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ── Client-side validation ─────────────────────────────────────────────
    const handlevalids = () => {
        const newErrors = {};

        if (!form.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (form.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        } else if (!/^[A-Za-z]+$/.test(form.firstName.trim())) {
            newErrors.firstName = "First name can contain only letters";
        }

        if (!form.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (form.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        } else if (!/^[A-Za-z]+$/.test(form.lastName.trim())) {
            newErrors.lastName = "Last name can contain only letters";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(form.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(form.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(form.password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(form.password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        if (!agreed) {
            newErrors.agreed = "Please agree to the Terms of Service and Privacy Policy";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showWarningToast("Please fix the highlighted fields");
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (remainingSeconds > 0) return;

        if (!handlevalids()) return;

        // TODO: dispatch your send-OTP action here, e.g.
        // dispatch(sendRegisterOtp({ ...form, email: form.email.trim().toLowerCase(), role: "admin" }))
    };

    const inputBase =
        "w-full border bg-white text-sm text-[#2C3126] outline-none transition placeholder:text-[#A6AB9D] focus:border-[#1E8449] focus:ring-2 focus:ring-[#1E8449]/15";

    return (
        <div className="min-h-screen w-full bg-white font-sans text-[#22261F]">
            <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[58%_42%]">
                {/* Left hero panel */}
                <div className="relative hidden min-h-[520px] overflow-hidden lg:block lg:min-h-screen">
                    <img
                        src={adminlogin}
                        alt="Fresh fruit and vegetables"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>

                {/* Right form panel */}
                <div className="flex w-full flex-col px-6 py-6 sm:px-10 lg:px-16 lg:py-6">
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
                            to="/admin-login"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-700 transition-colors"
                        >
                            <FiUser className="h-4 w-4" />
                            Admin Login
                        </Link>
                    </div>

                    {/* Center content */}
                    <div className="flex flex-1 flex-col justify-center py-4">
                        <div className="mx-auto w-full max-w-lg">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F17]">
                                Create an account
                            </h1>
                            <p className="text-xs leading-relaxed text-[#6B7166]">
                                Enter your details below to get started.
                            </p>

                            {senderror && <p className="mt-2 text-sm text-red-600">{senderror}</p>}

                            {/* Form */}
                            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                                {/* Name fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="mb-1.5 block text-sm font-medium text-[#2C3126]"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Jane"
                                            value={form.firstName}
                                            onChange={handleChange("firstName")}
                                            className={`${inputBase} px-3.5 py-2.5 ${errors.firstName ? "border-red-500" : "border-[#DDE3D6]"}`}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="mb-1.5 block text-sm font-medium text-[#2C3126]"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={form.lastName}
                                            onChange={handleChange("lastName")}
                                            className={`${inputBase} px-3.5 py-2.5 ${errors.lastName ? "border-red-500" : "border-[#DDE3D6]"}`}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block text-sm font-medium text-[#2C3126]"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A6AB9D]" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="e.g. emily@example.com"
                                            value={form.email}
                                            onChange={handleChange("email")}
                                            className={`${inputBase} py-2.5 pl-10 pr-3.5 ${errors.email ? "border-red-500" : "border-[#DDE3D6]"}`}
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1.5 block text-sm font-medium text-[#2C3126]"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A6AB9D]" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={form.password}
                                            onChange={handleChange("password")}
                                            className={`${inputBase} py-2.5 pl-10 pr-10 ${errors.password ? "border-red-500" : "border-[#DDE3D6]"}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#A6AB9D] hover:text-[#1E8449]"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-[18px] w-[18px]" />
                                            ) : (
                                                <FiEye className="h-[18px] w-[18px]" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Agreement */}
                                <div>
                                    <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-[#4A5043]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAgreed((v) => !v);
                                                setErrors((prev) => ({ ...prev, agreed: undefined }));
                                            }}
                                            aria-pressed={agreed}
                                            className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center transition-colors ${
                                                agreed ? "bg-[#1E8449]" : "border border-[#C6CDBC] bg-white"
                                            }`}
                                        >
                                            {agreed && <FiCheck className="h-3 w-3 text-white" />}
                                        </button>
                                        <span>
                                            I agree to the{" "}
                                            <a href="#" className="font-medium text-[#1E8449] hover:text-[#166638]">
                                                Terms of Service
                                            </a>{" "}
                                            and{" "}
                                            <a href="#" className="font-medium text-[#1E8449] hover:text-[#166638]">
                                                Privacy Policy
                                            </a>
                                            .
                                        </span>
                                    </label>
                                    {errors.agreed && <p className="mt-1 text-xs text-red-600">{errors.agreed}</p>}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={sendloading || remainingSeconds > 0}
                                    className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 bg-[#1E8449] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166638] focus:outline-none focus:ring-2 focus:ring-[#1E8449]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                > Register
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-5 flex items-center gap-3">
                                <div className="h-px flex-1 bg-[#E5E7E1]" />
                                <span className="text-xs text-[#8A9080]">Or register as</span>
                                <div className="h-px flex-1 bg-[#E5E7E1]" />
                            </div>

                            {/* Secondary buttons side by side */}
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center gap-2 rounded-full border border-[#1E5B2A]/40 bg-white py-2.5 text-[13px] font-medium text-[#1E5B2A] transition hover:bg-[#F1F7F2]"
                                >
                                    <FiUser className="h-4 w-4" />
                                    User Register
                                </Link>
                                <Link
                                    to="/vendor-register"
                                    className="flex items-center justify-center gap-2 rounded-full border border-[#1E5B2A]/40 bg-white py-2.5 text-[13px] font-medium text-[#1E5B2A] transition hover:bg-[#F1F7F2]"
                                >
                                    <PiStorefrontLight className="h-[18px] w-[18px]" />
                                    Vendor Register
                                </Link>
                            </div>

                            <p className="mt-3 text-center text-[13px] font-normal text-[#6B7166]">
                                Already have an account?{" "}
                                <Link
                                    to="/admin-login"
                                    className="font-medium text-[#1E5B2A] hover:text-[#166638]"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adminregister;