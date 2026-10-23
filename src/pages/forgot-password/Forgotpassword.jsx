import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { forgotpassword } from "../../constants/Imageconstants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendotp } from "../../redux/Slices/AuthSlice";

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleotp = async (e) => {
        e.preventDefault();
        if (loading) return; // block double clicks

        const cleanEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }

        setErrors({});
        setSuccess("");
        setLoading(true);

        try {
            // unwrap() throws if the thunk is rejected, so success only runs when the OTP is really sent
            const res = await dispatch(
                sendotp({ email: cleanEmail, role: "user" })
            ).unwrap();

            // keep the email for the OTP + change password pages (survives refresh)
            sessionStorage.setItem("resetEmail", cleanEmail);

            setSuccess(res?.message || "OTP sent to your email !!!");

            // show the success message for a moment, then go to the next page
            setTimeout(() => {
                navigate("/otp", { state: { email: cleanEmail } });
            }, 1200);
        } catch (error) {
            const message =
                typeof error === "string"
                    ? error
                    : error?.message || "Unable to send OTP. Please try again.";
            setErrors({ email: message });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white font-sans text-[#22261F]">
            <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[58%_42%]">

                {/* Left hero panel */}
                <div className="relative hidden min-h-[520px] overflow-hidden lg:block lg:min-h-screen">
                    <img
                        src={forgotpassword}
                        alt="Freshies secure email verification"
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
                            to="/"
                            className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Center content */}
                    <div className="mt-3 flex flex-1 flex-col justify-center py-6">
                        <div className="mx-auto w-full max-w-lg">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F17]">
                                Forgot Password?
                            </h1>

                            <p className="text-xs leading-relaxed text-[#6B7166]">
                                Enter your email address and we'll send you a verification code to reset your password.
                            </p>

                            {/* Email form */}
                            <form
                                className="mt-8 flex flex-col gap-5"
                                onSubmit={handleotp}
                                noValidate
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block text-sm font-medium text-[#2C3126]"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled={loading}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors({});
                                            setSuccess("");
                                        }}
                                        className={`w-full border bg-white px-3.5 py-3 text-sm text-[#2C3126] outline-none transition placeholder:text-[#A6AB9D] focus:border-[#1E8449] focus:ring-2 focus:ring-[#1E8449]/15 disabled:cursor-not-allowed disabled:bg-gray-50 ${errors.email
                                            ? "border-red-500"
                                            : "border-[#DDE3D6]"
                                            }`}
                                        placeholder="e.g. emily@example.com"
                                        required
                                    />

                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.email}
                                        </p>
                                    )}

                                    {success && (
                                        <p className="mt-1 text-xs font-medium text-[#1E8449]">
                                            {success}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 bg-[#1E8449] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166638] focus:outline-none focus:ring-2 focus:ring-[#1E8449]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    )}
                                    {loading
                                        ? success
                                            ? "OTP Sent, Redirecting..."
                                            : "Sending OTP..."
                                        : "Send OTP"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgotpassword;