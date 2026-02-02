import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom'; // Import navigation hooks
import axios from "axios";

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- Therapist and Package Data (Unchanged) ---
const therapistTiers = [
    { id: 'junior', price: 1200, oldPrice: 1500, title: "Per Session", description: "RCI Registered Junior Psychotherapist (2–4 years experience)", details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "2–4 years experience (RCI Registered Junior Psychotherapist)"] },
    { id: 'senior', price: 1500, oldPrice: 2000, title: "Per Session", description: "RCI Registered Senior Psychotherapist (5–7 years experience)", details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "5-7 years experience (RCI Registered Senior Psychotherapist)"] },
    { id: 'super-senior-1', price: 1800, oldPrice: 2500, title: "Per Session", description: "RCI Registered Super Senior Psychotherapist (8+ years experience)", details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "8+ years experience (RCI Registered Super Senior Psychotherapist)"] },
    { id: 'super-senior-2', price: 2000, oldPrice: 2800, title: "Per Session", description: "RCI Registered Super Senior Psychotherapist (9–10 years experience)", details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "9-10 years experience (RCI Registered Super Senior Psychotherapist)"] },
    { id: 'expert', price: 2500, oldPrice: 3200, title: "Per Session", description: "RCI Registered Expert Psychotherapist (10+ years experience)", details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "10+ years experience (RCI Registered Psychotherapist)"] },
];

const packageDeals = [
    {
        id: 'pack_6',
        sessions: 6,
        pack: "6 sessions pack",
        discountPercent: 10, // 10%
        description: "Get 10% off on 6 sessions",
        details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "Validity – 3 Months"]
    },
    {
        id: 'pack_10',
        sessions: 10,
        pack: "10 sessions pack",
        discountPercent: 15, // 15%
        description: "Get 15% off on 10 sessions",
        details: ["Each session is 30 minutes", "Cancellation shall be charged at 50%", "Validity – 6 Months"]
    },
];

const therapistsForModal = [
    { id: 2, name: "Dr. Sachidananda Nath", fee: 1500, description: "RCI Registered Senior Psychotherapist (6+ Years)" },
    { id: 3, name: "Dr. Ashish Rathore", fee: 1500, description: "RCI Registered Senior Psychotherapist (7+ Years)" },
    { id: 5, name: "Dr. Neelam Chejara", fee: 1500, description: "RCI Registered Senior Psychotherapist (5.5+ Years)" },
    { id: 4, name: "Mr. Sai Mann Verma", fee: 1500, description: "Behaviour Analyst (RBT) (10+ Years)" },
    { id: 6, name: "Mrs. Aparajita Katoch", fee: 1500, description: "International Certified Autism Therapist (9+ Years)" },
    { id: 1, name: "Mrs. Ruchi Goyal", fee: 2000, description: "Clinical Psychologist, Singapore Affiliation (10+ Years)" },

];

const tierMultipliers = {
  junior: 1200 / 7200,
  senior: 1500 / 7200,
  'super-senior-1': 1800 / 7200,
  'super-senior-2': 2000 / 7200,
  expert: 2500 / 7200,
};

const oldMultipliers = {
  junior: 1500 / 7200,
  senior: 2000 / 7200,
  'super-senior-1': 2500 / 7200,
  'super-senior-2': 2800 / 7200,
  expert: 3200 / 7200,
};

const therapistMultipliers = {
  1: 2000 / 7200, // Ruchi Goyal
  2: 1500 / 7200,
  3: 1500 / 7200,
  4: 1500 / 7200,
  5: 1500 / 7200,
  6: 1500 / 7200,
};

