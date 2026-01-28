import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

const Hypnotherapy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6b2400] via-[#f76822] to-[#f76822] text-white">
      <Navbar />
      <div className="flex-grow flex flex-col mt-14 items-center justify-center px-6 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-8"
        >
          Hypnotherapy
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-3xl bg-white/20 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-lg text-lg leading-relaxed"
        >
          <p className="mb-4">
            Hypnotherapy is a therapeutic technique that uses hypnosis to help
            individuals make positive changes to their thoughts, feelings, and
            behaviors.
          </p>
          <p className="mb-4">
            A hypnotherapist uses verbal cues, mental imagery, and guided
            relaxation techniques to help you enter a state of focused
            concentration, often called a trance.
          </p>
          <p className="mb-4">
            In this state, your mind is more receptive to suggestions. The goal
            is to help align your conscious intentions with your subconscious
            beliefs.
          </p>
          <p className="mb-6">
            Hypnotherapy aims to access the subconscious mind to help change or
            reframe beliefs that are causing problems or hindering progress.
          </p>
          <p>
            Hypnotherapy can be used for a variety of psychological and physical
            conditions (anxiety, depression, fear, emotional trauma, addiction & weight loss).
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/paid")}
            className="mt-8 px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl shadow-md hover:bg-orange-100 transition-all"
          >
            Click to book online session with therapist Mrs. Ruchi Goyal
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Hypnotherapy;




