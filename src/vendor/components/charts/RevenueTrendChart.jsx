import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact } from "../../utils/format";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function RevenueTrendChart({ data = [], height = 300 }) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#eef0f3" vertical={false} />
                    <XAxis dataKey="label" {...axisProps} />
                    <YAxis yAxisId="left" {...axisProps} width={48} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <YAxis yAxisId="right" orientation="right" {...axisProps} width={36} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill={CHART_COLORS.green} radius={[6, 6, 0, 0]} barSize={28} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke={CHART_COLORS.orange} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
