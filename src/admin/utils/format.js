export const formatCurrency = (value, fractionDigits = 2) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value ?? 0);

export const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value ?? 0);

export const formatCompact = (value) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);

export const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
