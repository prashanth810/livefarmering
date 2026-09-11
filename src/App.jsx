import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Authpages/Register";
import VendorRegister from "./pages/Authpages/VendorRegister";
import VendorLogin from "./pages/Authpages/VendorLogin";
import UserLogin from "./pages/Authpages/UserLogin";

// Placeholder pages — replace each <p> with the real page component
// once it exists, same way Register is wired up below.
const Home = () => <p>Home page</p>;
const About = () => <p>About page</p>;
const Contact = () => <p>Contact page</p>;

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
      </Routes>
    </>
  );
};

export default App;