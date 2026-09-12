import { Routes, Route, useLocation } from "react-router-dom";

import Register from "./pages/Authpages/Register";
import VendorRegister from "./pages/Authpages/VendorRegister";
import VendorLogin from "./pages/Authpages/VendorLogin";
import UserLogin from "./pages/Authpages/UserLogin";
import NavBar from "./pages/navbar/NavBar";
import HomePage from "./pages/Home_page/HomePage";
import Footer from "./pages/footer/Footer";
import SearchResults from "./pages/SearchResults";

// Home
const Home = () => (
  <>
    <HomePage />
  </>
);

// Placeholder pages
const About = () => <p>About page</p>;
const Contact = () => <p>Contact page</p>;

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

        <Route path="/login" element={<UserLogin />} />

        <Route path="/register" element={<Register />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/search" element={<SearchResults />} />

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