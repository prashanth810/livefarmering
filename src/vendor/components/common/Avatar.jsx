const COLORS = ["bg-emerald-100 text-emerald-700", "bg-orange-100 text-orange-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];

// Initials avatar; colour is picked from the name so it stays the same
export default function Avatar({ name = "", size = "sm" }) {
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    const color = COLORS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % COLORS.length];
    const dim = size === "md" ? "h-9 w-9 text-sm" : "h-8 w-8 text-xs";

    return <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${dim} ${color}`}>{initials}</span>;
}
