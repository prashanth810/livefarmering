import { useState, useRef, useEffect } from "react";
import { brand_logo, register } from "../../constants/Imageconstants";
import {
    FiArrowLeft,
    FiArrowRight,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheck,
    FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { sendRegisterOtp, verifyRegisterOtp, clearRegisterOtpErrors } from "../../redux/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    showErrorToast,
    showSuccessToast,
    showWarningToast,
} from "../../components/Toast";
import useAuthRateLimit from "../../hooks/useAuthRateLimit";

// ─── OTP Modal ────────────────────────────────────────────────────────────────
const OtpModal = ({ email, onVerify, onClose, loading, error }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    // Auto-focus first box when modal opens
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleKey = (index, e) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const next = [...otp];
                next[index] = "";
                setOtp(next);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleChange = (index, value) => {
        // Accept only digits
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const next = [...otp];
        pasted.split("").forEach((d, i) => { next[i] = d; });
        setOtp(next);
        // Focus last filled or next empty
        const focusIdx = Math.min(pasted.length, 5);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length < 6) {
            showWarningToast("Please enter all 6 digits");
            return;
        }
        onVerify(code);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-8">
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <FiX className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mb-4">
                        <FiMail className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                    <p className="mt-1.5 text-sm text-gray-500">
                        We sent a 6-digit code to<br />
                        <span className="font-medium text-gray-700">{email}</span>
                    </p>
                </div>

                {/* OTP input boxes */}
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2.5 mb-2" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKey(i, e)}
                                className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-lg outline-none transition-colors
                                    ${digit ? "border-emerald-500 bg-emerald-50" : "border-gray-300"}
                                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                            />
                        ))}
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
                    )}

                    <p className="mt-2 mb-5 text-center text-xs text-gray-400">
                        OTP is valid for <strong>10 minutes</strong>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Verifying…" : "Verify & Create Account"}
                        {!loading && <FiArrowRight className="h-4 w-4" />}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-gray-400">
                    Didn't get the email?{" "}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
                    >
                        Go back and try again
                    </button>
                </p>
            </div>
        </div>
    );
};

