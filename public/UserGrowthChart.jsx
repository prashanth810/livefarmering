import { FiMoreHorizontal } from "react-icons/fi";
import Card from "../common/Card";
import RevenueChart from "../charts/RevenueChart";

export default function RevenueOverview({ data }) {
    return (
        <Card
            title="Revenue Overview"
            className="h-full"
            action={
                <button type="button" aria-label="More options" className="text-slate-400 hover:text-slate-600">
                    <FiMoreHorizontal size={18} />
                </button>
            }
        >
            <RevenueChart data={data} height={240} />
        </Card>
    );
}
