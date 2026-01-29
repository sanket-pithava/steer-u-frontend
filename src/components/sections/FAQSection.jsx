import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- for navigation

const FAQSection = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Can I talk directly to an astrologer?",
      answer:
        "No. Steer-U does not connect clients with astrologers. All future predictions are automated using Vedic astrology algorithms.",
    },
    {
      question: "Does Steer-U provide full horoscopes?",
      answer:
        "No. It provides instant answers to specific questions based on Vedic astrology but not full detailed horoscopes.",
    },
    {
      question: "How accurate are predictions?",
      answer:
        "Predictions show trends and possibilities, not guarantees. Accuracy depends on correct data and interpretation. Use them as guidance.",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-brand-dark via-brand-orange to-brand-orange text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-fancy font-bold text-white mb-10 text-center drop-shadow-md">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>

        {/* Button to go to full FAQ page */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              navigate("/faq");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-8 py-3 bg-black hover:bg-black text-white font-semibold rounded-full shadow-lg transition-all duration-300"
          >
            View All FAQs
          </button>
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer transition-all hover:bg-white/20"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-xl font-semibold">{faq.question}</h3>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <p className="mt-3 text-gray-200 leading-relaxed">{faq.answer}</p>
      )}
    </div>
  );
};

export default FAQSection;



