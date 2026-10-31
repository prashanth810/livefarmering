import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact } from "../../utils/format";
import { axisProps, CHART_COLORS, tooltipStyle } from "./chartTheme";

export default function UserGrowthChart({ data = [], height = 280 }) {
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                    <XAxis dataKey="label" {...axisProps} />
                    <YAxis {...axisProps} width={40} tickFormatter={formatCompact} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="newUsers" name="New users" stroke={CHART_COLORS.blue} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="returning" name="Returning users" stroke={CHART_COLORS.green} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
