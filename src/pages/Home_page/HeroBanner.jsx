import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { PiStorefrontLight } from "react-icons/pi";
import { bannerimg } from "../../constants/Imageconstants";

const stats = [
    { value: "50k+", label: "Happy Customers" },
    { value: "200+", label: "Local Vendors" },
    { value: "100%", label: "Fresh Guarantee" },
];

const HeroBanner = () => {
    return (
        <section className="bg-[#DFF7E9]">
            <div className="mx-auto grid max-w-[95%] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-16">
                {/* Copy column */}
                <div className="flex flex-col items-start text-left">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                        <FiShield className="h-3.5 w-3.5" />
                        100% Organic &amp; Fresh
                    </span>

                    <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-[3.25rem]">
                        Fresh Groceries
                    </h1>

                    <p className="text-green-600 text-2xl font-bold leading-tight sm:text-3xl lg:text-[2.25rem]">Delivered to Your Door</p>

                    <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
                        Shop from local vendors and get the best quality fruits,
                        vegetables, and daily essentials delivered fast. Join thousands
                        of happy customers today.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/shop"
                            className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                        >
                            Shop Now
                            <FiArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/vendor-register"
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
                        >
                            <PiStorefrontLight className="h-4 w-4" />
                            Become a Vendor
                        </Link>
                    </div>

                    <dl className="mt-10 grid w-full max-w-md grid-cols-3 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                                    {stat.value}
                                </dd>
                                <dd className="mt-1 text-xs text-gray-500 sm:text-sm">
                                    {stat.label}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Image column */}
                <div className="relative">
                    <div className="overflow-hidden rounded-2xl">
                        <img
                            src={bannerimg}
                            alt="Crate of fresh, organic fruits and vegetables"
                            className="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;