import { CheckCircle, X } from "lucide-react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ... (initialIntakeFormState and PopupModal remain unchanged) ...

const initialIntakeFormState = {
  name: "", referredBy: "", address: "", phone: "", email: "",
  age: "", sex: "", occupation: "", receivedTherapyBefore: "",
  concernsAddressed: "", difficultIssues: "", concernsPresentSince: "",
  livesWith: "", supportivePersons: "", medicalCare: "",
  conditionsUnderTreatment: "", chronicIllness: "", additionalTherapy: "",
  confirmationRemarks: ""
};

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


const PaidTherapy = () => {
  // Doctor data (No Change)
  const doctors = [
    // ... (Doctor data array is here) ...
    {
      id: 2, name: "Dr. Sachidananda Nath", email: "sachidanandanath8@gmail.com", meetLink: "https://meet.google.com/abc-xyz-pqr", fee: 1500, oldFee: 1800,
      qualifications: "Ph.D., M.A. (Clinical Psychology), PGDRP (Rehabilitation), NET Qualified, CCMH (NIMHANS)",
      experience: ["6+ Years,", " RCI Registered"], languages: "English, Hindi, Odia",
      expertise: ["Individual Counseling", "Couple Counseling", "Children / Adolescent", "Clinical Issues", "Rehabilitation", "Emotional Trauma"],
      rating: 4.7, slots: ["10:00 AM", "12:00 PM", "3:00 PM"], unavailableDates: [new Date(2025, 9, 7), new Date(2025, 9, 15)],
    },
    {
      id: 3, name: "Dr. Ashish Rathore", email: "ashish.snehsawali511@gmail.com", meetLink: "https://meet.google.com/abc-xyz-pqr", fee: 1500, oldFee: 1800,
      qualifications: "Ph.D., M.A. (Clinical Psychology), B.A. (Psychology), PGDRP (Rehabilitation)",
      experience: ["7+ Years,", " RCI Registered"], languages: "English, Hindi, Marathi, Banjara",
      expertise: ["Individual Counseling", "Couple Counseling", "Children / Adolescent", "Clinical Issues", "Rehabilitation", "Group Counseling", "Substance / Addiction Abuse", "Emotional Trauma"],
      rating: 4.6, slots: ["10:00 AM", "12:00 PM", "3:00 PM"], unavailableDates: [new Date(2025, 9, 10), new Date(2025, 9, 20)],
    },
    {
      id: 5, name: "Dr. Neelam Chejara", email: "drneelamclinic@gmail.com", meetLink: "https://meet.google.com/abc-xyz-pqr", fee: 1500, oldFee: 1800,
      qualifications: "Mphil (Clinical Psychology), M.A.(clinical psychology) & B.A (psychology) Persuing PhD",
      experience: ["5.5 Years,", " RCI Registered"], languages: "English, Hindi, Rajasthani",
      expertise: ["Individual Counseling", "Couple Counseling", "Children / Adolescent", "Clinical Issues", "Group Counseling", "Addiction", "ERP OCD"],
      rating: 4.5, slots: ["10:00 AM", "12:00 PM", "3:00 PM"], unavailableDates: [new Date(2025, 9, 22), new Date(2025, 9, 27)],
    },
    {
      id: 6, name: "Dr. Shruti Sharma", email: "shruti2march@gmail.com", meetLink: "https://meet.google.com/abc-xyz-pqr", fee: 1500, oldFee: 1800,
      qualifications: ["M.A. (Child Psychology)", "International Certified Autism Therapist", " PGDRP (Rehabilitation)", " RCI Registered"],
      experience: "12+ Years", languages: "English, Hindi",
      expertise: ["Individual Counselling", "Couple Counselling", "Clinical Issues", "Assessments", "Children / Adolescent"],
      rating: 4.5, slots: ["10:00 AM", "12:00 PM", "3:00 PM"], unavailableDates: [new Date(2025, 9, 22), new Date(2025, 9, 27)],
    },
    {
      id: 4, name: "Mr. Sai Mann Verma", email: "saimnn1514@gmail.com", meetLink: "https://meet.google.com/abc-xyz-pqr", fee: 1500, oldFee: 1800,
      qualifications: "Brain Gym Trainer, ABA Therapist, PGDRP (Rehabilitation), B.Ed. & D.Ed. (Special Educator), Behaviour Analyst (RBT)",
      experience: ["10+ Years,", " RCI Registered"], languages: "Hindi",
      expertise: ["Special Needs", "ABA Therapy", "Speech / Language Therapy", "Rehabilitation"],
      rating: 4.8, slots: ["10:00 AM", "12:00 PM", "3:00 PM"], unavailableDates: [new Date(2025, 9, 18), new Date(2025, 9, 25)],
    },
    {
      id: 1, name: "Mrs. Ruchi Goyal", email: "goyal.ruchi92@gmail.com", meetLink: "https://meet.google.com/iuf-orkt-bev ", fee: 2000, oldFee: 2800,
      qualifications: "M.A. (Clinical Psychology), PGDRP (Rehabilitation Psychology), Advanced Diploma (Singapore)",
      experience: ["10+ Years,", " RCI Registered,", " Singapore Affiliation"], languages: "English, Hindi",
      expertise: ["Hypnotherapy", "Individual Counseling", "Couple / Relationship Counseling", "Children / Adolescent", "Dementia", "Clinical Issues", "Rehabilitation", "Emotional Trauma"],
      rating: 5, slots: ["10:00 AM", "12:00 PM", "3:00 PM"], unavailableDates: [new Date(2025, 9, 5), new Date(2025, 9, 12)],
    },
  ];

  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [intakeFormData, setIntakeFormData] = useState(initialIntakeFormState);
  const [isSubmittingIntake, setIsSubmittingIntake] = useState(false);
  const [formData, setFormData] = useState({
    pseudoName: "", patientEmail: "", supportFor: "", language: "", mobile: "",
    address: "", services: [], date: "", slot: "", doctor: "",
    doctorEmail: "", meetLink: "",
  });

  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorPopup, setIsErrorPopup] = useState(false);

  const showErrorPopup = (msg) => {
    setIsErrorPopup(true);
    setPopupMessage(msg);
  };

  const showSuccessPopup = (msg) => {
    setIsErrorPopup(false);
    setPopupMessage(msg);
  };

  const handleCheckCalendar = (doctor) => {
    if (localStorage.getItem("authToken")) {
      setSelectedDoctor(doctor);
      setShowCalendar(true);
      setSelectedSlot("");
    } else {
      showErrorPopup("Please log in to book an appointment.");
    }
  };

  const handleConfirm = () => {
    setFormData({
      ...formData,
      date: date.toDateString(),
      slot: selectedSlot,
      doctor: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,
      meetLink: selectedDoctor.meetLink,
    });
    setShowCalendar(false);
    setShowForm(true);
  };

  const isDateDisabled = (date, doctor) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return true;
    }

    const day = date.getDay();
    const unavailable = doctor.unavailableDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    return day === 0 || unavailable;
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        services: checked
          ? [...prev.services, value]
          : prev.services.filter((s) => s !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleIntakeChange = (e) => {
    const { name, value } = e.target;
    setIntakeFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingIntake(true);
    try {
      const response = await api.post('/api/intake-form/submit', intakeFormData);
      showSuccessPopup(response.data.message + " You can now proceed to your session.");
      setShowIntakeForm(false);
      setIntakeFormData(initialIntakeFormState);
    } catch (error) {
      console.error("Failed to submit intake form:", error);
      showErrorPopup(error.response?.data?.message || "Form submission failed. Please try again.");
    } finally {
      setIsSubmittingIntake(false);
    }
  };
  const displayRazorpay = async (amount) => {
    if (!localStorage.getItem("authToken")) {
      showErrorPopup("Please log in to make a payment.");
      return;
    }
    if (!window.Razorpay) {
      showErrorPopup("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    try {
      const amountInPaise = amount;
      const {
        data: { id: order_id, currency },
      } = await api.post("/api/payment/create-order", {
        amount: amountInPaise,
        receipt: `receipt_booking_${Date.now()}`,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency,
        name: "Steer-U Therapy Booking",
        description: `Booking for ${selectedDoctor.name}`,
        order_id,
        handler: async function (response) {
          const paymentDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
          try {
            await api.post("/api/payment/verify", paymentDetails);

            const bookingData = {
              ...formData,
              paymentId: paymentDetails.razorpay_payment_id,
              amountPaid: amount,
              currency: currency,
            };

            await api.post("/api/bookings/create", {
              bookingDetails: bookingData,
            });
            const intakeStatusResponse = await api.get('/api/profile/check-intake-status');
            const hasSubmittedIntake = intakeStatusResponse.data.hasSubmittedIntake;

            if (hasSubmittedIntake) {
              showSuccessPopup("Your appointment has been booked successfully! See you in the session.");
              setShowForm(false);
            } else {
              showSuccessPopup("Your appointment has been booked! Please fill out the mandatory Intake Form before your session.");
              setShowForm(false);
              setShowIntakeForm(true);
            }

          } catch (error) {
            showErrorPopup(
              "Payment successful but booking failed. Please contact support."
            );
          }
        },
        prefill: {
          name: formData.pseudoName,
          email: formData.patientEmail,
          contact: formData.mobile,
        },
        theme: { color: "#f76822" },
      };
      new window.Razorpay(options).open();
    } catch (error) {
      showErrorPopup("Could not initiate payment. Please try again later.");
    }
  };
  // ---------------------------------------

  // ... handleSubmit function (No Change) ...
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.pseudoName || !formData.patientEmail || !formData.supportFor ||
      !formData.language || !formData.mobile || !formData.address
    ) {
      showErrorPopup("Please fill in all the required fields.");
      return;
    }

    const amount = selectedDoctor.fee;
    if (!amount || isNaN(amount)) {
      showErrorPopup("Could not determine the fee.");
      return;
    }
    displayRazorpay(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange text-white">
      <Navbar />
      <PopupModal
        message={popupMessage}
        onClose={() => setPopupMessage(null)}
        isError={isErrorPopup}
      />
      <section className="flex flex-col items-center justify-center text-center pt-[15vh] pb-8 px-4 bg-gradient-to-br from-brand-dark via-orange-600/100 to-orange-500/70">
        <h1 className="text-4xl md:text-5xl mt-6 font-bold text-white drop-shadow-lg mb-3">
          Paid Therapy
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl drop-shadow-md">
          Book your therapy sessions with expert psychologists and begin your
          journey toward a happier, balanced life.{" "}
          <span className="font-bold text-[#FFD700]">
            All sessions will be conducted online.
          </span>
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 lg:grid-cols-3 gap-6 px-4 pb-8">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] rounded-xl p-4 relative border border-green-900 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div>
              <h2 className="text-xl font-semibold text-white drop-shadow">
                {doctor.name}
              </h2>
              <div className="my-2">
                <span className="text-2xl font-bold text-white">
                  ₹{doctor.fee}
                </span>
                <span className="text-md text-gray-300 line-through ml-2">
                  ₹{doctor.oldFee}
                </span>
                <span className="text-md text-green-200 ml-2">
                  /session
                </span>
              </div>
              <p className="text-xs text-green-200 mb-2">(*tax included)</p>
              <p className="text-sm mt-1 text-green-100">
                Qualifications: {doctor.qualifications}
              </p>
              <p className="text-sm mt-1 text-green-100">
                Experience: {doctor.experience}
              </p>
              <p className="text-sm mt-1 text-green-100">
                Language: {doctor.languages}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {doctor.expertise.map((area, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-900 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handleCheckCalendar(doctor)}
                className="bg-white text-green-900 rounded-full px-4 py-1 text-sm font-semibold shadow hover:bg-green-50 transition"
              >
                Calendar
              </button>
              <button
                onClick={() => handleCheckCalendar(doctor)}
                className="bg-green-700 text-white rounded-full px-4 py-1 text-sm font-semibold shadow hover:bg-green-800 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
      {showCalendar && selectedDoctor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f76822] text-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              Select Date & Slot - {selectedDoctor.name}
            </h2>
            <Calendar
              onChange={setDate}
              value={date}
              minDate={new Date()}
              tileDisabled={({ date }) =>
                isDateDisabled(date, selectedDoctor)
              }
              className="mb-4 text-black rounded-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              {selectedDoctor.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded-lg border ${selectedSlot === slot
                    ? "bg-[#FFD700] text-black border-[#FFD700]"
                    : "bg-orange-100/20 text-white border-orange-200"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowCalendar(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedSlot}
                className="bg-[#FFD700] text-black px-4 py-2 rounded-lg disabled:opacity-50 hover:brightness-110"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="bg-[#f76822] rounded-2xl shadow-xl w-full max-w-md mx-auto text-white my-8 
              max-h-[85vh] overflow-y-auto"
          >
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="pseudoName"
                  placeholder="Name/Pseudo Name *"
                  value={formData.pseudoName}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white"
                />
                <input
                  type="email"
                  name="patientEmail"
                  placeholder="Your Email Address *"
                  value={formData.patientEmail}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white"
                />
                <div>
                  <label className="block text-white text-sm mb-1">
                    Support for *
                  </label>
                  <select
                    name="supportFor"
                    value={formData.supportFor}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white focus:ring-2 focus:ring-yellow-300 outline-none appearance-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "white",
                    }}
                  >
                    <option
                      value=""
                      style={{ backgroundColor: "#333", color: "white" }}
                    >
                      Select
                    </option>
                    <option
                      value="self"
                      style={{ backgroundColor: "#333", color: "white" }}
                    >
                      Self
                    </option>
                    <option
                      value="other"
                      style={{ backgroundColor: "#333", color: "white" }}
                    >
                      Other
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Preferred Language *
                  </label>
                  <input
                    type="text"
                    name="language"
                    placeholder="Enter your preferred language"
                    value={formData.language}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white focus:ring-2 focus:ring-yellow-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white focus:ring-2 focus:ring-yellow-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white focus:ring-2 focus:ring-yellow-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Select Services (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Counselling", "Assessment", "Hypnotherapy", "Special Needs",
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20"
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={option}
                          checked={formData.services.includes(option)}
                          onChange={handleFormChange}
                          className="accent-yellow-400"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <input type="text" name="doctor" value={formData.doctor} readOnly className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white" />
                <input type="text" name="date" value={formData.date} readOnly className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white" />
                <input type="text" name="slot" value={formData.slot} readOnly className="w-full border rounded-lg px-3 py-2 bg-white/20 text-white" />
                <div className="flex justify-between pt-2 sticky bottom-0 bg-[#f76822] pb-2">
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                    Cancel
                  </button>
                  <button type="submit" className="bg-[#FFD700] text-black px-4 py-2 rounded-lg hover:brightness-110">
                    Proceed to Pay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showIntakeForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 overflow-auto">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white text-black rounded-2xl p-8 max-w-3xl w-full shadow-2xl overflow-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#f76822]">Counselling Intake Form</h2>
                <button onClick={() => setShowIntakeForm(false)} className="text-gray-600 hover:text-black"><X size={24} /></button>
              </div>
              <form onSubmit={handleIntakeSubmit} className="space-y-5 text-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="name" value={intakeFormData.name} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Name *" required />
                  <input name="referredBy" value={intakeFormData.referredBy} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Referred by" />
                  <input name="phone" value={intakeFormData.phone} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Phone *" required />
                  <input name="email" value={intakeFormData.email} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Email" />
                </div>
                <textarea name="address" value={intakeFormData.address} onChange={handleIntakeChange} className="border p-2 rounded w-full" placeholder="Address" rows={2}></textarea>
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

                <div className="text-right pt-2 sticky bottom-0 bg-white pb-2 rounded-b-xl">
                  <button type="submit" disabled={isSubmittingIntake} className="bg-[#f76822] text-white px-6 py-2 rounded-full hover:bg-[#d95d1e] transition disabled:opacity-50">
                    {isSubmittingIntake ? "Submitting..." : "Submit Intake Form"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PaidTherapy;