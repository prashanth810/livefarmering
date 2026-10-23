import { useState, useRef, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { forgotpassword } from "../../constants/Imageconstants";
import {
    showErrorToast,
    showSuccessToast,
    showWarningToast,
} from "../../components/Toast";
import { useDispatch } from "react-redux";
import { veriyotp } from "../../redux/Slices/AuthSlice";

const Otpsession = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    // email saved by the Forgot Password page
    const email =
        location.state?.email || sessionStorage.getItem("resetEmail");

    // no email = user opened this page directly, send back
    useEffect(() => {
        if (!email) {
            showWarningToast("Please enter your email first");
            navigate("/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    const handleOtpChange = (value, index) => {
        const digit = value.replace(/\D/g, "").slice(-1);

        const updatedOtp = [...otp];
        updatedOtp[index] = digit;
        setOtp(updatedOtp);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pastedOtp = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedOtp) return;

        const updatedOtp = Array(6).fill("");
        pastedOtp.split("").forEach((digit, index) => {
            updatedOtp[index] = digit;
        });

        setOtp(updatedOtp);
        inputRefs.current[Math.min(pastedOtp.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const otpValue = otp.join(""); // "806383" (string), not an array

        if (otpValue.length !== 6) {
            showWarningToast("Please enter the complete 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            // send the object directly (NOT { data }) so the backend gets email, role, otp
            const res = await dispatch(
                veriyotp({
                    email,
                    role: "user",
                    otp: otpValue,
                })
            ).unwrap(); // throws if the API fails -> goes to catch

            // token is needed for the change-password API
            sessionStorage.setItem("resetToken", res.token);
            sessionStorage.removeItem("resetEmail");

            showSuccessToast(res?.message || "OTP verified successfully");

            // navigate ONLY after the OTP is verified
            navigate("/reset-password", { replace: true });
        } catch (error) {
            const message =
                typeof error === "string"
                    ? error
                    : error?.message || "OTP verification failed";
            showErrorToast(message);
        } finally {
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

                    {/* OTP content */}
                    <div className="mt-3 flex flex-1 flex-col justify-center py-6">
                        <div className="mx-auto w-full max-w-lg">

                            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F17]">
                                Verify Your OTP
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-[#6B7166]">
                                Enter the 6-digit verification code sent to your email address.
                            </p>

                            <form
                                className="mt-8 flex flex-col gap-6"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-[#2C3126]">
                                        Enter OTP
                                    </label>

                                    <div className="flex justify-between gap-3 md:max-w-[90%] mx-auto">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) =>
                                                    (inputRefs.current[index] = el)
                                                }
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete={
                                                    index === 0
                                                        ? "one-time-code"
                                                        : "off"
                                                }
                                                maxLength={1}
                                                value={digit}
                                                disabled={loading}
                                                onChange={(e) =>
                                                    handleOtpChange(
                                                        e.target.value,
                                                        index
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyDown(e, index)
                                                }
                                                placeholder={index + 1}
                                                onPaste={handlePaste}
                                                aria-label={`OTP digit ${index + 1}`}
                                                className="h-10 w-10 min-w-0 rounded-xl border border-[#aeaeae] bg-white text-center text-xl font-semibold text-[#1E8449] outline-none transition focus:border-[#1E8449] focus:ring-2 focus:ring-[#1E8449]/15 sm:h-12 sm:w-12"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 bg-[#1E8449] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166638] focus:outline-none focus:ring-2 focus:ring-[#1E8449]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading && (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    )}
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                            </form>

                            <div className="mt-7 text-center">
                                <Link
                                    to="/forgot-password"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#1E8449] hover:text-[#166638]"
                                >
                                    <FiArrowLeft />
                                    Back to Forgot Password
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Otpsession;