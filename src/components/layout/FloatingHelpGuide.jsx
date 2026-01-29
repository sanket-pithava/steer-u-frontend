import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

const FloatingHelpGuide = () => {
  const [open, setOpen] = useState(false);

  const steps = [
    "1️ Log in first",
    "2️ Key in your or loved one’s birth details in Profile section (ensure correct entries esp. Place)",
    "3️ Choose free question",
    "4️ Refer your friends to unlock 2nd question",
    "5️ Pay for further questions",
  ];

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-gradient-to-b from-[#0e3b0b] to-[#0a1e0a] text-neutral p-4 rounded-full shadow-card z-50 hover:shadow-2xl transition duration-400"
        title="Steps for Future Prediction Users"
      >
        {open ? <X size={24} /> : <HelpCircle size={26} />}
      </motion.button>

      {/* Floating Card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 bg-primary-bg border border-primary-light shadow-card rounded-xl w-80 p-5 z-50 animate-fadeInUp"
          >
            <h3 className="text-lg font-semibold text-primary-dark mb-3 font-fancy">
              Steps for Future Prediction Users
            </h3>

            <ul className="space-y-2 text-sm text-gray-dark font-sans">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>

            <p className="text-xs text-gray-dark mt-4 leading-relaxed">
              If you face any issue while using the website, please email us at{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=steeryourhappiness@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                steeryourhappiness@gmail.com
              </a>.
            </p>



            <a
              href="/Question"
              className="block mt-4 text-sm font-semibold text-primary hover:text-accent transition-colors underline"
            >
              Go to Future Prediction →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingHelpGuide;
