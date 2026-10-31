import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatCurrency } from "../../utils/format";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function TopVendorsChart({ data = [], height = 280 }) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
                    <XAxis type="number" {...axisProps} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <YAxis type="category" dataKey="name" {...axisProps} width={130} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(v, 0), "Revenue"]} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="revenue" fill={CHART_COLORS.green} radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
