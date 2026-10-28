import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Register from "./pages/Authpages/Register";
import VendorRegister from "./pages/Authpages/VendorRegister";
import VendorLogin from "./pages/Authpages/VendorLogin";
import UserLogin from "./pages/Authpages/UserLogin";
import ProfilePage from "./pages/Authpages/ProfilePage";
import NavBar from "./pages/navbar/NavBar";
import HomePage from "./pages/Home_page/HomePage";
import Footer from "./pages/footer/Footer";
import SearchResults from "./pages/productdetails/SearchResults";
import ProductDetails from "./pages/productdetails/ProductDetails";
import CartPage from "./pages/cartpage/CartPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import ContactPage from "./pages/contact/Contactpage";
import CheckoutPage from "./pages/checkout/Checkoutpage";
import MyOrdersPage from "./pages/profile/Myorderspage";
import AccountSettings from "./pages/settings/Accountsettings";
import OrderSuccess from "./pages/checkout/OrderSuccess";
import TrackOrder from "./pages/track/Trackorder";
import OrderDetails from "./pages/profile/Orderdetails";
import Forgotpassword from "./pages/forgot-password/Forgotpassword";
import Otpsession from "./pages/forgot-password/Otpsession";
import Resetpassword from "./pages/forgot-password/Resetpassword"; 
import ManageAddresses from "./pages/manageaddress/Manageaddresses";

// Home
const Home = () => (
  <>
    <HomePage />
  </>
);

// Placeholder pages
const About = () => <p>About page</p>;
const Contact = () => <> <ContactPage /> </>;

const useIsAuthenticated = () => {
  const loginToken = useSelector((state) => state.auth.login.token);
  const registerToken = useSelector((state) => state.auth.register.token);
  const sessionToken = sessionStorage.getItem("token");

  return Boolean(loginToken || registerToken || sessionToken);
};

const PublicOnlyRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const location = useLocation();

  // Authentication pages where Navbar should NOT appear
  const authPages = [
    "/login",
    "/register",
    "/vendor-login",
    "/vendor-register",
    '/forgot-password',
    '/otp',
    '/reset-password'
  ];

  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      {/* Show Navbar only on non-auth pages */}
      {!isAuthPage && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <UserLogin />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MyOrdersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <Forgotpassword />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/otp"
          element={
            <PublicOnlyRoute>
              <Otpsession />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <Resetpassword />
            </PublicOnlyRoute>
          }
        />

        <Route path="/contact" element={<Contact />} />

        <Route path="/shop" element={<SearchResults />} />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <WishlistPage />
            </PrivateRoute>
          }
        />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/product-details/:productId" element={<ProductDetails />} />

        <Route
          path="/vendor-register"
          element={<VendorRegister />}
        />

        <Route
          path="/vendor-login"
          element={<VendorLogin />}
        />

        {/* check out page */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/addresses"
          element={
            <PrivateRoute>
              <ManageAddresses />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AccountSettings />
            </PrivateRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/track-order/:orderId"
          element={
            <PrivateRoute>
              <TrackOrder />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
      </Routes>


      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;