export const mockDashboard = {
    pendingOrders: 12,
    stats: [
        { key: "revenue", label: "Total Revenue", value: 24590, format: "currency", change: 12.5 },
        { key: "orders", label: "Total Orders", value: 1240, format: "number", change: 5.2 },
        { key: "products", label: "Active Products", value: 145, format: "number", change: 0 },
        { key: "rating", label: "Store Rating", value: 4.8, format: "rating", change: 0.2 },
    ],
    revenue: {
        week: [
            { label: "Mon", revenue: 4400 },
            { label: "Tue", revenue: 6000 },
            { label: "Wed", revenue: 3400 },
            { label: "Thu", revenue: 8000 },
            { label: "Fri", revenue: 5500 },
            { label: "Sat", revenue: 9500 },
            { label: "Sun", revenue: 6500 },
        ],
        month: [
            { label: "Week 1", revenue: 31200 },
            { label: "Week 2", revenue: 36800 },
            { label: "Week 3", revenue: 33400 },
            { label: "Week 4", revenue: 41900 },
        ],
    },
    topProducts: [
        { id: "P-1", name: "Organic Green Broccoli", category: "Vegetables", price: 4.98, sold: 340, emoji: "🥦" },
        { id: "P-2", name: "Farm Fresh Eggs", category: "Dairy", price: 6.99, sold: 280, emoji: "🥚" },
        { id: "P-3", name: "Whole Wheat Sourdough", category: "Bakery", price: 4.5, sold: 195, emoji: "🍞" },
        { id: "P-4", name: "Raw Local Honey", category: "Pantry", price: 8.99, sold: 150, emoji: "🍯" },
        { id: "P-5", name: "Fresh Hass Avocados", category: "Fruits", price: 5.99, sold: 110, emoji: "🥑" },
    ],
    recentOrders: [
        { id: "#ORD-7352", customer: "Sarah Jenkins", email: "sarah.j@example.com", date: "2023-10-24T10:24:00", status: "Delivered", total: 45.9 },
        { id: "#ORD-7351", customer: "Mike Thompson", email: "mike.t@example.com", date: "2023-10-24T09:12:00", status: "Processing", total: 112.5 },
        { id: "#ORD-7350", customer: "Emily Davis", email: "emily.d@example.com", date: "2023-10-23T04:45:00", status: "Shipped", total: 89.0 },
        { id: "#ORD-7349", customer: "James Wilson", email: "j.wilson@example.com", date: "2023-10-23T02:30:00", status: "Delivered", total: 34.2 },
        { id: "#ORD-7348", customer: "Lisa Chen", email: "lisa.chen@example.com", date: "2023-10-22T11:20:00", status: "Cancelled", total: 65.0 },
    ],
};

export const mockProducts = [
    { id: "P-1", name: "Organic Green Broccoli", category: "Vegetables", price: 4.98, stock: 120, sold: 340, status: "Active", emoji: "🥦" },
    { id: "P-2", name: "Farm Fresh Eggs", category: "Dairy", price: 6.99, stock: 80, sold: 280, status: "Active", emoji: "🥚" },
    { id: "P-3", name: "Whole Wheat Sourdough", category: "Bakery", price: 4.5, stock: 24, sold: 195, status: "Active", emoji: "🍞" },
    { id: "P-4", name: "Raw Local Honey", category: "Pantry", price: 8.99, stock: 56, sold: 150, status: "Active", emoji: "🍯" },
    { id: "P-5", name: "Fresh Hass Avocados", category: "Fruits", price: 5.99, stock: 0, sold: 110, status: "Out of Stock", emoji: "🥑" },
    { id: "P-6", name: "Baby Spinach 250g", category: "Vegetables", price: 2.4, stock: 95, sold: 88, status: "Active", emoji: "🥬" },
    { id: "P-7", name: "Full Cream Milk 1L", category: "Dairy", price: 1.2, stock: 210, sold: 420, status: "Inactive", emoji: "🥛" },
    { id: "P-8", name: "Alphonso Mangoes 1kg", category: "Fruits", price: 9.5, stock: 40, sold: 64, status: "Active", emoji: "🥭" },
];