// ─── Register Page ────────────────────────────────────────────────────────────
const App = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [role, setRole] = useState("customer");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(true);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [showOtpModal, setShowOtpModal] = useState(false);

    const { registerOtp } = useSelector((state) => state.auth);
    const { sendloading, senderror, verifyloading, verifyerror } = registerOtp;

    const { remainingSeconds, countdownLabel, startCooldown } = useAuthRateLimit();

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    // ── Client-side validation ─────────────────────────────────────────────────
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

    // ── Step 1: Submit form → send OTP ─────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (remainingSeconds > 0) return;

        if (!handlevalids()) return;

        const name = `${form.firstName.trim()} ${form.lastName.trim()}`;

        dispatch(clearRegisterOtpErrors());

        const result = await dispatch(
            sendRegisterOtp({
                name,
                email: form.email.trim().toLowerCase(),
                password: form.password,
                role: "user",
            })
        );

        if (sendRegisterOtp.fulfilled.match(result)) {
            showSuccessToast("OTP sent! Check your email inbox.");
            setShowOtpModal(true);
        } else {
            startCooldown(result.payload);
            showErrorToast(result.payload || "Failed to send OTP");
        }
    };

    // ── Step 2: Verify OTP → account created ──────────────────────────────────
    const handleVerifyOtp = async (otp) => {
        const result = await dispatch(
            verifyRegisterOtp({
                email: form.email.trim().toLowerCase(),
                otp,
            })
        );

        if (verifyRegisterOtp.fulfilled.match(result)) {
            setShowOtpModal(false);
            showSuccessToast("Account created! Welcome to Freshies 🎉");
            navigate("/");
        } else {
            showErrorToast(result.payload || "OTP verification failed");
        }
    };

    const handleregister = () => {
        setRole("vendor");
        navigate("/vendor-register");
    };

    return (
        <>
            {/* OTP Modal */}
            {showOtpModal && (
                <OtpModal
                    email={form.email.trim()}
                    onVerify={handleVerifyOtp}
                    onClose={() => setShowOtpModal(false)}
                    loading={verifyloading}
                    error={verifyerror}
                />
            )}

            <div className="min-h-screen w-full flex bg-white">
                {/* Left visual panel */}
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <img
                        src={register}
                        alt="Fresh organic produce on a kitchen counter"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="relative mt-auto p-12 max-w-lg">
                        <h1 className="text-4xl font-bold leading-tight text-white">
                            Join our fresh community.
                        </h1>
                        <p className="mt-4 text-base text-white/85">
                            Connect with local farmers and discover the best organic produce
                            delivered straight to your door.
                        </p>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="flex w-full lg:w-1/2 flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 sm:px-12">
                        <div className="flex items-center gap-2">
                            <img src={brand_logo} alt="Freshies" className="h-8 w-8 object-contain" />
                            <span className="text-lg font-semibold text-emerald-700">Freshies</span>
                        </div>
                        <Link to="/"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Form */}
                    <div className="flex flex-1 items-center justify-center px-8 pb-10 sm:px-12">
                        <div className="w-full max-w-xl">
                            <h2 className="text-2xl font-medium text-gray-900">Create an account</h2>
                            <p className="text-xs text-gray-500">
                                Enter your details below to get started.
                            </p>

                            {senderror && <p className="mt-2 text-sm text-red-600">{senderror}</p>}

                            {/* Role toggle */}
                            <div className="relative mt-4 grid grid-cols-2 gap-1 border border-gray-200 bg-gray-50 p-1">
                                <div
                                    className={`absolute inset-y-1 w-[calc(50%-0.25rem)] border border-gray-200 bg-white shadow-sm transition-transform duration-500 ease-out ${role === "vendor" ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setRole("customer")}
                                    className={`relative z-10 py-2 text-sm font-medium transition-colors duration-500 cursor-pointer ${role === "customer" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    I'm a Customer
                                </button>
                                <button
                                    type="button"
                                    onClick={handleregister}
                                    className={`relative z-10 py-2 text-sm font-medium transition-colors duration-500 cursor-pointer ${role === "vendor" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    I'm a Vendor
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-y-5">
                                {/* Name fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Jane"
                                            value={form.firstName}
                                            onChange={handleChange("firstName")}
                                            className="w-full border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                        {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={form.lastName}
                                            onChange={handleChange("lastName")}
                                            className="w-full border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                        {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="jane.doe@example.com"
                                            value={form.email}
                                            onChange={handleChange("email")}
                                            className="w-full border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••••••"
                                            value={form.password}
                                            onChange={handleChange("password")}
                                            className="w-full border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-4.5 w-4.5" />
                                            ) : (
                                                <FiEye className="h-4.5 w-4.5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                </div>

                                {/* Agreement */}
                                <label className="flex items-center gap-2.5 text-sm text-gray-600">
                                    <button
                                        type="button"
                                        onClick={() => setAgreed((v) => !v)}
                                        aria-pressed={agreed}
                                        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded transition-colors ${agreed ? "bg-emerald-600" : "border border-gray-300 bg-white"
                                            }`}
                                    >
                                        {agreed && <FiCheck className="h-3 w-3 text-white" />}
                                    </button>
                                    <span>
                                        I agree to the{" "}
                                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                                            Privacy Policy
                                        </a>
                                        .
                                    </span>
                                </label>
                                {errors.agreed && <p className="-mt-4 text-xs text-red-600">{errors.agreed}</p>}

                                {/* Submit — sends OTP */}
                                <button
                                    type="submit"
                                    disabled={sendloading || remainingSeconds > 0}
                                    className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {remainingSeconds > 0
                                        ? `Try again in ${countdownLabel}`
                                        : sendloading
                                            ? "Sending OTP…"
                                            : "Send OTP & Continue"}
                                    {remainingSeconds === 0 && <FiArrowRight className="h-4 w-4" />}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs text-gray-400">Or register with</span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <p className="mt-4.5 text-center text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
