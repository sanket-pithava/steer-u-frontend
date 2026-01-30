import React, { useState, useEffect, useMemo, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Lock, ChevronDown, ChevronUp } from "lucide-react";
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationDropdown from "../components/common/LocationDropdown";


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
                    <p className="text-gray-700 text-base">{message}</p>
                    <button onClick={onClose} className="bg-orange-600 text-white px-6 py-2 rounded-full w-full mt-6 hover:bg-orange-700 transition text-base font-semibold">OK</button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
const loadingMessages = [
    "You can write the next episode of your life.",
    "Your efforts create your destiny.",
    "Steer-U promotes karma over destiny philosophy.",
    "Do not believe in superstitions.",
    "Do not fear.",
    "Believe in yourself.",
    "Your thoughts & efforts play vital role.",
    "Planets & sounds impact everyone.",
    "Helping others is the ultimate remedy.",
    "Blessings shape up your destiny.",
    "Good karma should be your focus.",
    "You can steer your happiness.",
];
const QuestionsModal = ({ show, onClose, selfData, otherData, questions }) => {
    const [unlockedQuestions, setUnlockedQuestions] = useState([]);
    const [openQuestions, setOpenQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [elapsedTime, setElapsedTime] = useState(0);

    const showErrorPopup = (message) => { setIsErrorPopup(true); setPopupMessage(message); };
    const showSuccessPopup = (message) => { setIsErrorPopup(false); setPopupMessage(message); };

    useEffect(() => {
        let messageInterval, timerInterval, progressBarInterval;
        if (isLoadingAnswer) {
            setElapsedTime(0);
            timerInterval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
            let msgIndex = 0;
            setLoadingMessage(loadingMessages[0]);
            messageInterval = setInterval(() => {
                msgIndex = (msgIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[msgIndex]);
            }, 4000);
            setProgress(0);
            progressBarInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressBarInterval);
                        return 95;
                    }
                    return prev + 1;
                });
            }, 1800);
        }
        return () => {
            clearInterval(messageInterval);
            clearInterval(timerInterval);
            clearInterval(progressBarInterval);
        };
    }, [isLoadingAnswer]);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [show]);

    const toggleQuestion = (index) => {
        if (openQuestions.includes(index)) {
            setOpenQuestions(openQuestions.filter((i) => i !== index));
        } else {
            setOpenQuestions([...openQuestions, index]);
        }
    };

    const displayRazorpay = async (question, index) => {
        if (!localStorage.getItem('authToken')) { showErrorPopup("Please log in to make a payment."); return; }
        const amount = 249;
        try {
            const { data: { id: order_id, currency } } = await api.post('/api/payment/create-order', { amount: amount, receipt: `receipt_comp_${index}` });
            const options = {
                key: "rzp_test_RPNPg6A7yl1KPA",
                amount: amount,
                currency, name: "Steer-U Relationship Compatibility", description: question.text, order_id,
                handler: async function (response) {
                    try {
                        await api.post('/api/payment/verify', { ...response });
                        await api.post('/api/bookings/create', {
                            bookingDetails: {
                                plan: "Compatibility Question",
                                price: amount,
                                date: new Date().toDateString(),
                                slot: "N/A",
                                paymentId: response.razorpay_payment_id,
                                selfData, otherData, question: question.text
                            }
                        });
                        showSuccessPopup("Payment successful! You can now get your answer.");
                        setUnlockedQuestions(prev => [...prev, index]);
                    } catch (error) {
                        console.error("Payment verification or booking failed:", error);
                        showErrorPopup("Your payment was successful, but we couldn't save your booking.");
                    }
                },
                prefill: { name: "", email: "" },
                theme: { color: "#f76822" },
            };
            new window.Razorpay(options).open();
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            showErrorPopup("Could not initiate payment. Please try again.");
        }
    };

    const fetchPrediction = async (index, questionText) => {
        const questionId = `comp-${index}`;
        setIsLoadingAnswer(questionId);
        try {
            const { data } = await api.post('/api/compatibility/get-single-answer', {
                questionText: questionText,
                selfData: selfData,
                otherData: otherData
            });
            setProgress(100);
            await new Promise(r => setTimeout(r, 500));
            if (data.success) {
                let jsonString = JSON.stringify(data.answer, null, 2);
                jsonString = jsonString.replace(/\\n/g, '\n');
                setAnswers(prev => ({ ...prev, [questionId]: jsonString }));
                try {
                    await api.post('/api/predictions/save', {
                        question: questionText,
                        answer: data.answer,
                        details: { selfData, otherData }
                    });
                    console.log("Prediction successfully saved to Firebase.");
                } catch (saveError) {
                    console.error("Failed to save the prediction to Firebase:", saveError);
                }
            } else {
                throw new Error(data.answer || "Prediction was not successful.");
            }
        } catch (error) {
            console.error("Error fetching prediction:", error);
            const errorMessage = error.response?.data?.message || "Could not fetch the answer.";
            setAnswers(prev => ({ ...prev, [questionId]: `Sorry, something went wrong: ${errorMessage}` }));
        } finally {
            setIsLoadingAnswer(null);
        }
    };

    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <PopupModal message={popupMessage} onClose={() => setPopupMessage(null)} isError={isErrorPopup} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-600 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]"
            >
                <div className="flex-shrink-0 p-6 md:p-8 border-b border-orange-500">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Compatibility Questions (₹249 Each)</h2>
                        <button onClick={onClose} className="text-white hover:text-yellow-300"><X size={28} /></button>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                        {questions.map((q, idx) => {
                            const isUnlocked = unlockedQuestions.includes(idx);
                            const questionId = `comp-${idx}`;
                            return (
                                <div key={idx} className="bg-orange-500/80 rounded-xl shadow-lg overflow-hidden">
                                    <button onClick={() => isUnlocked ? toggleQuestion(idx) : displayRazorpay(q, idx)} className="w-full flex items-center justify-between p-4 md:p-5 text-left">
                                        <span className="text-base md:text-lg text-white">{q.text}</span>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                            <span className="text-sm font-bold text-yellow-300">₹249</span>
                                            {isUnlocked ? (openQuestions.includes(idx) ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />) : <Lock className="text-white" />}
                                        </div>
                                    </button>
                                    {openQuestions.includes(idx) && isUnlocked && (
                                        <div className="bg-orange-700 p-4 md:p-5 text-md">
                                            {answers[questionId] ? (
                                                <>
                                                    <div className="mb-3 p-3 bg-orange-800/50 rounded-lg text-sm text-white/80 border border-white/20">
                                                        <p className="font-semibold">Details Used for this Prediction:</p>
                                                        <p>Self: {selfData.dateOfBirth} | {selfData.timeOfBirth}</p>
                                                        <p>Other: {otherData.dateOfBirth} | {otherData.timeOfBirth}</p>
                                                    </div>
                                                    <p className="text-base text-white/90 whitespace-pre-wrap">{answers[questionId]}</p>
                                                </>
                                            ) : isLoadingAnswer === questionId ? (
                                                <div className="text-center text-white py-2">
                                                    {/* Warning Message Added */}
                                                    <p className="text-yellow-300 font-bold mb-3">
                                                        **Plz do not close the screen for 2 min until you get the answer** ⏳
                                                    </p>
                                                    <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
                                                        <motion.div
                                                            className="bg-green-400 h-2.5 rounded-full"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: `${progress}%` }}
                                                            transition={{ ease: "linear", duration: 1.5 }}
                                                        />
                                                    </div>
                                                    <p className="font-semibold mt-3 text-base md:text-lg">{loadingMessage} ({progress}%)</p>
                                                    <p className="text-base text-white/80">Please wait... (Time: {elapsedTime}s)</p>
                                                </div>
                                            ) : (
                                                <button onClick={() => fetchPrediction(idx, q.text)} disabled={isLoadingAnswer} className="bg-white text-orange-600 px-5 py-2 rounded-full font-bold hover:scale-105 transition disabled:opacity-50 text-base">
                                                    Click to Get Answer
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Relationship = () => {
    const defaultDate = '2000-01-01';
    const [selfData, setSelfData] = useState({ timeOfBirth: "", placeOfBirth: "", dateOfBirth: defaultDate, gender: "" });
    const [otherData, setOtherData] = useState({ timeOfBirth: "", placeOfBirth: "", dateOfBirth: defaultDate, gender: "" });

    const [showQuestionsModal, setShowQuestionsModal] = useState(false);
    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const { profile, isLoading, isAuthenticated, updateProfileData } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const showErrorPopup = (message) => { setIsErrorPopup(true); setPopupMessage(message); };
    const handleChange = (e, person) => {
        const { name, value } = e.target;
        if (person === "self") {
            setSelfData({ ...selfData, [name]: value });
        } else {
            setOtherData({ ...otherData, [name]: value });
        }
    };
    const handleAutofillSelf = () => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: location.pathname,
                    message: "Please log in to use the Autofill feature."
                }
            });
            return;
        }

        if (isLoading) {
            setIsErrorPopup(false);
            setPopupMessage("Loading profile... please wait.");
            return;
        }

        if (profile && profile.dob && profile.timeOfBirth && profile.placeOfBirth && profile.gender) {
            setSelfData({
                dateOfBirth: profile.dob,
                timeOfBirth: profile.timeOfBirth,
                placeOfBirth: profile.placeOfBirth,
                gender: profile.gender
            });
            setIsErrorPopup(false);

        } else {
            navigate('/profile', {
                state: {
                    from: location.pathname,
                    message: "Please complete your profile (DOB, TOB, POB, Gender) to use autofill."
                }
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        if (!selfData.dateOfBirth || !selfData.timeOfBirth || !selfData.placeOfBirth || !selfData.gender ||
            !otherData.dateOfBirth || !otherData.timeOfBirth || !otherData.placeOfBirth || !otherData.gender) {
            showErrorPopup("Please fill in all details (including Gender) for Self and Other.");
            return;
        }
        try {
            const profileIsIncomplete = profile && (!profile.dob || !profile.gender);

            if (profileIsIncomplete) {
                const newProfileData = {
                    dob: selfData.dateOfBirth,
                    timeOfBirth: selfData.timeOfBirth,
                    placeOfBirth: selfData.placeOfBirth,
                    gender: selfData.gender,
                    phone: profile.phone,
                };
                await api.put("/api/profile/update", newProfileData);
                updateProfileData(newProfileData);
                console.log("Profile auto-updated from Relationship form.");
            }
        } catch (error) {
            console.error("Failed to auto-update profile:", error);
        }

        setShowQuestionsModal(true);
    };
    const cardStyle =
        "bg-gradient-to-br from-brand-orange via-orange-600/100 to-orange-500/70 " +
        "backdrop-blur-md border border-orange-400/20 text-white shadow-lg " +
        "rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-orange-500/40 " +
        "transition-shadow duration-300 ease-in-out";
    const buttonStyle =
        "bg-black text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition duration-300 text-base disabled:bg-gray-500";
    const compatibilityQuestions = [
        { text: "When will our relationship become stronger?" },
        { text: "Will there be any relationship issues between us in future ?" },
        { text: "Advise if this spouse is compatible with me?" },
        { text: "Describe our strengths and weaknesses?" },
        { text: "How well will this business partnership work for us?" },
        { text: "When shall we be blessed with children?" }
    ];
    const randomQuestions = useMemo(() => {
        const shuffled = [...compatibilityQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }, []);

    return (
        <motion.div
            className="py-20 px-4 md:px-16 mt-[-3vh]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
        >
            <PopupModal message={popupMessage} onClose={() => setPopupMessage(null)} isError={isErrorPopup} />

            <QuestionsModal
                show={showQuestionsModal}
                onClose={() => setShowQuestionsModal(false)}
                selfData={selfData}
                otherData={otherData}
                questions={compatibilityQuestions}
            />

            <div className={cardStyle}>
                <h2 className="text-3xl md:text-4xl font-fancy font-bold mb-4 text-orange-300 drop-shadow-md">
                    Check Relationship Compatibility
                </h2>
                <p className="text-base md:text-lg text-gray-200 mb-6">
                    Discover your relationship harmony based on birth details. Enter both self and other information to calculate your compatibility using ancient Vedic Astrology principles.
                </p>
                <div className="mb-6 p-4 bg-black/20 rounded-lg border border-orange-400/30">
                    <p className="text-base text-yellow-300 font-semibold mb-2">You can ask questions like:</p>
                    <ul className="list-disc list-inside text-gray-200 space-y-1 text-sm md:text-base">
                        <li>"{randomQuestions[0].text}"</li>
                        <li>"{randomQuestions[1].text}"</li>
                    </ul>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-10 text-gray-800"
                >
                    <div className="bg-white/10 rounded-xl p-6 border border-orange-400/30 shadow-lg">

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg md:text-xl font-semibold text-white">
                                Person 1 (Self)
                            </h3>
                            <button
                                type="button"
                                onClick={handleAutofillSelf}
                                className="bg-yellow-300 text-black text-xs font-bold px-3 py-1 rounded-full hover:bg-yellow-400 transition"
                            >
                                Fetch From Profile
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-200 mb-1">Gender *</p>
                            <select
                                name="gender"
                                value={selfData.gender}
                                onChange={(e) => handleChange(e, "self")}
                                className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base"
                                required
                            >
                                <option value="" disabled className="bg-orange-700 text-white">Select Gender *</option>
                                <option value="Male" className="bg-orange-700 text-white">Male</option>
                                <option value="Female" className="bg-orange-700 text-white">Female</option>
                            </select>

                            <p className="text-sm text-gray-200 mb-1">Date of Birth (DD-MMM-YYYY)</p>
                            <input
                                type={selfData.dateOfBirth ? "date" : "text"}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                name="dateOfBirth"
                                value={selfData.dateOfBirth}
                                onChange={(e) => handleChange(e, "self")}
                                className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base placeholder-white/70"
                                required
                                placeholder="Date Of Birth *"
                            />
                            <p className="text-sm text-gray-200 mb-1">Time of Birth (HH:MM)</p>
                            <input
                                type={selfData.timeOfBirth ? "time" : "text"}
                                onFocus={(e) => (e.target.type = "time")}
                                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                name="timeOfBirth"
                                value={selfData.timeOfBirth}
                                onChange={(e) => handleChange(e, "self")}
                                placeholder="Time Of Birth *"
                                className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base placeholder-white/70"
                                required
                            />
                            <p className="text-sm text-gray-200 mb-1">Place of Birth (City/Town, State, Country)</p>
                            {/* <input
                                type="text"
                                name="placeOfBirth"
                                value={selfData.placeOfBirth}
                                onChange={(e) => handleChange(e, "self")}
                                placeholder="Place Of Birth *"
                                className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base"
                                required
                            /> */}

                            <LocationDropdown
                                value={selfData.placeOfBirth}
                                onChange={(val) =>
                                    setSelfData(prev => ({ ...prev, placeOfBirth: val }))
                                }
                            />
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 border border-orange-400/30 shadow-lg">
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                            Person 2 (Other)
                        </h3>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-200 mb-1">Gender *</p>
                            <select
                                name="gender"
                                value={otherData.gender}
                                onChange={(e) => handleChange(e, "other")}
                                className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base"
                                required
                            >
                                <option value="" disabled className="bg-orange-700 text-white">Select Gender *</option>
                                <option value="Male" className="bg-orange-700 text-white">Male</option>
                                <option value="Female" className="bg-orange-700 text-white">Female</option>
                            </select>

                            <p className="text-sm text-gray-200 mb-1">Date of Birth (DD-MMM-YYYY)</p>
                            <input
                                type={otherData.dateOfBirth ? "date" : "text"}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                name="dateOfBirth"
                                value={otherData.dateOfBirth}
                                onChange={(e) => handleChange(e, "other")}
                                className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base placeholder-white/70"
                                required
                                placeholder="Date Of Birth *"
                            />
                            <p className="text-sm text-gray-200 mb-1">Time of Birth (HH:MM)</p>
                            <input
                                type={otherData.timeOfBirth ? "time" : "text"}
                                onFocus={(e) => (e.target.type = "time")}
                                onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                name="timeOfBirth"
                                value={otherData.timeOfBirth}
                                onChange={(e) => handleChange(e, "other")}
                                placeholder="Time Of Birth *"
                                className="w-full p-3 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base placeholder-white/70"
                                required
                            />
                            <p className="text-sm text-gray-200 mb-1">Place of Birth (City/Town, State, Country)</p>
                            {/* <input
                                type="text"
                                name="placeOfBirth"
                                value={otherData.placeOfBirth}
                                onChange={(e) => handleChange(e, "other")}
                                placeholder="Place Of Birth*"
                                className="w-full p-3 rounded-lg bg-white/20 placeholder-white/70 text-white focus:ring-2 focus:ring-orange-300 outline-none text-base"
                                required
                            /> */}
                            <LocationDropdown
                                value={otherData.placeOfBirth}
                                onChange={(val) =>
                                    setOtherData(prev => ({ ...prev, placeOfBirth: val }))
                                }
                            />
                        </div>
                    </div>
                    <p className="text-md text-yellow-100 italic md:col-span-2 text-center mt-2">
                        Plz re-check your inputs for getting valid answers
                    </p>
                    <div className="flex justify-center mt-6 md:col-span-2">
                        <button
                            type="submit"
                            className={`${buttonStyle} inline-block`}
                        >
                            Check Compatibility →
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default Relationship;