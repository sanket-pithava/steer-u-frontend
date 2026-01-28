import React, { useState, useEffect, useContext } from "react";
import { X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
const PopupModal = ({ message, onClose, isError = false }) => (
    <AnimatePresence>
        {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white text-black p-6 rounded-2xl w-full max-w-sm text-center shadow-xl relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                    <div className="flex justify-center mb-4">
                        {isError ? <X size={48} className="text-red-500" /> : <CheckCircle size={48} className="text-green-500" />}
                    </div>
                    <h2 className="text-xl font-bold mb-2">{isError ? "Error" : "Success"}</h2>
                    <p className="text-gray-700">{message}</p>
                    <button onClick={onClose} className="bg-orange-600 text-white px-6 py-2 rounded-full w-full mt-6 hover:bg-orange-700 transition">OK</button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorPopup, setIsErrorPopup] = useState(false);

    const showErrorPopup = (message) => { setIsErrorPopup(true); setPopupMessage(message); };
    const showSuccessPopup = (message) => { setIsErrorPopup(false); setPopupMessage(message); };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    const handleSendOtp = async () => {
        if (!name || !email || !phone) { showErrorPopup("Please fill in Name, Email, and Phone number."); return; }
        if (phone.length !== 10) { showErrorPopup("Please enter a valid 10-digit phone number."); return; }
        setLoading(true);
        try {
            const response = await api.post('/api/auth/send-otp', { phone });
            showSuccessPopup(response.data.message || "OTP sent successfully!"); // Use backend message or a default
            setShowOtpModal(true);
        } catch (error) {
            console.error("Error sending OTP request:", error);
            showErrorPopup("Failed to request OTP. Is your backend server running?");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) { showErrorPopup("Please enter a 6-digit OTP."); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/api/auth/signup-verify-otp', { phone, otp, name, email });
            login(data.token);
            navigate("/");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showErrorPopup(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => { navigate("/"); };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange text-white">
            <PopupModal message={popupMessage} onClose={() => setPopupMessage(null)} isError={isErrorPopup} />

            {!showOtpModal ? (
                <motion.div
                    className="relative bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange rounded-2xl max-w-md w-full p-6 text-center shadow-card"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                    <button onClick={handleCancel} className="absolute top-3 right-3 text-white hover:text-yellow-300 transition-colors"><X size={28} /></button>
                    <h2 className="text-2xl font-bold mb-2 text-yellow-300">Create Account</h2>
                    <p className="text-sm mb-6 text-white/90">Sign up to get started.</p>
                    <div className="space-y-3 mb-4 text-left">
                        <input type="text" placeholder="Your Name *" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        <input type="email" placeholder="Your Email *" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        <div className="flex items-center bg-white text-black rounded-full px-3 py-2">
                            <select className="bg-transparent outline-none pr-2"><option>+91</option></select>
                            <input type="tel" placeholder="Enter Mobile number *" value={phone} onChange={(e) => setPhone(e.target.value)} required className="flex-1 bg-transparent outline-none text-sm text-black" /> {/* Text color black kiya gaya hai */}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className="w-full bg-yellow-300 text-black py-2 rounded-full font-semibold hover:brightness-110 transition" onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending OTP...' : 'Sign Up with OTP'}</button>
                        <button className="w-full text-white underline font-semibold hover:text-yellow-300 transition" onClick={handleCancel}>Cancel</button>
                    </div>
                    <p className="text-xs mt-3 text-white/80"> By signing up, you agree to our Terms and Privacy Policy. </p>
                </motion.div>
            ) : (
                <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-black to-brand-dark">
                    <motion.div className="relative bg-gradient-to-b from-black to-brand-dark rounded-2xl max-w-md w-full p-6 text-center shadow-card text-white" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                        <button onClick={handleCancel} className="absolute top-3 right-3 text-white hover:text-yellow-300 transition-colors"><X size={28} /></button>
                        <h3 className="uppercase text-sm font-semibold mb-2 text-yellow-300">Verify Your Phone</h3>
                        <div className="bg-black/30 rounded-2xl p-5 space-y-4">
                            <h2 className="font-bold text-lg text-yellow-300">OTP Verification</h2>
                            <p className="text-sm">A 6 digit code has been sent to +91 {phone}</p>
                            <div className="flex justify-center">
                                <input
                                    type="tel"
                                    maxLength={6}
                                    placeholder="______"
                                    className="w-48 h-12 text-center text-2xl tracking-[0.5em] rounded-lg border border-gray-500 bg-white text-black" /* Background white, text black kiya gaya hai */
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <button className="w-full bg-yellow-300 text-black py-2 rounded-full font-semibold mt-3 hover:brightness-110 transition" onClick={handleVerifyOtp} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP & Sign Up'}
                            </button>
                            <button className="w-full text-sm text-gray-400 hover:text-white" onClick={() => setShowOtpModal(false)}> Change Number </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default SignUp;
