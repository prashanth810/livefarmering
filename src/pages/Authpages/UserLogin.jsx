import React, { useState } from "react";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { FaLeaf, FaStar, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { vendorlogin, login } from "../../constants/Imageconstants";
import { Link } from "react-router-dom";

const UserLogin = () => {
    const [remember, setRemember] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="min-h-screen w-full bg-white font-sans text-[#22261F]">
            <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[58%_42%]">
                {/* Left hero panel */}
                <div className="relative hidden min-h-[520px] overflow-hidden lg:block lg:min-h-screen">
                    <img
                        src={login}
                        alt="Fresh fruit and vegetables"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    {/* Readability gradient over the photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-black/10" />

                    {/* Customer avatar, top-left */}
                    <div className="absolute left-6 top-6 h-11 w-11 overflow-hidden rounded-full ring-2 ring-white/70">
                        <img
                            src={vendorlogin}
                            alt="Sarah Jenkins"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Testimonial content */}
                    {/* <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 lg:p-12">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} size={18} className="text-[#F5B342]" />
                            ))}
                        </div>

                        <p
                            className="max-w-md text-2xl leading-snug text-white lg:text-[28px]"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >
                            &ldquo;Freshies has completely transformed how I shop for my
                            family. The quality and freshness are unmatched.&rdquo;
                        </p>

                        <div>
                            <p className="font-semibold text-white">Sarah Jenkins</p>
                            <p className="text-sm text-white/70">Verified Customer</p>
                        </div>
                    </div> */}
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

                        <Link to="/"
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Center content */}
                    <div className="flex flex-1 flex-col justify-center py-8 mt-5">
                        <div className="mx-auto w-full max-w-lg">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1B1F17]">
                                Welcome back
                            </h1>
                            <p className="text-xs leading-relaxed text-[#6B7166]">
                                Enter your email and password to access your account.
                            </p>

                            {/* Form */}
                            <form
                                className="mt-8 flex flex-col gap-5"
                                onSubmit={(e) => e.preventDefault()}
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
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-[#DDE3D6] bg-white px-3.5 py-3 text-sm text-[#2C3126] outline-none transition placeholder:text-[#A6AB9D] focus:border-[#1E8449] focus:ring-2 focus:ring-[#1E8449]/15"
                                        placeholder="e.g. emily@example.com"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1.5 block text-sm font-medium text-[#2C3126]"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-[#DDE3D6] bg-white px-3.5 py-3 text-sm text-[#2C3126] outline-none transition placeholder:text-[#A6AB9D] focus:border-[#1E8449] focus:ring-2 focus:ring-[#1E8449]/15"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex select-none items-center gap-2.5 text-sm text-[#4A5043] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={remember}
                                            onChange={() => setRemember((r) => !r)}
                                            className="h-4 w-4 border-[#C6CDBC] text-[#1E8449] accent-[#1E8449] focus:ring-[#1E8449]/30 cursor-pointer"
                                        />
                                        Remember me
                                    </label>
                                    <a
                                        href="#"
                                        className="text-sm font-medium text-[#1E8449] hover:text-[#166638]"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-1 flex w-full items-center justify-center bg-[#1E8449] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166638] focus:outline-none focus:ring-2 focus:ring-[#1E8449]/40 focus:ring-offset-2 cursor-pointer"
                                >
                                    Sign in
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-3">
                                <div className="h-px flex-1 bg-[#E5E7E1]" />
                                <span className="text-xs text-[#8A9080]">
                                    Or continue with
                                </span>
                                <div className="h-px flex-1 bg-[#E5E7E1]" />
                            </div>

                            {/* Social sign-in */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 border border-[#DDE3D6] bg-white py-2.5 text-sm font-medium text-[#2C3126] transition hover:bg-[#F7F5EF] cursor-pointer">
                                    <FcGoogle size={18} />
                                    Google
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 border border-[#DDE3D6] bg-white py-2.5 text-sm font-medium text-[#2C3126] transition hover:bg-[#F7F5EF] cursor-pointer">
                                    <FaApple size={17} />
                                    Apple
                                </button>
                            </div>

                            <p className="mt-7 text-center text-sm text-[#6B7166]">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-[#1E8449] hover:text-[#166638]"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;