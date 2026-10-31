import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function TopProductsBar({ data = [], height = 280 }) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid stroke="#eef0f3" horizontal={false} />
                    <XAxis type="number" {...axisProps} />
                    <YAxis type="category" dataKey="name" {...axisProps} width={150} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} formatter={(v) => [v, "Units sold"]} />
                    <Bar dataKey="sold" fill={CHART_COLORS.green} radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
