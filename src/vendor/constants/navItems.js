import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBarChart2, FiStar } from "react-icons/fi";

export const NAV_ITEMS = [
    { label: "Dashboard", to: "/vendor", icon: FiGrid, end: true },
    { label: "Products", to: "/vendor/products", icon: FiPackage },
    { label: "Orders", to: "/vendor/orders", icon: FiShoppingBag, badgeKey: "pendingOrders" },
    { label: "Customers", to: "/vendor/customers", icon: FiUsers },
    { label: "Analytics", to: "/vendor/analytics", icon: FiBarChart2 },
    { label: "Reviews", to: "/vendor/reviews", icon: FiStar },
];

export const VENDOR_PROFILE = { store: "Daily Fresh Store", role: "Vendor" };

export const PRODUCT_CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Bakery", "Pantry", "Meat & Seafood"];
