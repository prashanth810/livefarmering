import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatCurrency } from "../../utils/format";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function RevenueBars({ data = [], height = 280 }) {
    const max = Math.max(0, ...data.map((d) => d.revenue));

    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={CHART_COLORS.grid} strokeDasharray="2 3" vertical={false} />
                    <XAxis dataKey="label" {...axisProps} />
                    <YAxis {...axisProps} width={48} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "transparent" }} formatter={(v) => [formatCurrency(v, 0), "Revenue"]} />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={36}>
                        {data.map((d) => (
                            <Cell key={d.label} fill={d.revenue === max ? CHART_COLORS.green : CHART_COLORS.greenLight} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
