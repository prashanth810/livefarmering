import { Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminApp from "../AdminApp";
import Adminloginpage from "../pages/authpage/Adminloginpage";
import Adminregister from "../pages/authpage/Adminregister";

// The only admin routes App.jsx needs. Put {adminRoutes} inside <Routes> in App.jsx.
//   /admin-login  = admin login page (open to everyone)
//   /admin/*      = admin panel (admin token required)
const adminRoutes = (
    <>
        <Route path="/admin-login" element={<Adminloginpage />} />
        <Route path="/admin-register" element={<Adminregister />} />
        <Route
            path="/admin/*"
            element={
                <AdminRoute>
                    <AdminApp />
                </AdminRoute>
            }
        />
    </>
);

export default adminRoutes;