// --- 🌟 UPDATED POPUP MODAL (Accepts custom action) 🌟 ---
const PopupModal = ({ message, onClose, isError = false, onConfirmAction }) => (
    <AnimatePresence>
        {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white text-black p-6 rounded-2xl w-full max-w-sm text-center shadow-xl relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                    <p className="text-gray-700 text-base">{message}</p>
                    <button
                        onClick={onConfirmAction || onClose} // Use custom action if present
                        className="bg-orange-600 text-white px-6 py-2 rounded-full w-full mt-6 hover:bg-orange-700 transition text-base font-semibold"
                    >
                        {onConfirmAction ? "GO TO LOGIN" : "OK"}
                    </button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const customPackages = [
    { id: 1, price: 5100, usd: 56.75, questions: 10, delivery: "within 2 hour" },
    { id: 2, price: 2100, usd: 23.37, questions: 7, delivery: "within 2 day" },
    { id: 3, price: 1100, usd: 12.24, questions: 5, delivery: "within 1 week" },
];

const FuturePredictionSection = ({ isAuthenticated, showErrorPopup, showSuccessPopup, navigate, location }) => {
    // ... (FuturePredictionSection logic is unchanged, assuming its payment call is fine) ...
    // Note: The logic for handleSelectPackage needs the redirection fix too, but we are focusing on PricingPage/displayRazorpay first.

    // ... (rest of the FuturePredictionSection component) ...

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isIndian, setIsIndian] = useState(true);

    useEffect(() => {
        const checkLocation = async () => {
            try {
                const response = await axios.get("https://ipapi.co/json/");
                if (response.data.country_code !== "IN") {
                    setIsIndian(false);
                }
            } catch (error) {
                console.error("Error fetching location:", error);
                // Default to Indian if check fails
            }
        };
        checkLocation();
    }, []);

    const getPriceDetails = (basePriceInr) => {
        if (isIndian) {
            return {
                display: `₹${basePriceInr}`,
                chargeAmount: basePriceInr,
                currency: "INR"
            };
        } else {
            const chargeAmount = basePriceInr * 4;
            // Fixed rate 1 USD = 84 INR for display
            const displayUsd = (chargeAmount / 84).toFixed(2);
            return {
                display: `$${displayUsd}`,
                chargeAmount: chargeAmount,
                currency: "USD"
            };
        }
    };

    const handleSelectPackage = (pkg) => {
        if (!isAuthenticated) {
            // Redirect to login if user is logged out
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        setSelectedPackage(pkg);
        setQuestions(Array(pkg.questions).fill(""));
    };

    const handleQuestionChange = (index, value) => {
        if (value.split(" ").filter(n => n).length <= 15) {
            const updated = [...questions];
            updated[index] = value;
            setQuestions(updated);
        }
    };

    const displayCustomRazorpay = async () => {
        const { chargeAmount } = getPriceDetails(selectedPackage.price);
        const amount = chargeAmount;
        const description = `${selectedPackage.questions} customised questions`;

        try {
            const { data: { id: order_id, currency } } = await api.post('/api/payment/create-order', {
                amount: amount,
                receipt: `receipt_custom_pkg_${selectedPackage.id}`
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency,
                name: "Steer-U App Custom Package",
                description: description,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const data = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        await api.post('/api/payment/verify', data);

                        await api.post('/api/custom-questions/save', {
                            packageDetails: selectedPackage,
                            questionsList: questions,
                            paymentId: response.razorpay_payment_id
                        });

                        showSuccessPopup("Payment successful! Your questions have been submitted.");
                        setSelectedPackage(null);

                    } catch (error) {
                        console.error("Payment verification or saving failed:", error);
                        showErrorPopup("Your payment was successful, but we couldn't save your questions. Please contact support.");
                    }
                },
                prefill: { name: "", email: "" },
                theme: { color: "#f76822" },
            };
            new window.Razorpay(options).open();
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            showErrorPopup(error.response?.data?.message || "Could not initiate payment. Please try again.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (questions.some(q => q.trim() === "")) {
            showErrorPopup("Please fill out all your questions before proceeding.");
            return;
        }
        setIsLoading(true);
        displayCustomRazorpay();
        setIsLoading(false);
    };

    return (
        <div className="bg-gradient from-[#f76826] via-[#f76822] to-[#f76822] py-16 px-4 md:px-12 text-white">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
                Future Prediction Customised Packages
            </h2>
            {!selectedPackage ? (
                <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                    {customPackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            onClick={() => handleSelectPackage(pkg)}
                            className="cursor-pointer bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822] border border-orange-300 rounded-2xl p-6 shadow-lg text-center hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="text-2xl font-bold mb-2">{getPriceDetails(pkg.price).display}</h3>
                            <p className="text-xs text-yellow-200 mb-2">(*tax included)</p>
                            <p className="text-gray-200">{pkg.questions} customised questions with answers delivered {pkg.delivery}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-3xl mx-auto bg-white text-black p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-center text-orange-600 mb-4">{getPriceDetails(selectedPackage.price).display}</h3>
                    <p className="text-center text-gray-700 mb-6">{selectedPackage.questions} customised questions with answers {selectedPackage.delivery}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {questions.map((q, index) => (
                                <div key={index}>
                                    <label className="block text-gray-700 font-semibold mb-1">Question {index + 1} (max 15 words)</label>
                                    <input
                                        type="text"
                                        value={q}
                                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                                        placeholder="Type your question..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                    <p className="text-right text-sm text-gray-500">{q.trim() === '' ? 0 : q.trim().split(/\s+/).length} / 15 words</p>
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-orange-700 transition disabled:opacity-50">
                            {isLoading ? "Processing..." : `Proceed to Pay ${getPriceDetails(selectedPackage.price).display}`}
                        </button>
                    </form>
                    <button onClick={() => setSelectedPackage(null)} className="w-full text-gray-600 font-semibold py-3 mt-3 hover:underline">
                        ← Back to Packages
                    </button>
                </div>
            )}
        </div>
    );
};

//  NAYA MODAL COMPONENT (Unchanged) 
const PackageTherapistModal = ({
    show,
    onClose,
    packageDeal,
    therapists, // Ab yeh 'therapists' array receive karega
    onPaymentStart, // <--- CLEANED
    isIndian
}) => {
    const [selectedTherapistId, setSelectedTherapistId] = useState(null);




    const getPriceDetails = (basePriceInr) => {
        if (isIndian) {
            return {
                display: `₹${basePriceInr}`,
                chargeAmount: basePriceInr,
                currency: "INR"
            };
        } else {
            const chargeAmount = basePriceInr * 4;
            // Fixed rate 1 USD = 84 INR for display
            const displayUsd = (chargeAmount / 84).toFixed(2);
            return {
                display: `$${displayUsd}`,
                chargeAmount: chargeAmount,
                currency: "USD"
            };
        }
    };

    if (!show) return null;

    const selectedTherapist = therapists.find(t => t.id === Number(selectedTherapistId));
    let finalPrice = 0;
    let originalPrice = 0;

    if (selectedTherapist) {
        originalPrice = selectedTherapist.fee * packageDeal.sessions;
        const discountAmount = originalPrice * (packageDeal.discountPercent / 100);
        finalPrice = Math.round(originalPrice - discountAmount);
    }

    // Calculate display values
    const finalPriceDetails = getPriceDetails(finalPrice);
    const originalPriceDetails = getPriceDetails(originalPrice);
    const feeDetails = selectedTherapist ? getPriceDetails(selectedTherapist.fee) : { display: `₹${selectedTherapist?.fee || 0}`, chargeAmount: 0 };

    const handleSubmit = () => {
        if (!selectedTherapist) {
            alert("Please select a therapist."); // Simple alert
            return;
        }

        // Naya dynamic plan object banayein
        const dynamicPlan = {
            price: finalPrice,
            pack: `${packageDeal.pack} (${selectedTherapist.name})`,
            description: `${packageDeal.sessions} sessions for ${selectedTherapist.name}`,
            details: [...packageDeal.details, `Base Price: ₹${selectedTherapist.fee}/session`],
        };

        onPaymentStart(dynamicPlan);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 overflow-auto">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white text-black rounded-2xl p-8 max-w-2xl w-full shadow-2xl overflow-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-orange-600">{packageDeal.pack}</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black"><X size={24} /></button>
                </div>

                <p className="text-lg text-gray-700 mb-4">{packageDeal.description} ({packageDeal.discountPercent}% Discount)</p>

                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">Select Therapist:</h3>
                    {/*  Ab 'therapistsForModal' array par map ho raha hai  */}
                    {therapists.map(therapist => (
                        <label key={therapist.id} className="flex items-center p-4 border rounded-lg cursor-pointer data-[checked=true]:border-orange-500 data-[checked=true]:bg-orange-50" data-checked={selectedTherapistId === therapist.id.toString()}>
                            <input
                                type="radio"
                                name="therapistTier"
                                value={therapist.id}
                                checked={selectedTherapistId === therapist.id.toString()}
                                onChange={(e) => setSelectedTherapistId(e.target.value)}
                                className="accent-orange-600"
                            />
                            <div className="ml-4">
                                <p className="font-semibold">{therapist.name}</p>
                                <p className="text-sm text-gray-600">{getPriceDetails(therapist.fee).display} / session</p>
                                <p className="text-xs text-gray-500">{therapist.description}</p>
                            </div>
                        </label>
                    ))}
                </div>

                {selectedTherapist && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-lg text-gray-600">Original Price: <span className="line-through">{originalPriceDetails.display}</span></p>
                        <p className="text-2xl font-bold text-green-600">Final Price: {finalPriceDetails.display}</p>
                        <p className="text-sm text-gray-500">(*tax included)</p>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedTherapist}
                        className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition disabled:opacity-50"
                    >
                        Proceed to Pay {finalPrice > 0 ? getPriceDetails(finalPrice).display : '...'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- MUKHYA PRICING PAGE COMPONENT ---
const PricingPage = () => {
    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isIndian, setIsIndian] = useState(true);
    const [mapPosition, setMapPosition] = useState([20.5937, 78.9629]); // Default India center

    // Component to handle map clicks
    const LocationSelector = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setMapPosition([lat, lng]);
                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const countryCode = response.data.address?.country_code;
                    if (countryCode) {
                        setIsIndian(countryCode.toLowerCase() === 'in');
                    } else {
                        // If country not found (ocean etc), default to Intl
                        setIsIndian(false);
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed", error);
                    setIsIndian(false); // Default to INTL on error
                }
            }
        });
        return mapPosition ? <Marker position={mapPosition} /> : null;
    };

    useEffect(() => {
        const checkLocation = async () => {
            // Helper to determine country from lat/lng
            const determineCountry = async (lat, lng) => {
                setMapPosition([lat, lng]);
                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const countryCode = response.data.address?.country_code;
                    if (countryCode) {
                        setIsIndian(countryCode.toLowerCase() === 'in');
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed in auto-detect", error);
                }
            };

            // 1. Try Browser Geolocation (GPS) first
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        determineCountry(position.coords.latitude, position.coords.longitude);
                    },
                    async (error) => {
                        console.warn("Geolocation permission denied or failed, falling back to IP.", error);
                        // 2. Fallback to IP-based location
                        try {
                            const response = await axios.get("https://ipapi.co/json/");
                            if (response.data.country_code !== "IN") {
                                setIsIndian(false);
                            }
                            if (response.data.latitude && response.data.longitude) {
                                setMapPosition([response.data.latitude, response.data.longitude]);
                            }
                        } catch (ipError) {
                            console.error("IP Geolocation failed:", ipError);
                        }
                    }
                );
            } else {
                // Fallback if geolocation not supported
                try {
                    const response = await axios.get("https://ipapi.co/json/");
                    if (response.data.country_code !== "IN") {
                        setIsIndian(false);
                    }
                    if (response.data.latitude && response.data.longitude) {
                        setMapPosition([response.data.latitude, response.data.longitude]);
                    }
                } catch (ipError) {
                    console.error("IP Geolocation failed:", ipError);
                }
            }
        };
        checkLocation();
    }, []);

    const getPriceDetails = (basePriceInr) => {
        if (isIndian) {
            return {
                display: `₹${basePriceInr}`,
                chargeAmount: basePriceInr,
                currency: "INR"
            };
        } else {
            const chargeAmount = basePriceInr * 4;
            // Fixed rate 1 USD = 84 INR for display
            const displayUsd = (chargeAmount / 84).toFixed(2);
            return {
                display: `$${displayUsd}`,
                chargeAmount: chargeAmount,
                currency: "USD"
            };
        }
    };

    //  STATE: Custom Action and Modals 
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [selectedPackageDeal, setSelectedPackageDeal] = useState(null);
    const [popupAction, setPopupAction] = useState(null); // New state for redirection action

    const navigate = useNavigate(); // Navigation hook
    const location = useLocation(); // Location hook

    const initialIntakeFormState = {
        name: "", referredBy: "", address: "", phone: "", email: "",
        age: "", sex: "", occupation: "", receivedTherapyBefore: "",
        concernsAddressed: "", difficultIssues: "", concernsPresentSince: "",
        livesWith: "", supportivePersons: "", medicalCare: "",
        conditionsUnderTreatment: "", chronicIllness: "", additionalTherapy: ""
    };
    const [intakeFormData, setIntakeFormData] = useState(initialIntakeFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isAuthenticated } = useContext(AuthContext);

    const showErrorPopup = (message) => {
        setIsErrorPopup(true);
        setPopupMessage(message);
        setPopupAction(null); // Clear custom action for a generic error
    };
    const showSuccessPopup = (message) => {
        setIsErrorPopup(false);
        setPopupMessage(message);
        setPopupAction(null);
    };

    //  NEW FUNCTION: To handle login redirection logic for popups
    const handleLoginRedirect = () => {
        setPopupMessage(null); // Close the popup
        navigate('/login', { state: { from: location.pathname } });
    };

    //  UPDATED: Centralized Authentication Check/Redirection
    const handleAuthCheckAndPayment = (plan) => {
        if (!isAuthenticated) {
            setIsErrorPopup(true);
            setPopupMessage("Please log in to make a payment.");
            setPopupAction(() => handleLoginRedirect); // Set custom action to redirect
            return;
        }
        displayRazorpay(plan);
    };


    const handleIntakeChange = (e) => {
        const { name, value } = e.target;
        setIntakeFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIntakeSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post('/api/intake-form/submit', intakeFormData);
            showSuccessPopup(response.data.message);
            setShowForm(false);
            setIntakeFormData(initialIntakeFormState);
        } catch (error) {
            console.error("Failed to submit intake form:", error);
            showErrorPopup(error.response?.data?.message || "Form submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 'THERAPY PLANS' PAYMENT LOGIC (Ab dynamic plan lega)
    const displayRazorpay = async (plan) => {
        // Auth check already handled by handleAuthCheckAndPayment, but re-confirming for safety
        if (!localStorage.getItem("authToken")) {
            showErrorPopup("Please log in to make a payment.");
            return;
        }

        // If plan has chargeAmount property (from custom dynamic plan), use it.
        // If not, calculate it from plan.price which is base INR.
        let amountInRupees;
        if (plan.price && !plan.pack && !plan.description.includes("sessions")) {
            // Logic for basic plan object like {id, price, oldPrice} passed from therapistTiers
            amountInRupees = getPriceDetails(plan.price).chargeAmount;
        } else {
            // Logic for dynamic plan objects where price is already calculated or passed
            // However, for packageDeals/custom, the 'plan' object structure varies.
            // If plan enters here as a raw object from therapistTiers, plan.price is base.

            // If coming from PackageTherapistModal, 'plan' is 'dynamicPlan' which has 'price' set to 'finalPrice' (which is base INR calculated)
            // We need to re-apply multiplier if necessary?
            // Actually, in PackageTherapistModal, we calculated finalPrice in INR. 
            // We need to apply the multiplier here for the actual charge.

            // Let's assume input 'plan.price' is always the Base INR amount we want to charge based on.
            amountInRupees = getPriceDetails(plan.price).chargeAmount;
        }


        // Description ab dynamic plan se aa rahi hai
        const description = plan.pack || plan.description;

        try {
            const { data: { id: order_id, currency } } = await api.post("/api/payment/create-order", {
                amount: amountInRupees,
                receipt: `receipt_plan_${new Date().getTime()}`,
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amountInRupees,
                currency,
                name: "Steer-U App Plan",
                description,
                order_id,
                handler: async function (response) {
                    try {
                        const data = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        await api.post("/api/payment/verify", data);

                        const bookingData = {
                            doctor: plan.description,
                            date: new Date().toDateString(),
                            slot: "N/A",
                            paymentId: response.razorpay_payment_id,
                            planDetails: plan,
                        };
                        await api.post("/api/bookings/create", {
                            bookingDetails: bookingData,
                        });

                        showSuccessPopup("Your plan has been purchased successfully!");
                        setTimeout(() => {
                            setPopupMessage(null);
                            setShowForm(true);
                        }, 2000);
                    } catch (error) {
                        console.error(error);
                        showErrorPopup("Payment was successful, but we couldn’t save your booking. Please contact support.");
                    }
                },
                prefill: { name: "", email: "" },
                theme: { color: "#f76822" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            showErrorPopup(error.response?.data?.message || "Could not initiate payment. Please try again.");
        }
    };

    const handleSelectPackageDeal = (packageDeal) => {
        if (!isAuthenticated) {
            handleAuthCheckAndPayment(packageDeal);
            return;
        }
        setSelectedPackageDeal(packageDeal);
        setShowPackageModal(true);
    };

    const handlePackagePaymentStart = (dynamicPlan) => {
        setShowPackageModal(false);
        handleAuthCheckAndPayment(dynamicPlan);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6b2400] via-[#f76822] to-[#f76822] text-white">
            <Navbar />
            <PopupModal
                message={popupMessage}
                onClose={() => { setPopupMessage(null); setPopupAction(null); }}
                isError={isErrorPopup}
                onConfirmAction={popupAction}
            />
            <AnimatePresence>
                {showPackageModal && (
                    <PackageTherapistModal
                        show={showPackageModal}
                        onClose={() => setShowPackageModal(false)}
                        packageDeal={selectedPackageDeal}
                        therapists={therapistsForModal}
                        onPaymentStart={handlePackagePaymentStart}
                        isIndian={isIndian} // Pass the state
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 overflow-auto">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white text-black rounded-2xl p-8 max-w-3xl w-full shadow-2xl overflow-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-[#6b2400]">Counselling Intake Form</h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-black"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleIntakeSubmit} className="space-y-5 text-sm">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="name" value={intakeFormData.name} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Name *" required />
                                    <input name="referredBy" value={intakeFormData.referredBy} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Referred by" />
                                </div>
                                <textarea name="address" value={intakeFormData.address} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Address" rows={2}></textarea>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="phone" value={intakeFormData.phone} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Phone *" required />
                                    <input name="email" value={intakeFormData.email} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Email" />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <input name="age" value={intakeFormData.age} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Age" />
                                    <input name="sex" value={intakeFormData.sex} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Sex" />
                                    <input name="occupation" value={intakeFormData.occupation} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Occupation" />
                                </div>
                                <textarea name="receivedTherapyBefore" value={intakeFormData.receivedTherapyBefore} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Have you received counselling / therapy before?"></textarea>
                                <textarea name="concernsAddressed" value={intakeFormData.concernsAddressed} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="If yes, what were some of the concerns addressed?"></textarea>
                                <textarea name="difficultIssues" value={intakeFormData.difficultIssues} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Describe the most difficult issue(s) currently for you."></textarea>
                                <textarea name="concernsPresentSince" value={intakeFormData.concernsPresentSince} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="How long have these concerns been present?"></textarea>
                                <textarea name="livesWith" value={intakeFormData.livesWith} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Who lives with you at home now?"></textarea>
                                <textarea name="supportivePersons" value={intakeFormData.supportivePersons} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Are there emotionally supportive persons available to you? List names and relationships."></textarea>
                                <textarea name="medicalCare" value={intakeFormData.medicalCare} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Are you currently receiving medical care? If yes, by whom?"></textarea>
                                <textarea name="conditionsUnderTreatment" value={intakeFormData.conditionsUnderTreatment} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Condition(s) under treatment / Medicines taken"></textarea>
                                <textarea name="chronicIllness" value={intakeFormData.chronicIllness} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Any chronic illness? (Example: diabetes, kidney problem, etc.)"></textarea>
                                <textarea name="additionalTherapy" value={intakeFormData.additionalTherapy} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Are you receiving any additional therapy / counselling / psychiatric care?"></textarea>
                                <textarea
                                    name="confirmationRemarks"
                                    value={intakeFormData.confirmationRemarks}
                                    onChange={handleIntakeChange}
                                    className="border p-2 rounded w-full mt-4"
                                    placeholder="Please confirm that all the information provided above is correct and complete."
                                ></textarea>
                                <div className="text-right">
                                    <button type="submit" disabled={isSubmitting} className="bg-[#f76822] text-white px-6 py-2 rounded-full hover:bg-[#d95d1e] transition disabled:opacity-50">
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="pt-24">
                <FuturePredictionSection
                    isAuthenticated={isAuthenticated}
                    showErrorPopup={showErrorPopup}
                    showSuccessPopup={showSuccessPopup}
                    navigate={navigate}
                    location={location}
                />
            </div>
            <div className="flex-1 py-16 px-4 md:px-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow">Psychological Counseling Session Plans</h1>
                    <p className="text-gray-200 mt-4 text-lg max-w-2xl mx-auto">Choose a session or package that best fits your needs. Flexible, affordable, and professional support at your fingertips.</p>

                    {/* Interactive Map Selector */}
                    <div className="mt-8 max-w-4xl mx-auto">
                        <p className="text-lg font-semibold text-white mb-2">Select your location on the map:</p>
                        <div className="h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-400/50">
                            <MapContainer
                                center={[20.5937, 78.9629]}
                                zoom={3}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationSelector />
                            </MapContainer>
                        </div>
                        <div className="mt-2 text-center">
                            <span className="text-white font-medium bg-black/30 px-4 py-1 rounded-full">
                                Current Pricing: <span className={isIndian ? "text-orange-300 font-bold" : "text-green-300 font-bold"}>
                                    {isIndian ? "🇮🇳 India (INR)" : "🌍 International (USD)"}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {therapistTiers.map((plan, index) => (
                        <motion.div key={plan.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822] text-white border border-orange-400/30 rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col">
                            <div className="flex-grow">
                                <div className="mb-4 text-center">
                                    <h2 className="text-4xl font-bold text-white">{getPriceDetails(plan.price).display} <span className="text-gray-400 line-through ml-2 text-lg">{getPriceDetails(plan.oldPrice).display}</span></h2>
                                    <p className="text-orange-300 text-sm">{plan.title}</p>
                                    <p className="text-xs text-green-200 mt-1">(*tax included)</p>
                                </div>
                                <p className="text-center text-orange-200 text-sm mb-4">{plan.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {plan.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-200">
                                            <CheckCircle className="text-[#FFD700] w-5 h-5 flex-shrink-0 mt-1" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => handleAuthCheckAndPayment(plan)} className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-[#FFD700] transition mt-4">
                                Buy Plan
                            </button>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-16 mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow">Session Packages</h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
                    {packageDeals.map((plan, index) => (
                        <motion.div key={plan.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822] text-white border border-orange-400/30 rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col">
                            <div className="flex-grow">
                                <div className="mb-4 text-center">
                                    <h2 className="text-2xl font-bold text-white">{plan.pack}</h2>
                                    <p className="text-yellow-300 font-semibold">{plan.discountPercent}% Discount</p>

                                </div>
                                <p className="text-center text-orange-200 text-sm mb-4">{plan.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {plan.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-200">
                                            <CheckCircle className="text-[#FFD700] w-5 h-5 flex-shrink-0 mt-1" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => handleSelectPackageDeal(plan)} className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-[#FFD700] transition mt-4">
                                Select Package
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PricingPage;