export const mockOrders = [
    { id: "#ORD-7352", customer: "Sarah Jenkins", email: "sarah.j@example.com", items: 5, date: "2023-10-24T10:24:00", status: "Delivered", total: 45.9 },
    { id: "#ORD-7351", customer: "Mike Thompson", email: "mike.t@example.com", items: 9, date: "2023-10-24T09:12:00", status: "Processing", total: 112.5 },
    { id: "#ORD-7350", customer: "Emily Davis", email: "emily.d@example.com", items: 6, date: "2023-10-23T16:45:00", status: "Shipped", total: 89.0 },
    { id: "#ORD-7349", customer: "James Wilson", email: "j.wilson@example.com", items: 3, date: "2023-10-23T14:30:00", status: "Delivered", total: 34.2 },
    { id: "#ORD-7348", customer: "Lisa Chen", email: "lisa.chen@example.com", items: 4, date: "2023-10-22T11:20:00", status: "Cancelled", total: 65.0 },
    { id: "#ORD-7347", customer: "Arjun Mehta", email: "arjun.m@example.com", items: 2, date: "2023-10-22T09:05:00", status: "Processing", total: 18.4 },
    { id: "#ORD-7346", customer: "Priya Nair", email: "priya.n@example.com", items: 7, date: "2023-10-21T18:40:00", status: "Delivered", total: 74.3 },
    { id: "#ORD-7345", customer: "Tom Baker", email: "tom.b@example.com", items: 1, date: "2023-10-21T12:15:00", status: "Shipped", total: 12.99 },
];

export const mockCustomers = [
    { id: "C-1", name: "Sarah Jenkins", email: "sarah.j@example.com", orders: 18, spent: 612.4, lastOrder: "2023-10-24" },
    { id: "C-2", name: "Mike Thompson", email: "mike.t@example.com", orders: 12, spent: 540.9, lastOrder: "2023-10-24" },
    { id: "C-3", name: "Emily Davis", email: "emily.d@example.com", orders: 9, spent: 305.2, lastOrder: "2023-10-23" },
    { id: "C-4", name: "James Wilson", email: "j.wilson@example.com", orders: 6, spent: 190.75, lastOrder: "2023-10-23" },
    { id: "C-5", name: "Lisa Chen", email: "lisa.chen@example.com", orders: 4, spent: 120.0, lastOrder: "2023-10-22" },
    { id: "C-6", name: "Arjun Mehta", email: "arjun.m@example.com", orders: 3, spent: 58.3, lastOrder: "2023-10-22" },
];

export const mockAnalytics = {
    kpis: [
        { label: "Average order value", value: 19.83, format: "currency" },
        { label: "Repeat customers", value: 41.2, format: "percent" },
        { label: "On-time delivery", value: 97.1, format: "percent" },
        { label: "Cancellation rate", value: 3.4, format: "percent" },
    ],
    revenueTrend: [
        { label: "Week 1", revenue: 4800, orders: 190 },
        { label: "Week 2", revenue: 5400, orders: 215 },
        { label: "Week 3", revenue: 5100, orders: 204 },
        { label: "Week 4", revenue: 6200, orders: 248 },
        { label: "Week 5", revenue: 6900, orders: 271 },
        { label: "Week 6", revenue: 7400, orders: 292 },
    ],
    orderStatus: [
        { name: "Delivered", value: 68 },
        { name: "Processing", value: 14 },
        { name: "Shipped", value: 15 },
        { name: "Cancelled", value: 3 },
    ],
    topProducts: [
        { name: "Organic Green Broccoli", sold: 340 },
        { name: "Farm Fresh Eggs", sold: 280 },
        { name: "Whole Wheat Sourdough", sold: 195 },
        { name: "Raw Local Honey", sold: 150 },
        { name: "Fresh Hass Avocados", sold: 110 },
    ],
    ratings: [
        { stars: "5 star", count: 412 },
        { stars: "4 star", count: 128 },
        { stars: "3 star", count: 34 },
        { stars: "2 star", count: 11 },
        { stars: "1 star", count: 6 },
    ],
};

export const mockReviews = [
    { id: "R-1", customer: "Sarah Jenkins", product: "Organic Green Broccoli", rating: 5, comment: "Super fresh and crunchy. Packed really well too.", date: "2023-10-24" },
    { id: "R-2", customer: "Mike Thompson", product: "Farm Fresh Eggs", rating: 5, comment: "Best eggs I have had in a long time.", date: "2023-10-23" },
    { id: "R-3", customer: "Emily Davis", product: "Whole Wheat Sourdough", rating: 4, comment: "Great taste, but it arrived a little late.", date: "2023-10-22" },
    { id: "R-4", customer: "James Wilson", product: "Raw Local Honey", rating: 5, comment: "Rich flavour and the jar was sealed properly.", date: "2023-10-21" },
    { id: "R-5", customer: "Lisa Chen", product: "Fresh Hass Avocados", rating: 3, comment: "Two of the avocados were over-ripe.", date: "2023-10-20" },
];
