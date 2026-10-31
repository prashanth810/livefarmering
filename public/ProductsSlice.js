export const mockDashboard = {
    stats: [
        { key: "revenue", label: "Total Revenue", value: 124563, format: "currency", change: 14.5 },
        { key: "orders", label: "Total Orders", value: 8432, format: "number", change: 8.2 },
        { key: "users", label: "Total Users", value: 45231, format: "number", change: 12.1 },
        { key: "vendors", label: "Active Vendors", value: 342, format: "number", change: -2.4 },
    ],
    revenue: [
        { label: "Mon", revenue: 12400 },
        { label: "Tue", revenue: 18200 },
        { label: "Wed", revenue: 15100 },
        { label: "Thu", revenue: 22800 },
        { label: "Fri", revenue: 26400 },
        { label: "Sat", revenue: 24100 },
        { label: "Sun", revenue: 19600 },
    ],
    categories: [
        { name: "Fruits & Vegetables", percent: 42 },
        { name: "Dairy & Eggs", percent: 28 },
        { name: "Meat & Seafood", percent: 18 },
        { name: "Bakery & Bread", percent: 12 },
    ],
};

export const mockAnalytics = {
    kpis: [
        { label: "Average order value", value: 14.77, format: "currency" },
        { label: "Repeat customer rate", value: 38.4, format: "percent" },
        { label: "Order fulfilment rate", value: 96.2, format: "percent" },
        { label: "Cancellation rate", value: 2.9, format: "percent" },
    ],
    revenueOrders: [
        { label: "May", revenue: 78000, orders: 5200 },
        { label: "Jun", revenue: 86500, orders: 5800 },
        { label: "Jul", revenue: 94200, orders: 6350 },
        { label: "Aug", revenue: 101800, orders: 6900 },
        { label: "Sep", revenue: 112400, orders: 7600 },
        { label: "Oct", revenue: 124563, orders: 8432 },
    ],
    userGrowth: [
        { label: "May", newUsers: 2100, returning: 5400 },
        { label: "Jun", newUsers: 2450, returning: 5900 },
        { label: "Jul", newUsers: 2800, returning: 6600 },
        { label: "Aug", newUsers: 3100, returning: 7200 },
        { label: "Sep", newUsers: 3600, returning: 8100 },
        { label: "Oct", newUsers: 4200, returning: 9300 },
    ],
    categoryShare: [
        { name: "Fruits & Vegetables", value: 42 },
        { name: "Dairy & Eggs", value: 28 },
        { name: "Meat & Seafood", value: 18 },
        { name: "Bakery & Bread", value: 12 },
    ],
    topVendors: [
        { name: "Green Valley Farms", revenue: 18400 },
        { name: "Daily Fresh Dairy", revenue: 15200 },
        { name: "Ocean Catch Co.", revenue: 12900 },
        { name: "Golden Crust Bakery", revenue: 9800 },
        { name: "Prime Cuts Butchery", revenue: 8700 },
    ],
};

export const mockVendors = [
    { id: "V-1001", shop: "Green Valley Farms", owner: "Ravi Kumar", email: "hello@greenvalley.in", category: "Fruits & Vegetables", city: "Hyderabad", products: 124, revenue: 18400, status: "Active" },
    { id: "V-1002", shop: "Daily Fresh Dairy", owner: "Anita Rao", email: "info@dailyfresh.net", category: "Dairy & Eggs", city: "Bengaluru", products: 58, revenue: 15200, status: "Active" },
    { id: "V-1003", shop: "Ocean Catch Co.", owner: "Imran Shaikh", email: "sales@oceancatch.co", category: "Meat & Seafood", city: "Mumbai", products: 41, revenue: 12900, status: "Active" },
    { id: "V-1004", shop: "Golden Crust Bakery", owner: "Meera Nair", email: "orders@goldencrust.in", category: "Bakery & Bread", city: "Chennai", products: 36, revenue: 9800, status: "Active" },
    { id: "V-1005", shop: "Prime Cuts Butchery", owner: "John Mathew", email: "sales@primecuts.co", category: "Meat & Seafood", city: "Kochi", products: 29, revenue: 8700, status: "Suspended" },
    { id: "V-1006", shop: "Sunrise Organic Farms", owner: "Priya Singh", email: "contact@sunrisefarms.com", category: "Fruits & Vegetables", city: "Pune", products: 87, revenue: 7600, status: "Active" },
    { id: "V-1007", shop: "Spice Route Pantry", owner: "Arjun Reddy", email: "team@spiceroute.in", category: "Pantry", city: "Hyderabad", products: 203, revenue: 6400, status: "Inactive" },
    { id: "V-1008", shop: "Village Eggs", owner: "Lakshmi Devi", email: "care@villageeggs.in", category: "Dairy & Eggs", city: "Vijayawada", products: 12, revenue: 3100, status: "Active" },
];

