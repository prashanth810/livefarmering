import { Provider } from "react-redux";
import AdminStore from "./redux/AdminStore";
import AdminPanelRoutes from "./router/AdminPanelRoutes";

// Mounted at /admin/* (see routes/adminRoutes.jsx). Uses its own Redux store.
export default function AdminApp() {
    return (
        <Provider store={AdminStore}>
            <AdminPanelRoutes />
        </Provider>
    );
}