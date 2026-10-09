export const ORDER_STATUS_STYLES = {
    Delivered: "bg-green-100 text-green-700",
    "Out for Delivery": "bg-blue-100 text-blue-700",
    Processing: "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-600",
};

// Tabs shown above the orders list. `match` maps a tab to normalized statuses.
export const ORDER_TABS = [
    { key: "all", label: "All Orders", match: null },
    { key: "processing", label: "Processing", match: ["processing", "out for delivery"] },
    { key: "completed", label: "Completed", match: ["delivered", "completed"] },
    { key: "cancelled", label: "Cancelled", match: ["cancelled", "canceled"] },
];

// Badge look per status (pill at the top of each order body)
export const ORDER_BADGE = {
    completed: { bg: "bg-emerald-100", text: "text-emerald-800", prefix: "Delivered on" },
    processing: { bg: "bg-orange-100", text: "text-orange-700", prefix: "Processing - Expected" },
    cancelled: { bg: "bg-red-100", text: "text-red-700", prefix: "Cancelled" },
};

// Dummy orders (used until the backend sends real `profile.orders`)
export const DUMMY_ORDERS = [
    {
        id: "GL-10928", date: "2023-10-24", total: 27.6, shippedTo: "Sarah Jenkins",
        status: "Delivered", deliveredAt: "2023-10-26", emoji: "🍌",
        items: [
            { name: "Fresh Organic Bananas", quantity: 2, price: 9.0 },
            { name: "Whole Wheat Bread", quantity: 1, price: 3.2 },
        ],
    },
    {
        id: "GL-10945", date: "2023-10-28", total: 18.4, shippedTo: "Sarah Jenkins",
        status: "Processing", expectedDelivery: "2023-10-30", emoji: "🥑",
        items: [
            { name: "Organic Hass Avocados", quantity: 1, price: 8.9 },
            { name: "Fresh Cherry Tomatoes", quantity: 2, price: 4.5 },
        ],
    },
    {
        id: "GL-10899", date: "2023-10-15", total: 34.5, shippedTo: "Sarah Jenkins",
        status: "Cancelled", emoji: "🥛",
        items: [{ name: "Organic Almond Milk", quantity: 2, price: 9.8 }],
    },
];