export const mockApprovals = [
    { id: "A-2001", shop: "Sunrise Organic Farms", email: "contact@sunrisefarms.com", category: "Fruits & Vegetables", registeredOn: "2024-10-24", documents: "Verified", status: "Pending Review" },
    { id: "A-2002", shop: "Prime Cuts Butchery", email: "sales@primecuts.co", category: "Meat & Seafood", registeredOn: "2024-10-23", documents: "Incomplete", status: "Pending Docs" },
    { id: "A-2003", shop: "Daily Fresh Dairy", email: "info@dailyfresh.net", category: "Dairy & Breakfast", registeredOn: "2024-10-21", documents: "Verified", status: "Approved" },
    { id: "A-2004", shop: "Harvest Basket", email: "support@harvestbasket.in", category: "Fruits & Vegetables", registeredOn: "2024-10-20", documents: "Verified", status: "Pending Review" },
    { id: "A-2005", shop: "Coastal Fish Market", email: "hi@coastalfish.in", category: "Meat & Seafood", registeredOn: "2024-10-18", documents: "Incomplete", status: "Pending Docs" },
];

export const mockProducts = [
    { id: "P-3001", name: "Organic Tomatoes 1kg", vendor: "Green Valley Farms", category: "Fruits & Vegetables", price: 3.5, stock: 240, status: "Live" },
    { id: "P-3002", name: "Full Cream Milk 1L", vendor: "Daily Fresh Dairy", category: "Dairy & Eggs", price: 1.2, stock: 520, status: "Live" },
    { id: "P-3003", name: "Atlantic Salmon Fillet", vendor: "Ocean Catch Co.", category: "Meat & Seafood", price: 14.9, stock: 18, status: "Flagged" },
    { id: "P-3004", name: "Sourdough Loaf", vendor: "Golden Crust Bakery", category: "Bakery & Bread", price: 4.25, stock: 0, status: "Out of Stock" },
    { id: "P-3005", name: "Free-range Eggs (12)", vendor: "Village Eggs", category: "Dairy & Eggs", price: 3.1, stock: 310, status: "Live" },
    { id: "P-3006", name: "Chicken Breast 500g", vendor: "Prime Cuts Butchery", category: "Meat & Seafood", price: 6.8, stock: 64, status: "Flagged" },
    { id: "P-3007", name: "Baby Spinach 250g", vendor: "Sunrise Organic Farms", category: "Fruits & Vegetables", price: 2.4, stock: 95, status: "Live" },
    { id: "P-3008", name: "Basmati Rice 5kg", vendor: "Spice Route Pantry", category: "Pantry", price: 9.9, stock: 0, status: "Out of Stock" },
];

export const mockOrders = [
    { id: "#ORD-8432", customer: "Karthik N.", vendor: "Green Valley Farms", items: 6, amount: 42.5, status: "Delivered", date: "2024-10-24" },
    { id: "#ORD-8431", customer: "Sneha P.", vendor: "Daily Fresh Dairy", items: 3, amount: 12.9, status: "On the way", date: "2024-10-24" },
    { id: "#ORD-8430", customer: "Mohammed A.", vendor: "Ocean Catch Co.", items: 2, amount: 38.2, status: "Processing", date: "2024-10-24" },
    { id: "#ORD-8429", customer: "Divya R.", vendor: "Golden Crust Bakery", items: 4, amount: 18.75, status: "Delivered", date: "2024-10-23" },
    { id: "#ORD-8428", customer: "Rahul S.", vendor: "Prime Cuts Butchery", items: 1, amount: 21.0, status: "Cancelled", date: "2024-10-23" },
    { id: "#ORD-8427", customer: "Pooja M.", vendor: "Sunrise Organic Farms", items: 8, amount: 56.3, status: "Delivered", date: "2024-10-22" },
    { id: "#ORD-8426", customer: "Vikram T.", vendor: "Village Eggs", items: 2, amount: 7.4, status: "Processing", date: "2024-10-22" },
];

export const mockUsers = [
    { id: "U-4001", name: "Karthik Naidu", email: "karthik@example.com", orders: 42, spent: 612.4, joinedOn: "2024-02-11", status: "Active" },
    { id: "U-4002", name: "Sneha Patil", email: "sneha@example.com", orders: 31, spent: 428.9, joinedOn: "2024-03-02", status: "Active" },
    { id: "U-4003", name: "Mohammed Ali", email: "mohammed@example.com", orders: 18, spent: 305.2, joinedOn: "2024-04-19", status: "Active" },
    { id: "U-4004", name: "Divya Reddy", email: "divya@example.com", orders: 9, spent: 120.75, joinedOn: "2024-06-08", status: "Active" },
    { id: "U-4005", name: "Rahul Sharma", email: "rahul@example.com", orders: 2, spent: 34.0, joinedOn: "2024-09-14", status: "Blocked" },
    { id: "U-4006", name: "Pooja Menon", email: "pooja@example.com", orders: 25, spent: 389.3, joinedOn: "2024-05-27", status: "Active" },
];
