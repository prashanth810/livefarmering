export const CHART_COLORS = {
    green: "#059669",
    greenLight: "#cdeadf",
    orange: "#f97316",
    blue: "#3b82f6",
    red: "#dc2626",
    grid: "#d5d9de",
    axis: "#94a3b8",
};

export const PIE_COLORS = [CHART_COLORS.green, CHART_COLORS.orange, CHART_COLORS.blue, CHART_COLORS.red];

export const axisProps = {
    tickLine: false,
    axisLine: false,
    tick: { fill: CHART_COLORS.axis, fontSize: 12 },
};

export const tooltipStyle = {
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 12,
    boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
};
