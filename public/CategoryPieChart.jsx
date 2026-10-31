import { Link, useNavigate } from "react-router-dom";
import Card from "../common/Card";
import ApprovalsTable from "./ApprovalsTable";

export default function PendingApprovals({ rows, loading }) {
    const navigate = useNavigate();

    return (
        <Card
            title="Pending Vendor Approvals"
            action={
                <Link to="/admin/vendor-approvals" className="text-sm font-medium text-teal-600 hover:underline">
                    View All
                </Link>
            }
        >
            <ApprovalsTable rows={rows.slice(0, 3)} loading={loading} onReview={() => navigate("/admin/vendor-approvals")} />
        </Card>
    );
}
