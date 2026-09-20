import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiArrowRight,
    FiChevronDown,
    FiPercent,
    FiTrendingUp,
    FiTruck,
    FiShield,
} from "react-icons/fi";
import { VendorRegisterimg } from "../../constants/Imageconstants";

const features = [
    { icon: FiPercent, text: "0% Commission for your first 30 days" },
    { icon: FiTrendingUp, text: "Powerful analytics and vendor dashboard" },
    { icon: FiTruck, text: "Integrated delivery & logistics support" },
    { icon: FiShield, text: "Fast, secure weekly payouts" },
];

const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Bakery",
    "Meat & Poultry",
    "Herbs & Spices",
    "Other",
];

const VendorRegister = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        storeName: "",
        category: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="h-screen w-full flex bg-white overflow-hidden">
            {/* Left visual panel */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src={VendorRegisterimg}
                    alt="Fresh produce at a local market"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>

            {/* Right form panel */}
            <div className="flex h-full w-full lg:w-1/2 flex-col overflow-hidden">
                <div className="flex items-center justify-end px-8 py-4 sm:px-12">
                    <Link
                        to="/"
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>

                <div className="flex flex-1 items-start justify-center overflow-y-auto px-8 pb-6 sm:px-12">
                    <div className="w-full max-w-xl">
                        <h2 className="text-2xl font-medium text-gray-900">Create Vendor Account</h2>
                        <p className="text-xs text-gray-500">
                            Fill in your details to get started with Green Leaf.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            {/* Store Name */}
                            <div>
                                <label htmlFor="storeName" className="mb-1.5 block text-sm text-gray-700">
                                    Store Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="storeName"
                                    type="text"
                                    required
                                    placeholder="e.g. Sunny Farm Organics"
                                    value={form.storeName}
                                    onChange={handleChange("storeName")}
                                    className="w-full border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            {/* Business Category */}
                            <div>
                                <label htmlFor="category" className="mb-1.5 block text-sm text-gray-700">
                                    Business Category <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        required
                                        value={form.category}
                                        onChange={handleChange("category")}
                                        className="w-full appearance-none border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        <option value="" disabled className="text-gray-400">
                                            Select category...
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            {/* Name fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="mb-1.5 block text-sm text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        required
                                        placeholder="e.g. John"
                                        value={form.firstName}
                                        onChange={handleChange("firstName")}
                                        className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="mb-1.5 block text-sm text-gray-700">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        required
                                        placeholder="e.g. Doe"
                                        value={form.lastName}
                                        onChange={handleChange("lastName")}
                                        className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="john@sunnyfarm.com"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="mb-1.5 block text-sm text-gray-700">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    placeholder="+1 (555) 000-0000"
                                    value={form.phone}
                                    onChange={handleChange("phone")}
                                    className="w-full border border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 cursor-pointer"
                            >
                                Create Vendor Account
                                <FiArrowRight className="h-4 w-4" />
                            </button>
                        </form>

                        <p className="mt-4 text-sm text-gray-500">
                            Already have a vendor account?{" "}
                            <Link to="/vendor-login" className="font-medium text-emerald-600 hover:text-emerald-700">
                                Log in
                            </Link>
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Signing up as a customer instead?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer"
                            >
                                Switch to customer
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegister;