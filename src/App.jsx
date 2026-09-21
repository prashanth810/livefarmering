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

// Home
const Home = () => (
  <>
    <HomePage />
  </>
);

// Placeholder pages
const About = () => <p>About page</p>;
const Contact = () => <p>Contact page</p>;

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
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
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
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;