import React, { useState } from "react";
import { CheckCircle, X, HelpingHand, Bug, Lock, CreditCard, MessageSquare } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const PopupModal = ({ message, onClose, isError = false }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white text-black p-6 rounded-2xl w-full max-w-sm text-center shadow-xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
          <div className="flex justify-center mb-4">
            {isError ? <X size={48} className="text-red-500" /> : <CheckCircle size={48} className="text-green-500" />}
          </div>
          <h2 className="text-xl font-bold mb-2">{isError ? "Error" : "Success"}</h2>
          <p className="text-gray-700">{message}</p>
          <button
            onClick={onClose}
            className="bg-orange-600 text-white px-6 py-2 rounded-full w-full mt-6 hover:bg-orange-700 transition"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const FeedbackSupport = () => {
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorPopup, setIsErrorPopup] = useState(false);

  const showErrorPopup = (msg) => { setIsErrorPopup(true); setPopupMessage(msg); };
  const showSuccessPopup = (msg) => { setIsErrorPopup(false); setPopupMessage(msg); };

  const handleSubmit = async () => {
    if (!issueType || !message.trim()) {
      showErrorPopup("Please select an issue and enter your message.");
      return;
    }

    if (!contact.trim()) {
      showErrorPopup("Please enter your Email or Phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        issueType,
        message,
        contact,
        timestamp: new Date().toISOString(),
      };

      const response = await api.post('/api/support/submit', payload);

      showSuccessPopup(response.data.message || "Your message has been sent successfully!");

      setIssueType("");
      setMessage("");
      setContact("");

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message.";
      showErrorPopup(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const issueOptions = [
    { value: "login", label: "Login Issue", icon: <Lock size={20} /> },
    { value: "payment", label: "Payment Issue", icon: <CreditCard size={20} /> },
    { value: "bug", label: "Bug Report", icon: <Bug size={20} /> },
    { value: "other", label: "Other", icon: <MessageSquare size={20} /> },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822] text-white flex flex-col">
      <Navbar />

      <PopupModal
        message={popupMessage}
        onClose={() => setPopupMessage(null)}
        isError={isErrorPopup}
      />
      <div className="flex-1 flex mt-20 flex-col items-center px-4 py-6">
        <div className="flex items-center w-full max-w-md mb-6">
          <h1 className="flex text-center mt-12 text-2xl font-bold text-yellow-300">
            <HelpingHand size={28} className="mr-2" /> Feedback & Support
          </h1>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-2xl w-full max-w-md p-6 shadow-lg space-y-6 border border-white/20">
          <div>
            <label className="block text-white font-semibold mb-2">Issue Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {issueOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIssueType(option.value)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${issueType === option.value
                    ? "bg-white text-orange-600 border-white"
                    : "bg-black/20 border-white/40 hover:bg-white/10"
                    }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Email or Phone *</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter Email or Phone"
              className="w-full px-4 py-3 rounded-md bg-black/20 border border-white/40 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-300"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-2">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              className="w-full h-28 rounded-md px-4 py-3 bg-black/20 border border-white/40 text-white placeholder-gray-300 focus:ring-2 focus:ring-yellow-300"
              disabled={isSubmitting}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-white text-orange-600 py-3 font-semibold rounded-md"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeedbackSupport;
