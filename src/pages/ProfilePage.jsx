import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { AuthContext } from "../context/AuthContext";
import { ChevronDown, ChevronUp, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LocationDropdown from "../components/common/LocationDropdown";


const Popup = ({ message, show }) => {
    if (!show) return null;
    return (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in-out">
            {message}
        </div>
    );
};

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("personal");
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const { profile, updateProfileData, logout, isLoading: isAuthLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [dob, setDob] = useState("");
    const [placeOfBirth, setPlaceOfBirth] = useState("");
    const [timeOfBirth, setTimeOfBirth] = useState("");
    const [gender, setGender] = useState("male");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [socialLogin, setSocialLogin] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
    const [predictionError, setPredictionError] = useState(null);
    const [openPredictionIndex, setOpenPredictionIndex] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [openBookingIndex, setOpenBookingIndex] = useState(null);
    useEffect(() => {
        if (profile) {
            setMobile(profile.phone || "");
            setEmail(profile.email || "");
            setSocialLogin(profile.socialLogin || "");
            setDob(profile.dob || "");
            setPlaceOfBirth(profile.placeOfBirth || "");
            setTimeOfBirth(profile.timeOfBirth || "");
            setGender(profile.gender || "male");
        }
    }, [profile]);
    useEffect(() => {
        if (location.state?.message) {
            showPopupMsg(location.state.message);
        }
        const fetchPredictions = async () => {
            setIsLoadingPredictions(true);
            setPredictionError(null);
            try {
                const { data } = await api.get("/api/predictions/my-predictions");
                setPredictions(data || []);
            } catch (error) {
                console.error("Failed to fetch predictions", error);
                setPredictionError("Could not load prediction history.");
            } finally {
                setIsLoadingPredictions(false);
            }
        };
        const fetchBookings = async () => {
            setIsLoadingBookings(true);
            setBookingError(null);
            try {
                const { data } = await api.get("/api/bookings/my-bookings");
                setBookings(data || []);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
                setBookingError("Could not load booking history.");
            } finally {
                setIsLoadingBookings(false);
            }
        };
        if (!isAuthLoading && profile) {
            fetchPredictions();
            fetchBookings();
        }
    }, [location.state, profile, isAuthLoading]);
    const showPopupMsg = (msg) => {
        setPopupMessage(msg);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    const handleLogout = () => {
        logout();
        showPopupMsg("Logged out successfully!");
        setTimeout(() => navigate("/login"), 1500);
    };
    const handleSubmitPersonal = async (e) => {
        e.preventDefault();

        try {
            const profileData = {
                dob,
                placeOfBirth,
                timeOfBirth,
                gender,
                phone: mobile,
                email: email,
                socialLogin: socialLogin
            };
            if (!mobile && !email && !socialLogin) {
                showPopupMsg("Please fill in at least one primary contact method (Mobile, Email, or Social Login) to save your profile.");
                return;
            }
            await api.put("/api/profile/update", profileData);
            updateProfileData(profileData);

            showPopupMsg("Personal Info updated!");
            if (location.state?.from) {
                setTimeout(() => navigate(location.state.from), 1500);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            showPopupMsg("Error updating profile. Please try again.");
        }
    };
    const togglePrediction = (index) => {
        setOpenPredictionIndex(openPredictionIndex === index ? null : index);
    };

    const toggleBooking = (index) => {
        setOpenBookingIndex(openBookingIndex === index ? null : index);
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange text-white flex flex-col">
            <Navbar />
            <Popup message={popupMessage} show={showPopup} />

            <div className="flex flex-col items-center mt-4 flex-1 px-4 pt-24 pb-8">
                <div className="bg-white text-black mt-8 rounded-3xl w-full max-w-3xl shadow-xl p-6 md:p-12 flex flex-col items-start gap-8">
                    <div className="w-full">
                        <div className="flex border-b border-gray-300 mb-6">
                            <button
                                className={`pb-2 font-semibold w-1/3 text-center text-sm md:text-base ${activeTab === "personal"
                                    ? "text-black border-b-4 border-orange-500"
                                    : "text-gray-400 hover:text-black"
                                    }`}
                                onClick={() => setActiveTab("personal")}
                            >
                                Personal Info
                            </button>
                            <button
                                className={`pb-2 font-semibold w-1/3 text-center text-sm md:text-base ${activeTab === "predictions"
                                    ? "text-black border-b-4 border-orange-500"
                                    : "text-gray-400 hover:text-black"
                                    }`}
                                onClick={() => setActiveTab("predictions")}
                            >
                                My Predictions
                            </button>
                            <button
                                className={`pb-2 font-semibold w-1/3 text-center text-sm md:text-base ${activeTab === "bookings"
                                    ? "text-black border-b-4 border-orange-500"
                                    : "text-gray-400 hover:text-black"
                                    }`}
                                onClick={() => setActiveTab("bookings")}
                            >
                                My Bookings
                            </button>
                        </div>
                        {activeTab === "personal" && (
                            <form className="space-y-4" onSubmit={handleSubmitPersonal}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Mobile</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            placeholder="Enter your mobile number"
                                            maxLength="10"
                                            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-300 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-300 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Social Login</label>
                                        <input
                                            type="text"
                                            name="socialLogin"
                                            value={socialLogin}
                                            onChange={(e) => setSocialLogin(e.target.value)}
                                            placeholder="Login via Google / Facebook / Apple"
                                            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-300 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Date Of Birth</label>
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-300 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Time Of Birth</label>
                                        <input
                                            type="time" value={timeOfBirth} onChange={(e) => setTimeOfBirth(e.target.value)}
                                            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-300 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Place Of Birth</label>
                                        {/* <input
                                            type="text" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)}
                                            className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-300 outline-none"
                                            placeholder="City, State, Country"
                                        /> */}
                                        <LocationDropdown
                                            value={selfData.placeOfBirth}
                                            onChange={(val) =>
                                                setSelfData(prev => ({ ...prev, placeOfBirth: val }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 mt-2">
                                    <span className="text-gray-500 font-semibold">Gender:</span>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")} className="accent-orange-500" /> Male
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")} className="accent-orange-500" /> Female
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors mt-4"
                                >
                                    Update Personal Info
                                </button>
                                <div className="flex justify-center mt-6">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 bg-gray-200 text-black px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-gray-300 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </form>
                        )}
                        {activeTab === "predictions" && (
                            <div className="space-y-4">
                                {isLoadingPredictions ? (
                                    <p className="text-center text-gray-500">Loading predictions...</p>
                                ) : predictionError ? (
                                    <p className="text-center text-red-500">{predictionError}</p>
                                ) : predictions.length === 0 ? (
                                    <p className="text-center text-gray-500">You haven't asked any questions yet.</p>
                                ) : (
                                    predictions.map((pred, index) => (
                                        <div key={pred.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <button onClick={() => togglePrediction(index)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                                <span className="font-medium text-left">{pred.question}</span>
                                                {openPredictionIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                            <AnimatePresence>
                                                {openPredictionIndex === index && (
                                                    <motion.div initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                                        <div className="p-4 border-t border-gray-200 bg-white">
                                                            <p className="whitespace-pre-wrap">{pred.answer}</p>
                                                            {pred.details && (
                                                                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                                                                    <p><strong>Details Used:</strong></p>
                                                                    {pred.details.dob && (
                                                                        <p>DOB: {pred.details.dob}, Time: {pred.details.timeOfBirth}, Place: {pred.details.placeOfBirth}</p>
                                                                    )}
                                                                    {pred.details.selfData && (
                                                                        <p>Self: {pred.details.selfData.dateOfBirth}, {pred.details.selfData.timeOfBirth}</p>
                                                                    )}
                                                                    {pred.details.otherData && (
                                                                        <p>Other: {pred.details.otherData.dateOfBirth}, {pred.details.otherData.timeOfBirth}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === "bookings" && (
                            <div className="space-y-4">
                                {isLoadingBookings ? (
                                    <p className="text-center text-gray-500">Loading bookings...</p>
                                ) : bookingError ? (
                                    <p className="text-center text-red-500">{bookingError}</p>
                                ) : bookings.length === 0 ? (
                                    <p className="text-center text-gray-500">You haven't booked any therapy sessions yet.</p>
                                ) : (
                                    bookings.map((booking, index) => (
                                        <div key={booking.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => toggleBooking(index)}
                                                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                                            >
                                                <div className="text-left">
                                                    <span className="font-medium">Dr. {booking.doctor}</span>
                                                    <span className="block text-sm text-gray-600">{booking.date} at {booking.slot}</span>
                                                </div>
                                                {openBookingIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                            <AnimatePresence>
                                                {openBookingIndex === index && (
                                                    <motion.div initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                                        <div className="p-4 border-t border-gray-200 bg-white text-sm text-gray-700 space-y-2">
                                                            <p><strong>Booking for:</strong> {booking.supportFor} ({booking.pseudoName})</p>
                                                            <p><strong>Amount Paid:</strong> ₹{booking.amountPaid} ({booking.currency})</p>
                                                            <p><strong>Contact:</strong> {booking.mobile}</p>
                                                            <p><strong>Address:</strong> {booking.address}</p>
                                                            <p><strong>Language:</strong> {booking.language}</p>
                                                            {booking.services && booking.services.length > 0 && (
                                                                <p><strong>Services:</strong> {booking.services.join(', ')}</p>
                                                            )}
                                                            <p className="text-xs text-gray-400 pt-2 border-t mt-2">Payment ID: {booking.paymentId}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;