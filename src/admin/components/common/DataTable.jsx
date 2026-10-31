import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * columns: [{ key, header, render?(row), className? }]
 * pageSize: optional - enables client side pagination
 */
export default function DataTable({ columns, rows = [], loading, emptyText = "No records found", rowKey = "id", pageSize }) {
    const [page, setPage] = useState(1);

    const totalPages = pageSize ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
    const currentPage = Math.min(page, totalPages);
    const visible = pageSize ? rows.slice((currentPage - 1) * pageSize, currentPage * pageSize) : rows;

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="border-b border-slate-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-4">
                                            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading &&
                            visible.map((row) => (
                                <tr key={row[rowKey]} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                                    {columns.map((col) => (
                                        <td key={col.key} className={`px-4 py-4 text-slate-700 ${col.className || ""}`}>
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {!loading && visible.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                                    {emptyText}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pageSize && !loading && rows.length > pageSize && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 pt-4 text-sm text-slate-500">
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                            className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                            className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
