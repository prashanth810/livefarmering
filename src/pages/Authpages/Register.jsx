import { useState } from "react";
import { brand_logo, register } from "../../constants/Imageconstants";
import {
    FiArrowLeft,
    FiArrowRight,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../../redux/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    showErrorToast,
    showSuccessToast,
    showWarningToast,
} from "../../components/Toast";

const App = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("customer");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(true);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const dispatch = useDispatch();
    const { registerloading, registererror } = useSelector((state) => state.auth.register);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handlevalids = () => {
        const newErrors = {};

        if (!form.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        else if (form.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        }
        else if (!/^[A-Za-z]+$/.test(form.firstName.trim())) {
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation
        const isValid = handlevalids();

        if (!isValid) {
            return;
        }

        // Combine first name + last name
        const name = `${form.firstName.trim()} ${form.lastName.trim()}`;

        // Data required by backend
        const registerData = {
            name,
            email: form.email.trim().toLowerCase(),
            password: form.password,
            role: "user",
        };
        try {
            const result = await dispatch(handleRegister(registerData));

            if (handleRegister.fulfilled.match(result)) {
                showSuccessToast("Registration successful");
                navigate("/");
            } else {
                showErrorToast(result.payload || "Registration failed");
            }
        } catch (error) {
            showErrorToast(error.message || "Registration failed");
        }
    };

    const handleregister = () => {
        setRole("vendor")
        navigate("/vendor-register");
    }

    return (
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
                        {registererror && <p className="mt-2 text-sm text-red-600">{registererror}</p>}

                        {/* Role toggle with animated sliding background */}
                        <div className="relative mt-4 grid grid-cols-2 gap-1  border border-gray-200 bg-gray-50 p-1">
                            {/* Sliding pill */}
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
                                        className="w-full  border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                                        className="w-full  border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                                        className="w-full  border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                                        className="w-full  border border-gray-300 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
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

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={registerloading}
                                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {registerloading ? "Creating account..." : "Create Account"}
                                <FiArrowRight className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-200" />
                            <span className="text-xs text-gray-400">Or register with</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        {/* Social buttons */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2  border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50  cursor-pointer">
                                <FcGoogle className="h-4.5 w-4.5" />
                                Google
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2  border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50  cursor-pointer">
                                <FaFacebook className="h-4.5 w-4.5 text-[#1877F2]" />
                                Facebook
                            </button>
                        </div>

                        <p className="mt-4.5 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to='/login' className="font-medium text-emerald-600 hover:text-emerald-700">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;