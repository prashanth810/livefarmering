import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useStore } from "react-redux";
import VendorSidebar from "./VendorSidebar";
import VendorTopbar from "./VendorTopbar";
import { fetchDashboard } from "../redux/slices/DashboardSlice";
import "../vendor.css";

export default function VendorLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const store = useStore();

    // Load the dashboard once so the sidebar "Orders" badge works on every page
    useEffect(() => {
        const { loaded, loading } = store.getState().dashboard;
        if (!loaded && !loading) dispatch(fetchDashboard("week"));
    }, [dispatch, store]);

    return (
        <div className="vendor-root min-h-screen bg-slate-50 text-slate-900">
            <VendorSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="lg:pl-64">
                <VendorTopbar onMenuClick={() => setMenuOpen(true)} />
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
