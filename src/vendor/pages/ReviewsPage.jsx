import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiStar } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import ErrorBanner from "../components/common/ErrorBanner";
import Avatar from "../components/common/Avatar";
import { fetchReviews } from "../redux/slices/ReviewsSlice";
import { formatDate } from "../utils/format";

const Stars = ({ value }) => (
    <span className="flex gap-0.5" aria-label={`${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <FiStar key={i} size={14} className={i < value ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
        ))}
    </span>
);

export default function ReviewsPage() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((s) => s.reviews);

    useEffect(() => {
        dispatch(fetchReviews());
    }, [dispatch]);

    return (
        <>
            <PageHeader title="Reviews" subtitle="What customers are saying about your products." />
            <ErrorBanner message={error} onRetry={() => dispatch(fetchReviews())} />

            <Card>
                {loading && <div className="h-40 animate-pulse rounded bg-slate-100" />}
                {!loading && list.length === 0 && <p className="py-10 text-center text-slate-400">No reviews yet</p>}
                <ul className="divide-y divide-slate-100">
                    {!loading &&
                        list.map((r) => (
                            <li key={r.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                <Avatar name={r.customer} size="md" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <p className="font-semibold text-slate-900">{r.customer}</p>
                                        <Stars value={r.rating} />
                                        <span className="text-xs text-slate-400">{formatDate(r.date)}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-emerald-700">{r.product}</p>
                                    <p className="mt-2 text-sm text-slate-700">{r.comment}</p>
                                </div>
                            </li>
                        ))}
                </ul>
            </Card>
        </>
    );
}
