import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FeedbackSupport from "./components/common/FeedbackSupport";
import ProfilePage from "./pages/ProfilePage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Questions from "./pages/Questions";
import Pricing from "./pages/Pricing";
import PaidTherapy from "./pages/PaidTherapy";
import CounsellingPage from "./pages/CounselingPage";
import AssignmentPage from "./pages/AssignmentPage";
import { AuthProvider } from "./context/AuthContext.jsx";
import FreeTherapy from "./pages/FreeTherapy.jsx";
import Hypnotherapy from "./pages/Hypnotherapy.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import LoginSuccessHandler from './components/features/auth/LoginSuccessHandler';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-success" element={<LoginSuccessHandler />} />
        <Route path="/signin" element={<Register />} />
        <Route path="/feedback" element={<FeedbackSupport />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/Question" element={<Questions />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/paid" element={<PaidTherapy />} />
        <Route path="/counselling" element={<CounsellingPage />} />
        <Route path="/assignment" element={<AssignmentPage />} />
        <Route path="/free-therapy" element={<FreeTherapy />} />
        <Route path="/hypnotherapy" element={<Hypnotherapy />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
