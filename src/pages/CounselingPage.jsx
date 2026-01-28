import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import api from "../services/api";
const PopupModal = ({ message, onClose, isError = false }) => (
    <AnimatePresence>
        {message && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
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
                        {isError ? (
                            <X size={48} className="text-red-500" />
                        ) : (
                            <CheckCircle size={48} className="text-green-500" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                        {isError ? "Error" : "Success"}
                    </h2>
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

const CounselingPage = () => {
    const [selectedStars, setSelectedStars] = useState(0);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const navigate = useNavigate();

    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const showErrorPopup = (message) => {
        setIsErrorPopup(true);
        setPopupMessage(message);
    };
    const showSuccessPopup = (message) => {
        setIsErrorPopup(false);
        setPopupMessage(message);
    };

    const symptoms = [
        "Excessive sleeping or lack of sleep",
        "Disturbed eating pattern (less / excessive)",
        "Social isolation",
        "Difficulty communicating with others / persistent difficulty",
        "Difficulty in everyday activities (eating, drawing, bathing, etc.)",
        "Reading/writing/Speech issues",
        "Short-tempered or too aggressive",
        "Rigid behaviour patterns",
        "Repetitive & restricted behaviour",
        "Learning difficulty",
        "Delay in developmental milestones",
        "Hopelessness/helplessness",
        "Hearing or sensory impairment",
        "Seeks attention",
        "Seizures/fits",
        "Excessive mood variations",
        "Hypo Sensitive / Hyper Sensitivity",
        "Suicidal thoughts or behaviour",
        "Hallucinations / Delusions (able to see faces or hear voices)",
        "Self-harm",
        "Sensitivity to light or noise",
        "Disorganised thinking",
        "Obsession (recurring unwanted thoughts/images/urges)",
        "Addiction (persistent & intense use of substances/things)",
        "Disrespects or disobeys parents",
        "Parenting Challenges",
        "Disagreement with partner or parents",
        "Any fears",
        "Loneliness",
        "Self doubt / focus more on self image",
        "Fight / arguments between parents or couples",
    ];

    const handleSymptomChange = (symptom) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleSaveData = async () => {
        if (!localStorage.getItem("authToken")) {
            showErrorPopup("Please log in to save your symptoms.");
            return;
        }
        if (selectedStars === 0 || selectedSymptoms.length < 8) {
            showErrorPopup(
                "Please rate your feeling and select at least 8-10 symptoms before saving."
            );
            return;
        }

        setIsSaving(true);
        try {
            const response = await api.post("/api/counseling/save", {
                rating: selectedStars,
                symptoms: selectedSymptoms,
            });
            showSuccessPopup(response.data.message);
        } catch (error) {
            console.error("Failed to save symptoms:", error);
            showErrorPopup(
                error.response?.data?.message ||
                "Could not save your data. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-dark via-brand-orange to-brand-orange text-white">
            <Navbar />
            <PopupModal
                message={popupMessage}
                onClose={() => setPopupMessage(null)}
                isError={isErrorPopup}
            />

            <section className="flex flex-col items-center justify-center text-center py-[12vh] px-4">
                <h1 className="text-4xl md:text-5xl mt-[12vh] font-bold text-white drop-shadow-lg mb-4">
                    Counselling & Therapy Support
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                    Share your feelings and symptoms with us. Our goal is to guide your
                    mental wellbeing.
                </p>
            </section>

            <main className="flex justify-center flex-grow py-10 px-4 bg-gradient-to-b from-[#f76822] via-[#f76822] to-[#f76822]">
                <div className="bg-white/95 text-black rounded-2xl p-6 w-full max-w-6xl shadow-lg flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 overflow-y-auto max-h-[70vh]">
                        <h3 className="text-2xl font-semibold text-orange-600 mb-2">
                            Tick 8–10 symptoms
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            (This info will be saved in your profile)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {symptoms.map((item, index) => (
                                <label
                                    key={index}
                                    className="flex items-center border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSymptoms.includes(item)}
                                        onChange={() => handleSymptomChange(item)}
                                        className="mr-2 accent-orange-500"
                                    />
                                    <span className="text-sm">{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full lg:w-1/3 gap-4">
                        <h4 className="font-medium text-gray-800 text-center">
                            How are you feeling right now?
                        </h4>

                        <div className="flex justify-center mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setSelectedStars(star)}
                                    className={`text-3xl cursor-pointer mx-1 transition-all duration-200 rounded-full border-2 
                    ${star <= selectedStars
                                            ? "bg-orange-600 border-orange-700 text-white scale-110 shadow-md"
                                            : "border-yellow-400 text-yellow-400 bg-white hover:bg-yellow-50"
                                        }`}
                                >
                                    ⭐
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={handleSaveData}
                            disabled={isSaving}
                            className="w-full bg-black text-white py-3 rounded-full text-lg hover:bg-white/80 hover:text-black transition disabled:bg-gray-800"
                        >
                            {isSaving ? "Saving..." : "Submit"}
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
                            <button
                                onClick={() => {
                                    navigate("/paid");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="bg-black text-white py-3 rounded-full text-lg hover:bg-gray-800 transition"
                            >
                                Paid Therapy
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/assignment");
                                    window.scrollTo(0, 0);
                                }}
                                className="bg-black text-white py-3 rounded-full text-lg hover:bg-gray-700 transition"
                            >
                                Assessment
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/free-therapy");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="bg-black text-white py-3 rounded-full text-lg hover:bg-gray-700 transition"
                            >
                                Free Therapy Tips
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/hypnotherapy");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="bg-black text-white py-3 rounded-full text-lg hover:bg-gray-700 transition"
                            >
                                Hypnotherapy
                            </button>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CounselingPage;
