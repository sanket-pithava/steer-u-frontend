import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import api from '../../services/api'; // API helper import karein
import { CurrencyContext } from '../../context/CurrencyContext';
import { formatPrice } from '../../utils/priceUtils';

// --- CUSTOM POPUP MODAL ---
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
const customPackages = [
  { id: 1, price: 5100, usd: 199, questions: 10, delivery: "within 1 hour" },
  { id: 2, price: 2100, usd: 99, questions: 7, delivery: "within 1 day" },
  { id: 3, price: 1100, usd: 49, questions: 5, delivery: "within 1 week" },
];
const FuturePredictionSection = () => {
  const { region } = useContext(CurrencyContext);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // NAYE STATES: Popup aur loading ke liye
  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorPopup, setIsErrorPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showErrorPopup = (message) => { setIsErrorPopup(true); setPopupMessage(message); };
  const showSuccessPopup = (message) => { setIsErrorPopup(false); setPopupMessage(message); };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setQuestions(Array(pkg.questions).fill(""));
  };

  const handleQuestionChange = (index, value) => {
    if (value.split(" ").length <= 16) { // 15 words + 1 space
      const updated = [...questions];
      updated[index] = value;
      setQuestions(updated);
    }
  };

  // NAYA: RAZORPAY PAYMENT LOGIC
  const displayRazorpay = async () => {
    if (!localStorage.getItem('authToken')) {
        showErrorPopup("Please log in to make a payment.");
        return;
    }

    const baseAmount = selectedPackage.price;
    const amount = region === 'IN' ? baseAmount : (baseAmount * 4) / 83;
    const currency = region === 'IN' ? 'INR' : 'USD';
    const description = `${selectedPackage.questions} customised questions`;

    try {
        const { data: { id: order_id } } = await api.post('/api/payment/create-order', { amount: amount * 100, currency, receipt: `receipt_custom_pkg_${selectedPackage.id}` });
        
        const options = {
            key: "rzp_test_RPNPg6A7yl1KPA",
            amount: amount * 100,
            currency,
            name: "Astro App Custom Package",
            description: description,
            order_id,
            handler: async function (response) {
                try {
                  
                    await api.post('/api/payment/verify', { ...response });
                  
                    await api.post('/api/custom-questions/save', { 
                        packageDetails: selectedPackage,
                        questionsList: questions,
                        paymentId: response.razorpay_payment_id,
                        amountPaid: amount,
                        currency
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
    displayRazorpay();
    setIsLoading(false);
  };

  const cardStyle =
    "bg-gradient-to-br from-[#f76822] via-orange-600/100 to-orange-500/70 " +
    "backdrop-blur-md border border-orange-400/20 text-white shadow-lg " +
    "rounded-2xl p-6 transition-transform transition-shadow duration-300 ease-in-out";

  return (
    <div className="bg-gradient from-[#f76826] via-[#f76822] to-[#f76822] py-16 px-4 md:px-12 text-white">
      <PopupModal message={popupMessage} onClose={() => setPopupMessage(null)} isError={isErrorPopup} />
      
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
        Future Prediction Customised Packages
      </h2>

      {/* Package Cards */}
      {!selectedPackage ? (
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {customPackages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              className="cursor-pointer bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822] border border-orange-300 rounded-2xl p-6 shadow-lg text-center hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold mb-2">
                {formatPrice(pkg.price, region)}
              </h3>
              <p className="text-gray-200">
                {pkg.questions} customised questions with answers delivered{" "}
                {pkg.delivery}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Question Input Form */
        <div className="max-w-3xl mx-auto bg-white text-black p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-center text-orange-600 mb-4">
            {formatPrice(selectedPackage.price, region)}
          </h3>
          <p className="text-center text-gray-700 mb-6">
            {selectedPackage.questions} customised questions with answers{" "}
            {selectedPackage.delivery}
          </p>

          <form onSubmit={handleSubmit}> {/* Form tag add kiya */}
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={index}>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Question {index + 1} (max 15 words)
                  </label>
                  <input
                    type="text"
                    value={q}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    placeholder="Type your question..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required 
                  />
                  <p className="text-right text-sm text-gray-500">
                    {q.trim() === '' ? 0 : q.trim().split(/\s+/).length} / 15 words
                  </p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-orange-700 transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : `Proceed to Pay ${formatPrice(selectedPackage.price, region)}`}
            </button>
          </form>

          <button
            onClick={() => setSelectedPackage(null)}
            className="w-full text-gray-600 font-semibold py-3 mt-3 hover:underline"
          >
            ← Back to Packages
          </button>
        </div>
      )}
    </div>
  );
};

export default FuturePredictionSection;



