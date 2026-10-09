export const fmtDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime())
        ? String(v)
        : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

export const groupOf = (status = "") => {
    const s = String(status).toLowerCase();
    if (["delivered", "completed"].includes(s)) return "completed";
    if (["cancelled", "canceled"].includes(s)) return "cancelled";
    return "processing";
};

// Accepts backend/dummy order shapes and returns one consistent shape for the UI.
export const normalizeOrder = (o) => {
    const group = groupOf(o.status);
    const items = Array.isArray(o.items) ? o.items : Array.isArray(o.products) ? o.products : [];
    return {
        raw: o,
        id: o.id ?? o._id ?? o.orderId,
        date: fmtDate(o.date ?? o.createdAt),
        total: o.total ?? o.totalAmount ?? 0,
        shippedTo: o.shippedTo ?? o.customerName ?? o.address?.name ?? "—",
        status: o.status,
        emoji: o.emoji ?? "🛒",
        group,
        statusDate: fmtDate(group === "completed" ? o.deliveredAt : o.expectedDelivery),
        items: items.map((it, i) => ({
            id: it.id ?? it._id ?? i,
            name: it.name ?? it.title ?? "Item",
            qty: it.qty ?? it.quantity ?? 1,
            price: it.price ?? 0,
            image: it.image ?? it.img ?? it.thumbnail,
        })),
    };
};