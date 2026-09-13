import React, { useState } from "react";
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowLeft,
    FiArrowRight,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { vendorlogin } from "../../constants/Imageconstants";
import { Link } from "react-router-dom";

export default function FreshiesVendorLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="h-screen w-full overflow-hidden bg-white font-sans">

            <div className="flex h-full w-full">

                {/* ================= LEFT IMAGE ================= */}
                <div className="relative hidden h-full w-[46%] lg:block">
                    <img
                        src={vendorlogin}
                        alt="Fresh produce at a local market"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="relative flex h-full w-full flex-1 flex-col bg-white xl:px-16 xl:py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center bg-[#1E8449]">
                                <FaLeaf size={15} className="text-white" />
                            </span>
                            <span className="text-lg font-semibold tracking-tight text-[#1E8449]">
                                Freshies
                            </span>
                        </div>

                        <Link to="/"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>


                    {/* ================= CENTER CONTENT ================= */}
                    <div className="flex h-full items-center justify-center px-6 sm:px-10 lg:px-16">

                        <div className="w-full max-w-xl">

                            {/* Heading */}
                            <h1 className="text-3xl font-bold tracking-tight text-black">
                                Vendor Portal
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Sign in to manage your store, track orders, and view
                                sales analytics.
                            </p>

                            {/* Form */}
                            <form
                                className="mt-7 flex flex-col gap-5"
                                onSubmit={(e) => e.preventDefault()}
                            >

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-xs font-semibold text-gray-900"
                                    >
                                        Email Address
                                    </label>

                                    <div className="flex h-10 items-center border border-gray-200 bg-white px-3 transition focus-within:border-[#FF542D]">
                                        <FiMail
                                            size={16}
                                            className="mr-2 text-gray-400"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="you@farmname.com"
                                            className="w-full bg-transparent text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>

                                    <div className="mb-2 flex items-center justify-between">

                                        <label
                                            htmlFor="password"
                                            className="text-xs font-semibold text-gray-900"
                                        >
                                            Password
                                        </label>

                                        <a
                                            href="#"
                                            className="text-xs font-medium text-[#FF542D] hover:underline"
                                        >
                                            Forgot password?
                                        </a>

                                    </div>

                                    <div className="flex h-10 items-center border border-gray-200 bg-white px-3 transition focus-within:border-[#FF542D]">

                                        <FiLock
                                            size={16}
                                            className="mr-2 text-gray-400"
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Enter your password"
                                            className="w-full bg-transparent text-sm outline-none"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((s) => !s)
                                            }
                                            className="text-gray-400 hover:text-[#FF542D]"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff size={16} />
                                            ) : (
                                                <FiEye size={16} />
                                            )}
                                        </button>

                                    </div>
                                </div>

                                {/* Remember */}
                                <label className="flex items-center gap-2 text-xs text-gray-700">

                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={() =>
                                            setRemember((r) => !r)
                                        }
                                        className="h-4 w-4 accent-[#FF542D]"
                                    />

                                    Remember me for 30 days

                                </label>

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="flex h-10 w-full items-center justify-center bg-[#FF542D] text-sm font-semibold text-white transition hover:bg-[#E94824]"
                                >
                                    Sign In to Dashboard
                                    <FiArrowRight
                                        size={16}
                                        className="ml-2"
                                    />
                                </button>

                            </form>

                            {/* Apply */}
                            <p className="mt-7 text-center text-xs text-gray-500">

                                Don't have a vendor account yet?{" "}

                                <a
                                    href="#"
                                    className="font-semibold text-[#FF542D] hover:underline"
                                >
                                    Apply now
                                </a>

                            </p>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}