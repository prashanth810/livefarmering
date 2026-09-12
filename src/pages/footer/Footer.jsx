import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { LuLeaf } from "react-icons/lu";

const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Vendor Partners", href: "/vendors" },
    { label: "Careers", href: "/careers" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Support", href: "/contact" },
];

const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "FAQ", href: "/faq" },
];

const socialLinks = [
    { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
    { label: "Twitter", href: "https://twitter.com", icon: FaXTwitter },
    { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
];

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Hook this up to real newsletter subscription logic.
    };

    return (
        <footer className="bg-white px-4 pt-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                                <LuLeaf className="h-4 w-4" />
                            </span>
                            <span className="text-lg font-bold text-emerald-800 sm:inline">
                                Freshies
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
                            The leading multi-vendor grocery marketplace connecting you
                            with fresh, organic produce and everyday essentials directly
                            from local farms and trusted vendors.
                        </p>
                        <div className="mt-5 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FiPhone className="h-4 w-4 text-gray-400" />
                                +1 (800) 123-4567
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail className="h-4 w-4 text-gray-400" />
                                support@greenleaf.com
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Quick Links</h3>
                        <ul className="mt-4 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-gray-500 transition-colors hover:text-green-600"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Legal</h3>
                        <ul className="mt-4 space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-gray-500 transition-colors hover:text-green-600"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">
                            Subscribe to Newsletter
                        </h3>
                        <p className="mt-4 text-sm text-gray-500">
                            Get weekly updates on fresh deals and exclusive offers.
                        </p>
                        <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
                            <div className="relative">
                                <FiMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500/60"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center gap-4 border-t border-gray-100 py-6 sm:flex-row sm:justify-between">
                    <p className="text-xs text-gray-500">
                        © 2025 Green Leaf Grocers. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-green-600 hover:text-white"
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;