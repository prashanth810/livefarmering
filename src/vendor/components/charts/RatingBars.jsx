import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function RatingBars({ data = [], height = 280 }) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#eef0f3" vertical={false} />
                    <XAxis dataKey="stars" {...axisProps} />
                    <YAxis {...axisProps} width={36} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8fafc" }} formatter={(v) => [v, "Reviews"]} />
                    <Bar dataKey="count" fill={CHART_COLORS.orange} radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
