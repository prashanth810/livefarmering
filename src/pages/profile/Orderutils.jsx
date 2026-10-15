export const fmtDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime())
        ? String(v)
        : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

export const formatEstimatedDelivery = (order = {}) => {
    const formatDate = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? ""
            : date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    };

    const from = formatDate(order.estimatedDeliveryFrom ?? order.expectedDeliveryFrom);
    const to = formatDate(order.estimatedDeliveryTo ?? order.expectedDeliveryTo);
    if (from && to) return `${from} – ${to}`;
    if (from || to) return from || to;

    const fallback = order.expectedDelivery ?? order.estimatedDelivery;
    return fmtDate(fallback);
};

export const groupOf = (status = "") => {
    const s = String(status).toLowerCase();
    if (["delivered", "completed"].includes(s)) return "completed";
    if (["cancelled", "canceled"].includes(s)) return "cancelled";
    return "processing";
};

// Accepts backend/dummy order shapes and returns one consistent shape for the UI.
export const normalizeOrder = (o) => {
    const status = o.orderStatus ?? o.status;
    const group = groupOf(status);
    const items = Array.isArray(o.items) ? o.items : Array.isArray(o.products) ? o.products : [];
    return {
        raw: o,
        id: o.id ?? o._id ?? o.orderId,
        date: fmtDate(o.date ?? o.createdAt),
        total: o.total ?? o.totalAmount ?? 0,
        shippedTo: o.shippedTo ?? o.customerName ?? o.address?.full_name ?? o.address?.name ?? "—",
        status,
        emoji: o.emoji ?? "🛒",
        group,
        estimatedDelivery: group === "cancelled" ? "" : formatEstimatedDelivery(o),
        statusDate: fmtDate(o.deliveredAt),
        items: items.map((it, i) => ({
            id: it.id ?? it._id ?? i,
            name: it.name ?? it.title ?? "Item",
            qty: it.qty ?? it.quantity ?? 1,
            price: it.price ?? 0,
            image: it.image ?? it.img ?? it.thumbnail,
        })),
    };
};