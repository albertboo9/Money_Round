import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/theme.css";
import "./styles/general.css";
// import Layout from "./component/Layout.jsx";
import LandingPage from "./page/LandingPage.jsx";
import Login from "./page/Login.jsx";
import Createaccount from "./page/Createaccount.jsx";
import Contact from "./page/Contact.jsx";
import UserHome from "./page/UserHome";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="create-account" element={<Createaccount />} />
        <Route path="contact" element={<Contact />} />
        <Route path="Home" element={<UserHome />} />
      </Routes>
    </Router>
  );
}

export default App;
