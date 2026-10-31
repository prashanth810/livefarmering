import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatCurrency } from "../../utils/format";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function RevenueChart({ data = [], height = 260 }) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={CHART_COLORS.green} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="label" {...axisProps} />
                    <YAxis {...axisProps} width={48} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(v, 0), "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.green} strokeWidth={2.5} fill="url(#revenueFill)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
