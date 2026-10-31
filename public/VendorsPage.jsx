import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../admin.css";

export default function AdminLayout() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="admin-root min-h-screen bg-slate-50 text-slate-900">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="lg:pl-64">
                <Topbar onMenuClick={() => setMenuOpen(true)} />
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
