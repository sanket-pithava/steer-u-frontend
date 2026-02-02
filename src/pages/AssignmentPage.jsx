import { Lock, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatPrice } from "../utils/priceUtils";
const PopupModal = ({ message, onClose }) => (
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

const AssignmentPage = () => {
  const { region } = useContext(CurrencyContext);
  const [assessmentType, setAssessmentType] = useState("free");
  const [popupMessage, setPopupMessage] = useState(null);
  const [unlockedTests, setUnlockedTests] = useState({});
  const [selectedTest, setSelectedTest] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paidAssessments = [
    { name: "Learning Pattern", price: 800 },
    { name: "Memory", price: 1500 },
    { name: "Developmental delays", price: 1200 },
    { name: "Relationship issues / compatibility", price: 2000 },
    { name: "I.Q", price: 2500 },
    { name: "OCD", price: 2500 },
    { name: "ADHD", price: 2500 },
    { name: "ADHD screening", price: 1000 },
    { name: "Autism", price: 2500 },
    { name: "Mental Retardation", price: 3500 },
    { name: "Depression, Anxiety & Stress", price: 1500 },
    { name: "Anxiety only", price: 800 },
    { name: "Depression only", price: 800 },
    { name: "Stress only", price: 800 },
    { name: "EQ Test / ET", price: 1500 },
    { name: "Learning Disability", price: 2000 },
    { name: "Behavioral screening", price: 1000 },
    { name: "Personality Test", price: 2000 },
    { name: "QOL (Quality of Life)", price: 2000 },
    { name: "Social Maturity Scale", price: 1500 },
    { name: "Self-harm / Suicide Assessment", price: 1500 },
    { name: "Addiction", price: 1200 },
  ];

  const displayRazorpay = async (assessment) => {
    if (assessment.price === 0) {
      setUnlockedTests((prev) => ({ ...prev, [assessment.name]: true }));
      setPopupMessage(`"${assessment.name}" assessment unlocked (Free).`);
      return;
    }

    const idToken = localStorage.getItem("authToken");
    if (!idToken) {
      setPopupMessage("Please log in to continue.");
      return;
    }

    try {
      const amount = region === 'IN' ? assessment.price : (assessment.price * 4) / 83;
      const currency = region === 'IN' ? 'INR' : 'USD';
      const { data } = await api.post(
        "/api/payment/create-order",
        {
          amount: amount * 100,
          currency,
          receipt: `receipt_${assessment.name}_${new Date().getTime()}`,
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      const { id: order_id } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "Psychological Assessment",
        description: assessment.name,
        order_id,
        handler: async function (response) {
          try {
            await api.post(
              "/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${idToken}` } }
            );
            setUnlockedTests((prev) => ({ ...prev, [assessment.name]: true }));
            setPopupMessage(
              `Payment successful! "${assessment.name}" is now unlocked.`
            );
          } catch (error) {
            console.error("Payment verification failed:", error);
            setPopupMessage("Payment verification failed. Please contact support.");
          }
        },
        prefill: { name: "", email: "" },
        theme: { color: "#f76822" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      setPopupMessage("Could not initiate payment. Please try again.");
    }
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const idToken = localStorage.getItem("authToken");
      if (!idToken) {
        setPopupMessage("Please log in before submitting the test.");
        setIsSubmitting(false);
        return;
      }

      await api.post(
        "/api/assignments/submit",
        {
          assessmentType: "paid",
          testName: selectedTest,
          answer: answer,
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      setPopupMessage("Your response has been submitted successfully!");
      setSelectedTest(null);
      setAnswer("");
    } catch (error) {
      console.error("Submission failed:", error);
      setPopupMessage("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6b2400] via-[#f76822] to-[#f76822]">
      <Navbar />
      <div className="pt-20"></div>
      <PopupModal message={popupMessage} onClose={() => setPopupMessage(null)} />
      <div className="flex flex-col items-center mt-14 mb-4">
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-[50vh] h-40 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => {
            setAssessmentType("free");
            setSelectedTest(null);
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${assessmentType === "free"
            ? "bg-orange-600 text-white shadow-lg"
            : "bg-white text-black hover:bg-orange-100"
            }`}
        >
          Free Assessment
        </button>
        <button
          onClick={() => {
            setAssessmentType("paid");
            setSelectedTest(null);
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${assessmentType === "paid"
            ? "bg-orange-600 text-white shadow-lg"
            : "bg-white text-black hover:bg-orange-100"
            }`}
        >
          Paid Assessment
        </button>
      </div>
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6 text-white">
        {assessmentType === "free" && (
          <div className="bg-white text-black w-full max-w-xl p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">
              Free Assessment
            </h2>
            <p className="text-lg font-medium">Coming Soon...</p>
          </div>
        )}
        {assessmentType === "paid" && !selectedTest && (
          <div className="w-full max-w-9xl bg-white rounded-2xl shadow-lg p-6 text-black">
            <h2 className="text-2xl font-semibold text-center text-orange-600 mb-6">
              Paid Assessments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {paidAssessments.map((a, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-orange-500/90 hover:bg-orange-600 text-white rounded-xl p-5 cursor-pointer transition-all duration-200 shadow-md"
                  onClick={() =>
                    unlockedTests[a.name]
                      ? setSelectedTest(a.name)
                      : displayRazorpay(a)
                  }
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{a.name}</span>
                    <span className="text-sm opacity-90">
                      {a.price === 0 ? "Free" : formatPrice(a.price, region)}
                    </span>
                  </div>

                  {!unlockedTests[a.name] && (
                    <div className="flex items-center justify-center bg-white/20 rounded-full p-2">
                      <Lock size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedTest && (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 text-black text-center">
            <h2 className="text-xl font-bold text-orange-600 mb-4">
              {selectedTest} Assessment
            </h2>
            <p className="text-lg font-bold text-gray-700">
              Assessment form shall be provided by the Psychotherapist.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AssignmentPage;
