import { ChevronDown, ChevronUp, Lock, X, Copy, Facebook, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../services/api';
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import ReferralButton from "../components/features/referral/ReferralButton";
import "../index.css";
import { AuthContext } from '../context/AuthContext';
import { CurrencyContext } from '../context/CurrencyContext';
import { formatPrice } from '../utils/priceUtils';
import { useNavigate, useLocation } from 'react-router-dom';





const generateUniqueCode = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};
const ReferralModal = ({ show, onClose, onShare, referralCode, referralLink }) => {
    if (!show) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralCode);
        alert("Code Copied!");
    };

    const handleSocialClick = (platform) => {
        let url = '';
        const message = `Use my referral code ${referralCode} to unlock free predictions on Steer-U! Link: ${referralLink}`;
        const encodedMsg = encodeURIComponent(message);
        const encodedUrl = encodeURIComponent(referralLink);

        switch (platform) {
            case 'whatsapp': url = `https://wa.me/?text=${encodedMsg}`; break;
            case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; break;
            case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodedMsg}`; break;
            case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`; break;
            default: return;
        }
        window.open(url, '_blank');
        onShare();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-black rounded-3xl p-8 w-full max-w-md text-center shadow-2xl relative">
                <h2 className="text-2xl font-bold text-orange-600 mb-6">Give Referral & Earn Free Questions!</h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="bg-orange-100 border-2 border-orange-200 border-dashed text-orange-800 font-bold text-xl py-3 px-6 rounded-lg tracking-widest">{referralCode}</div>
                    <button onClick={copyToClipboard} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center gap-2 transition"><Copy size={18} /> Copy Code</button>
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    <button onClick={() => handleSocialClick('facebook')} className="bg-blue-600 text-white p-3 rounded-full hover:scale-110 transition shadow-lg"><Facebook size={24} fill="white" /></button>
                    <button onClick={() => handleSocialClick('twitter')} className="bg-sky-400 text-white p-3 rounded-full hover:scale-110 transition shadow-lg"><Twitter size={24} fill="white" /></button>
                    <button onClick={() => handleSocialClick('whatsapp')} className="bg-green-500 text-white p-3 rounded-full hover:scale-110 transition shadow-lg"><MessageCircle size={24} fill="white" /></button>
                    <button onClick={() => handleSocialClick('linkedin')} className="bg-blue-700 text-white p-3 rounded-full hover:scale-110 transition shadow-lg"><Linkedin size={24} fill="white" /></button>
                </div>
                <button onClick={onClose} className="bg-orange-500 text-white w-full py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-md">Cancel</button>
            </motion.div>
        </div>
    );
};
const PopupModal = ({ message, onClose, isError = false }) => (
    <AnimatePresence>
        {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white text-black p-6 rounded-2xl w-full max-w-sm text-center shadow-xl relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={24} /></button>
                    <p className="text-gray-700 text-base">{message}</p>
                    <button onClick={onClose} className="bg-orange-600 text-white px-6 py-2 rounded-full w-full mt-6 hover:bg-orange-700 transition text-base font-semibold">OK</button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
const loadingMessages = [
    "You can write the next episode of your life.", "Your efforts create your destiny.", "Steer-U promotes karma over destiny philosophy.", "Do not believe in superstitions.", "Do not fear.", "Believe in yourself.", "Your thoughts & efforts play vital role.", "Planets & sounds impact everyone.", "Helping others is the ultimate remedy.", "Blessings shape up your destiny.", "Good karma should be your focus.", "You can steer your happiness.",
];
const DetailsModal = ({ show, onClose, onSubmit, details, setDetails, price, profile, isLoading, navigate, location, showSuccessPopup, showErrorPopup }) => {
    if (!show) return null;
    const today = new Date().toISOString().split('T')[0];

    const checkAndAutofillSelf = () => {
        if (isLoading) { showErrorPopup("Loading profile... please wait."); return; }
        if (profile && profile.dob && profile.timeOfBirth && profile.placeOfBirth) {
            setDetails(prev => ({ ...prev, dob: profile.dob, timeOfBirth: profile.timeOfBirth, placeOfBirth: profile.placeOfBirth, gender: profile.gender || 'male' }));
        } else {
            navigate('/profile', { state: { from: location.pathname, message: "Please complete your profile (DOB, TOB, POB) to use autofill." } });
        }
    };

    useEffect(() => { if (show && details?.questionFor === 'self' && !isLoading) { checkAndAutofillSelf(); } }, [show, isLoading, details?.questionFor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
        if (name === 'questionFor' && value === 'self') { checkAndAutofillSelf(); }
        else if (name === 'questionFor' && value !== 'self') {
            setDetails(prev => ({ ...prev, dob: '', timeOfBirth: '', placeOfBirth: '', gender: 'male', questionFor: 'other' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[90] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-orange-600 text-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-white">Enter Birth Details</h2>
                    <select name="questionFor" className="p-3 rounded text-black text-base" value={details?.questionFor || "self"} onChange={handleChange}>
                        <option value="self">For Self</option><option value="other">For Other</option>
                    </select>
                </div>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p className="text-sm text-gray-200 mb-1">Date of Birth (DD-MMM-YYYY)</p>
                    <input type={details.dob ? "date" : "text"} onFocus={(e) => (e.target.type = "date")} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} name="dob" placeholder="Date of Birth *" value={details.dob} onChange={handleChange} required max={today} className="p-3 rounded text-black text-base disabled:bg-gray-200 disabled:text-gray-500" disabled={details?.questionFor === 'self'} />
                    <p className="text-sm text-gray-200 mb-1">Time of Birth (HH:MM)</p>
                    <input type={details.timeOfBirth ? "time" : "text"} onFocus={(e) => (e.target.type = "time")} onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }} name="timeOfBirth" placeholder="Time of Birth *" value={details.timeOfBirth} onChange={handleChange} required className="p-3 rounded text-black text-base disabled:bg-gray-200 disabled:text-gray-500" disabled={details?.questionFor === 'self'} />
                    <p className="text-sm text-gray-200 mb-1">Select your gender</p>
                    <select name="gender" className="p-3 rounded text-black text-base md:col-span-2 disabled:bg-gray-200 disabled:text-gray-500" value={details.gender} onChange={handleChange} disabled={details?.questionFor === 'self'}>
                        <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                    </select>
                    <p className="text-sm text-gray-200 mb-1">Place of Birth (City/Town, State, Country)</p>
                    <input type="text" name="placeOfBirth" placeholder="Place Of Birth *" value={details.placeOfBirth} onChange={handleChange} required className="p-3 rounded text-black text-base md:col-span-2 disabled:bg-gray-200 disabled:text-gray-500" disabled={details?.questionFor === 'self'} />
                     {/* <LocationDropdown
                                            value={placeOfBirth}
                                            onChange={setPlaceOfBirth}
                                        /> */}
                    <p className="text-sm text-yellow-100 italic md:col-span-2 text-center mt-2">Plz re-check your inputs for getting valid answers</p>
                    <div className="flex flex-col sm:flex-row justify-between items-center md:col-span-2 mt-4 gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-black px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition text-base w-full sm:w-auto">Cancel</button>
                        <button type="submit" className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition text-base w-full sm:w-auto">{price === 0 ? "Get Answer" : "Next"}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const QuestionAnswerPage = () => {
    const { region } = useContext(CurrencyContext);
    const questionPrices = {
        '99rs': { price: 99, oldPrice: 149 },
        '199rs': { price: 199, oldPrice: 249 }
    };
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [activeTab, setActiveTab] = useState("99rs");
    const [openQuestions, setOpenQuestions] = useState([]);
    const [unlockedQuestions, setUnlockedQuestions] = useState([]);
    const [showPayment, setShowPayment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

    const [currentQuestionDetails, setCurrentQuestionDetails] = useState(null);
    const [tempDetails, setTempDetails] = useState({ gender: "male", dob: "", timeOfBirth: "", placeOfBirth: "", questionFor: "self" });
    const [questionDetailsMap, setQuestionDetailsMap] = useState({});
    const [answers, setAnswers] = useState({});
    const [isLoadingAnswer, setIsLoadingAnswer] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorPopup, setIsErrorPopup] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [redirectOnClose, setRedirectOnClose] = useState(null);

    const { profile, isLoading, isAuthenticated, updateProfileData } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const hasUsedInitialFreeQuestion = profile?.hasUsedFreeQuestion || false;
    const referralCredits = profile?.referralCredits || 0;
    const freeQuestionsAvailable = (hasUsedInitialFreeQuestion ? 0 : 1) + referralCredits;

    const [userReferralCode, setUserReferralCode] = useState('');
    const baseUrl = import.meta.env.VITE_FRONTEND_BASE_URL || "https://astro-main-lg8g.vercel.app";
    const userReferralLink = userReferralCode ? `${baseUrl}/referral?code=${userReferralCode}` : '';

    const showErrorPopup = (message) => { setIsErrorPopup(true); setPopupMessage(message); };
    const showSuccessPopup = (message) => { setIsErrorPopup(false); setPopupMessage(message); };
    const handlePopupClose = () => {
        setPopupMessage(null);
        if (redirectOnClose) {
            navigate(redirectOnClose);
            setRedirectOnClose(null);
        }
    };

    useEffect(() => {
        if (isAuthenticated && profile && !isLoading) {
            if (profile.referralCode) {
                setUserReferralCode(profile.referralCode);
            } else {
                const newCode = generateUniqueCode(8);
                setUserReferralCode(newCode);
                const saveCode = async () => {
                    try {
                        await api.put("/api/profile/update", { referralCode: newCode });
                        updateProfileData({ ...profile, referralCode: newCode });
                    } catch (error) {
                        console.error("Failed to save referral code:", error);
                    }
                };
                saveCode();
            }
        }
        return () => { setIsComponentMounted(false); };
    }, [isAuthenticated, isLoading, profile]);

    useEffect(() => {
        let progressBarInterval, messageInterval, timerInterval;
        if (isLoadingAnswer && isComponentMounted) {
            setProgress(0);
            progressBarInterval = setInterval(() => {
                setProgress(prev => {
                    if (!isComponentMounted) return prev;
                    if (prev >= 95) { clearInterval(progressBarInterval); }
                    return prev + 1;
                });
            }, 1800);
            setElapsedTime(0);
            timerInterval = setInterval(() => { if (isComponentMounted) setElapsedTime(prev => prev + 1); }, 1000);
            let msgIndex = 0;
            setLoadingMessage(loadingMessages[0]);
            messageInterval = setInterval(() => {
                if (isComponentMounted) {
                    msgIndex = (msgIndex + 1) % loadingMessages.length;
                    setLoadingMessage(loadingMessages[msgIndex]);
                }
            }, 4000);
        }
        return () => { clearInterval(progressBarInterval); clearInterval(messageInterval); clearInterval(timerInterval); };
    }, [isLoadingAnswer, isComponentMounted]);

    const toggleQuestion = (index) => { if (openQuestions.includes(index)) { setOpenQuestions(openQuestions.filter((i) => i !== index)); } else { setOpenQuestions([...openQuestions, index]); } };

    const handleInstantReferralUnlock = async () => {
        setIsReferralModalOpen(false);
        const currentCredits = profile?.referralCredits || 0;
        const newCredits = currentCredits + 1;
        if (profile) { updateProfileData({ ...profile, referralCredits: newCredits }); }
        showSuccessPopup("Referral bonus applied! A free question has been unlocked!");
        try {
            await api.put("/api/profile/update", { referralCredits: newCredits });
        } catch (error) { console.error("Failed to save referral credit to DB:", error); }
    };

    const questions = {
        "99rs": [
            { text: "When can I get my next promotion within the next two years if I make an effort?", price: 99 }, { text: "When am I likely to get married if I make an effort?", price: 99 }, { text: "When am I likely to meet my prospective spouse if I make an effort?", price: 99 }, { text: "When is the strongest possibility of the change of city within the next two years if I make an effort?", price: 99 }, { text: "Predict my health during the next 1 year.", price: 99 }, { text: "When will my health improve if I make an effort?", price: 99 }, { text: "When am I likely to get my next job within the next two years if I make an effort?", price: 99 }, { text: "Possibility of vacation abroad within the next five years if I make an effort?", price: 99 }, { text: "Should I invest in the stock market?", price: 99 }, { text: "Which are the favourable time windows for succeeding in the competitive exams if I make an effort?", price: 99 }, { text: "Shall I be able to discharge my family responsibilities successfully?", price: 99 },
            { text: "Predict career avenues for me.", price: 99 }, { text: "Which career avenues should I avoid?", price: 99 }, { text: "When can I start my own business if I make an effort?", price: 99 }, { text: "Will a government job suit me more than a private job?", price: 99 }, { text: "When can my earnings double if I make an effort?", price: 99 }, { text: "Predict my health during the next ten years.", price: 99 }, { text: "When can I quit smoking if I make an effort?", price: 99 }, { text: "When can I quit alcohol if I make an effort?", price: 99 }, { text: "When is a suitable window / right time for my surgery?", price: 99 }, { text: "When can my marital life situation change if I make an effort ? (answer it with my birth details only)", price: 99 }, { text: "When can I buy my next apartment if I make an effort?", price: 99 }, { text: "When can I buy my next house (landed property) if I make an effort?", price: 99 }, { text: "When am I likely to sell my apartment if I make an effort?", price: 99 }, { text: "When am I likely to sell my house (landed property) if I make an effort?", price: 99 }, { text: "When will my children get married if we make an effort? (answer it with my birth details)", price: 99 }, { text: "Will my children settle abroad if they make an effort? (answer it with my birth details)", price: 99 }, { text: "Suggest root cause & remedies for my negative emotions / depression?", price: 99 }, { text: "Suggest root cause & remedies for the negativity in my family environment? (answer it with my birth details)", price: 99 }, { text: "Which mantras should I chant daily or weekly according to my chart during this one year?", price: 99 }, { text: "When can I get my next promotion within the next five years if I make an effort?", price: 99 }, { text: "When is the strongest possibility of the change of city within the next five years if I make an effort?", price: 99 }, { text: "When am I likely to get my next job within the next five years if I make an effort?", price: 99 }, { text: "Which aspects of life including hobbies should I focus on, to enhance my happiness level?", price: 99 }
        ],
        "199rs": [
            { text: "Predict the profile of my likely spouse.", price: 199 }, { text: "Provide me with all my job promotion windows in the next ten years if I make an effort?", price: 199 }, { text: "When is the strongest possibility of the change of city within the next ten years if I make an effort?", price: 199 }, { text: "Suggest root cause & remedies for the negativity in my professional life?", price: 199 }, { text: "Which probable countries can I try to settle down if I make an effort?", price: 199 }, { text: "What will be the right profession for me with decent earning potential?", price: 199 }, { text: "Probable percentage of marks in my next exam this year.", price: 199 }, { text: "When can I (lady) be blessed with a baby?", price: 199 }, { text: "What type of struggles are likely in my future life ? Suggest remedies.", price: 199 }, { text: "Suggest root cause & remedies for my mental peace.", price: 199 }, { text: "What type of health issues am I likely to encounter in the next ten years? Suggest remedies.", price: 199 }, { text: "Suggest root cause & remedies for my obesity.", price: 199 }, { text: "Give me mahurat dates for my marriage within a two years timeframe.", price: 199 }, { text: "Give me future timelines for my career & marriage during the next ten years?", price: 199 }, { text: "What are the chances of success in the matter of court case for me if I make an effort?", price: 199 }, { text: "Should I become a trader/investor professionally?", price: 199 }, { text: "When is the strongest possibility of the change of cities within the next twenty years if I make an effort?", price: 199 }, { text: "Which financial assets should I focus on, as per my horoscope?", price: 199 }, { text: "When will I be more successful and happy in every field of my life?", price: 199 }, { text: "When will my business get better and more productive?", price: 199 }, { text: "Advise periods when I should be cautious of any emotional turmoil in my life?", price: 199 }, { text: "When will I achieve a stress free life for myself?", price: 199 }, { text: "Predict my spiritual life.", price: 199 }, { text: "Advise which god I should worship?", price: 199 }, { text: "When will I be able to reduce stress in my life?", price: 199 }, { text: "When can I switch from my job to my own business?", price: 199 }, { text: "Advise possible risks in my life where I need to take any specific precautions?", price: 199 }, { text: "When will my spouse be more understanding towards me for a better family environment?", price: 199 }, { text: "How many children can I have?", price: 199 }, { text: "When will I be able to start supporting my parents & family financially?", price: 199 }
        ]
    };

    const handleQuestionClick = (tab, index, price) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname, message: "Please log in to ask a question." } });
            return;
        }

        const questionId = `${tab}-${index}`;
        if (unlockedQuestions.includes(questionId)) { toggleQuestion(index); return; }

        const isNineNineQuestion = price === 99;
        let useType = null;

        if (isNineNineQuestion) {
            if (!hasUsedInitialFreeQuestion) { useType = 'initial'; }
            else if (referralCredits > 0) { useType = 'referral'; }
        }

        if (useType) {
            setCurrentQuestionDetails({ tab, index, price });
            handleDetailsSubmit(null, { isFreeUse: true, useType: useType });
            return;
        }

        setCurrentQuestionDetails({ tab, index, price });
        setTempDetails({ gender: "male", dob: "", timeOfBirth: "", placeOfBirth: "", questionFor: "self" });
        setShowDetailsModal(true);
    };

    const handleDetailsSubmit = async (e, options = { isFreeUse: false, useType: '' }) => {
        if (e) e.preventDefault();
        if (!currentQuestionDetails) return;

        const { tab, index } = currentQuestionDetails;
        const questionId = `${tab}-${index}`;
        const questionText = questions[tab][index].text;

        let detailsToSubmit = tempDetails;
        if (tempDetails.questionFor === 'self' && profile?.dob) {
            detailsToSubmit = { ...tempDetails, dob: profile.dob, timeOfBirth: profile.timeOfBirth, placeOfBirth: profile.placeOfBirth, gender: profile.gender || 'male' };
        } else if (tempDetails.questionFor === 'self' && !profile?.dob && options.isFreeUse) {
            showErrorPopup("Please complete your profile details before using free credit.");
            setRedirectOnClose('/profile');
            return;
        } else if (e && (!detailsToSubmit.dob || !detailsToSubmit.timeOfBirth || !detailsToSubmit.placeOfBirth)) {
            showErrorPopup("Please fill in all birth details to proceed.");
            return;
        }

        setShowDetailsModal(false);
        setQuestionDetailsMap(prev => ({ ...prev, [questionId]: detailsToSubmit }));

        if (options.isFreeUse) {
            const updatePayload = {};
            let successMessage = '';

            if (options.useType === 'initial') {
                updatePayload.hasUsedFreeQuestion = true;
                successMessage = `Initial free question credit used! Fetching your answer...`;
            } else if (options.useType === 'referral') {
                try {
                    await api.post('/api/profile/use-referral-credit');
                    successMessage = `Referral credit used! Fetching your answer...`;
                    updateProfileData({ ...profile, referralCredits: referralCredits - 1 });
                } catch (error) {
                    showErrorPopup("Failed to use referral credit. Please check your internet."); return;
                }
            } else {
                showErrorPopup("Error: No valid free credit type found."); return;
            }

            try {
                if (options.useType === 'initial') {
                    await api.put("/api/profile/update", updatePayload);
                    updateProfileData({ ...profile, ...updatePayload });
                }
            } catch (error) {
                showErrorPopup("Could not update your question status. Please try again."); return;
            }

            setUnlockedQuestions(prev => [...prev, questionId]);
            toggleQuestion(index);
            fetchPrediction(tab, index, questionText, detailsToSubmit);
            showSuccessPopup(successMessage);
        } else {
            setShowPayment(currentQuestionDetails);
        }
    };

    const displayRazorpay = async (baseAmount) => {
        if (!localStorage.getItem('authToken')) { showErrorPopup("Please log in to make a payment."); return; }
        const questionText = questions[showPayment.tab][showPayment.index].text;
        try {
            const amount = region === 'IN' ? baseAmount : (baseAmount * 4) / 83;
            const currency = region === 'IN' ? 'INR' : 'USD';
            const { data: { id: order_id } } = await api.post('/api/payment/create-order', { amount: amount * 100, currency, receipt: `receipt_question_${Date.now()}` });
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount * 100, currency, name: "Steer-U Future Prediction Question", description: questionText, order_id,
                handler: async function (response) {
                    try {
                        await api.post('/api/payment/verify', { razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature });
                        showSuccessPopup("Payment successful! You can now get your answer.");
                        const questionId = `${showPayment.tab}-${showPayment.index}`;
                        setUnlockedQuestions(prev => [...prev, questionId]);

                        let detailsToSubmit = tempDetails;
                        if (tempDetails.questionFor === 'self' && profile && profile.dob) {
                            detailsToSubmit = { ...tempDetails, dob: profile.dob, timeOfBirth: profile.timeOfBirth, placeOfBirth: profile.placeOfBirth, gender: profile.gender || 'male' };
                        }
                        setQuestionDetailsMap(prev => ({ ...prev, [questionId]: detailsToSubmit }));
                        setShowPayment(null);
                        setCurrentQuestionDetails(null);
                    } catch (error) { console.error("Payment verification failed:", error); showErrorPopup("Payment verification failed. Please contact support."); }
                },
                prefill: { name: "", email: "" }, theme: { color: "#f76822" },
            };
            new window.Razorpay(options).open();
        } catch (error) { console.error("Error creating Razorpay order:", error); showErrorPopup("Could not initiate payment. Please try again."); }
    };
    const handlePayment = () => { if (showPayment) { displayRazorpay(showPayment.price); } };

    const fetchPrediction = async (tab, index, questionText, passedDetails = null) => {
        const questionId = `${tab}-${index}`;
        if (!isComponentMounted) return;
        setIsLoadingAnswer(questionId);
        const detailsForThisQuestion = passedDetails || questionDetailsMap[questionId];
        if (!detailsForThisQuestion) { showErrorPopup("Internal error: Could not find birth details for this question. Please try again."); setIsLoadingAnswer(null); return; }
        try {
            const { data } = await api.post('/api/engine/get-prediction', { questionText: questionText, userDetails: detailsForThisQuestion });
            if (!isComponentMounted) return;
            setProgress(100);
            await new Promise(r => setTimeout(r, 500));
            if (!isComponentMounted) return;

            if (data.success) {
                let formattedAnswer = typeof data.prediction === 'object' ? JSON.stringify(data.prediction, null, 2) : String(data.prediction);
                formattedAnswer = formattedAnswer.replace(/\\n/g, '\n');
                setAnswers(prev => ({ ...prev, [questionId]: formattedAnswer }));
                try {
                    if (!isComponentMounted) return;
                    await api.post('/api/predictions/save', { question: questionText, answer: data.prediction, details: detailsForThisQuestion });
                } catch (saveError) { console.error("Failed to save the prediction to Firebase:", saveError); }
            } else { throw new Error(data.prediction || "Prediction was not successful."); }
        } catch (error) {
            if (!isComponentMounted) return;
            console.error("Error fetching prediction:", error);
            const gmLink = `https://mail.google.com/mail/?view=cm&fs=1&to=steeryourhappiness@gmail.com`;
            const errorMessage = error.response?.data?.message || "Could not fetch the answer. Please try again.";
            setAnswers(prev => ({ ...prev, [questionId]: `Sorry, something went wrong: ${errorMessage}. If the issue continues, please contact us at <a href="${gmLink}" target="_blank" rel="noopener noreferrer" style="color:#0e60da; font-weight:bold; text-decoration:underline;">steeryourhappiness@gmail.com</a>.` }));
        } finally { if (isComponentMounted) { setIsLoadingAnswer(null); } }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f76822] via-[#f76822] to-[#f76822] text-white">
            <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-md"> <Navbar /> </div>
            <PopupModal message={popupMessage} onClose={handlePopupClose} isError={isErrorPopup} />

            <DetailsModal
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onSubmit={handleDetailsSubmit}
                details={tempDetails}
                setDetails={setTempDetails}
                price={currentQuestionDetails ? (currentQuestionDetails.price === 99 && freeQuestionsAvailable > 0 ? 0 : currentQuestionDetails.price) : 0}
                profile={profile}
                isLoading={isLoading}
                navigate={navigate}
                location={location}
                showSuccessPopup={showSuccessPopup}
                showErrorPopup={showErrorPopup}
            />
            <ReferralModal show={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} onShare={handleInstantReferralUnlock} referralCode={userReferralCode} referralLink={userReferralLink} />

            <section className="flex flex-col items-center justify-center pt-[20vh] pb-8 px-4 bg-gradient-to-br from-[#6b2400] via-[#f76822] to-[#f76822] text-white backdrop-blur-md">
                <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"> Unlock Your Future Insights </h1>
                <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
                    Access our proprietary prediction engine with free, referral-unlocked, and paid questions. Choose from tiered packages and get accurate, personalized insights.
                </p>
            </section>

            <div className="max-w-4xl mx-auto px-4 w-full text-center mb-4">
                <div className="text-lg md:text-xl font-semibold text-yellow-300 bg-black/20 p-4 rounded-lg shadow-lg">
                    <p>
                        Your first {formatPrice(99, region)} question is on us!
                        <span className="block text-base text-white/90 mt-1">
                            ({hasUsedInitialFreeQuestion ? 1 : 0}/1 initial free question used)
                        </span>
                    </p>

                    {isAuthenticated && (
                        <p className="text-base text-white/90 mt-3 border-t border-yellow-300/30 pt-3">
                            {referralCredits > 0 ? (`You have **${referralCredits} referral free question${referralCredits > 1 ? 's' : ''}** available! `) : (`Want one more free question? Invite a friend with your code!`)}
                            <button onClick={() => setIsReferralModalOpen(true)} className="text-[#FFD700] font-bold hover:underline ml-2">Tap to share your code!</button>
                        </p>
                    )}

                    {!isAuthenticated && (
                        <p className="text-base text-white/90 mt-3 border-t border-yellow-300/30 pt-3">
                            <span className="font-bold text-[#FFD700]">Log in</span> to get your first free question and referral code!
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-2 md:gap-3 mb-6 px-4 flex-wrap">
                {["99rs", "199rs"].map((tab) => (
                    <button
                        key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold shadow-md transition-all text-sm md:text-base ${activeTab === tab ? "bg-white text-orange-600" : "bg-orange-600 hover:bg-orange-500"}`}
                    >
                        {tab === "99rs" ? <><span className="line-through opacity-80 mr-1">{formatPrice(questionPrices['99rs'].oldPrice, region)}</span> {formatPrice(questionPrices['99rs'].price, region)} Questions</> : <><span className="line-through opacity-80 mr-1">{formatPrice(questionPrices['199rs'].oldPrice, region)}</span> {formatPrice(questionPrices['199rs'].price, region)} Questions</>}
                    </button>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-4 scrollbar-thin pb-20 w-full">
                <div className="flex flex-col gap-6">
                    {questions[activeTab] && questions[activeTab].map((q, idx) => {
                        const questionId = `${activeTab}-${idx}`;
                        const isUnlocked = unlockedQuestions.includes(questionId);
                        const isCurrentlyFree = q.price === 99 && freeQuestionsAvailable > 0;
                        const buttonContent = isCurrentlyFree ? (
                            <span className="text-sm font-bold text-orange-500 bg-black/30 px-3 py-1 rounded-full">FREE</span>
                        ) : isUnlocked ? (
                            openQuestions.includes(idx) ? <ChevronUp /> : <ChevronDown />
                        ) : (<Lock />);
                        const detailsForThisQuestion = questionDetailsMap[questionId];

                        return (
                            <div key={idx} className="bg-orange-500/80 rounded-xl shadow-lg overflow-hidden">
                                <button onClick={() => handleQuestionClick(activeTab, idx, q.price)} className="w-full flex items-center justify-between p-4 md:p-5 text-left">
                                    <span className="text-base md:text-lg">{q.text}</span>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">{buttonContent}</div>
                                </button>
                                {openQuestions.includes(idx) && isUnlocked && (
                                    <div className="bg-orange-600 p-4 md:p-5 text-md">
                                        {answers[questionId] ? (
                                            <>
                                                {detailsForThisQuestion && (
                                                    <div className="mb-3 p-3 bg-orange-700/50 rounded-lg text-sm text-white/80 border border-white/20">
                                                        <p className="font-semibold text-white/90">Details Used for this Prediction:</p>
                                                        <p>For: <span className="capitalize">{detailsForThisQuestion.questionFor}</span></p>
                                                        <p>Gender: <span className="capitalize">{detailsForThisQuestion.gender}</span></p>
                                                        <p>DOB: {detailsForThisQuestion.dob}</p>
                                                        <p>Time: {detailsForThisQuestion.timeOfBirth}</p>
                                                        <p>Place: {detailsForThisQuestion.placeOfBirth}</p>
                                                    </div>
                                                )}
                                                <p className="text-base whitespace-pre-wrap">{answers[questionId]}</p>
                                            </>
                                        ) : isLoadingAnswer === questionId ? (
                                            <div className="text-center text-white py-2">
                                                <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
                                                    <motion.div className="bg-green-400 h-2.5 rounded-full" initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 1.5 }} />
                                                </div>
                                                <p className="font-semibold mt-3 text-base md:text-lg">{loadingMessage} ({progress}%)</p>
                                                <p className="text-base text-white/80">Please wait (Please do not close the screen for 2 min until you get the answer)... (Time: {elapsedTime}s)</p>
                                            </div>
                                        ) : (
                                            <button onClick={() => fetchPrediction(activeTab, idx, q.text, questionDetailsMap[questionId])} disabled={isLoadingAnswer} className="bg-white text-orange-600 px-5 py-2 rounded-full font-bold hover:scale-105 transition disabled:opacity-50 text-base">Click to Get Answer</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {showPayment && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-black p-6 rounded-xl w-80 text-center shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">Unlock Question</h2>
                        <p className="mb-4 text-base">Pay {formatPrice(showPayment.price, region)} to unlock this question.</p>
                        <button onClick={handlePayment} className="bg-orange-600 text-white px-6 py-3 rounded-full w-full text-base font-semibold"> Proceed to Pay </button>
                        <button onClick={() => setShowPayment(null)} className="mt-3 text-base text-gray-600"> Cancel </button>
                    </div>
                </div>
            )}
            <ReferralButton userReferralCode={userReferralCode} userReferralLink={userReferralLink} />
            <Footer />
        </div>
    );
};

export default QuestionAnswerPage;