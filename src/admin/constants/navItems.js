import { FiGrid, FiActivity, FiShoppingBag, FiFileText, FiPackage, FiShoppingCart, FiUsers } from "react-icons/fi";

export const NAV_SECTIONS = [
    {
        title: "Overview",
        items: [
            { label: "Dashboard", to: "/admin", icon: FiGrid, end: true },
            { label: "Analytics", to: "/admin/analytics", icon: FiActivity },
        ],
    },
    {
        title: "Marketplace",
        items: [
            { label: "Vendors & Shops", to: "/admin/vendors", icon: FiShoppingBag },
            { label: "Vendor Approvals", to: "/admin/vendor-approvals", icon: FiFileText },
            { label: "Product Monitoring", to: "/admin/products", icon: FiPackage },
            { label: "All Orders", to: "/admin/orders", icon: FiShoppingCart },
        ],
    },
    {
        title: "Users",
        items: [{ label: "Customers", to: "/admin/users", icon: FiUsers }],
    },
];

export const ADMIN_PROFILE = { name: "Sarah Jenkins", role: "Super Admin" };
