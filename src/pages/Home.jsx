import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Aboutsection from "../components/sections/AboutSection";
import Relationship from "../components/sections/RelationshipSection";
import FAQSection from "../components/sections/FAQSection";
import "../index.css";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const testimonials = [
      { name: "Mr. Keshavendra Singh", text: "The astrology predictions were highly accurate, and therapy sessions helped me overcome anxiety." },
      { name: "Ms. Riya Sharma", text: "Steer-U’s holistic approach changed the way I look at life and decision making." },
      { name: "John Doe", text: "Professional, reliable, and insightful. I highly recommend Steer-U!" }
];

const quotes = [
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

const messages = [
      <>
            Get instant future predictions with birth details using{" "}
            <span className="text-[#FFD700] font-bold">Vedic Astrology</span>
      </>,
      <>
            <span className="text-violet-400 font-bold">Psychological Counselling</span> services, without disclosing your identity
      </>,
      <>
            Save your valuable <span className="text-[#FFD700] font-bold">time</span> &{" "}
            <span className="text-[#FFD700] font-bold">money</span>
      </>,
      <>
            Free Counselling tips on{" "}
            <span className="text-[#FFD700] font-bold">21 challenging areas</span> in life
      </>,
      <>
            <span className="text-violet-400 font-bold">Free future prediction</span> questions
      </>,
];


const ScrollSection = ({ children, className }) => (
      <motion.div
            className={className}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
      >
            {children}
      </motion.div>
);

const Home = () => {
      const [testimonialIndex, setTestimonialIndex] = useState(0);
      useEffect(() => {
            const timer = setInterval(() => {
                  setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
            }, 5000);
            return () => clearInterval(timer);
      }, []);
      const [quote, setQuote] = useState(quotes[0]);
      const [visible, setVisible] = useState(true);
      useEffect(() => {
            const interval = setInterval(() => {
                  const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
                  setQuote(nextQuote);
                  setVisible(true);
                  setTimeout(() => setVisible(false), 4000);
            }, 8000);
            return () => clearInterval(interval);
      }, []);
      const [currentIndex, setCurrentIndex] = useState(0);
      useEffect(() => {
            const interval = setInterval(() => {
                  setCurrentIndex((prev) => (prev + 1) % messages.length);
            }, 4000);
            return () => clearInterval(interval);
      }, []);

      const cardStyle =
            "bg-gradient-to-br from-brand-orange via-orange-600/100 to-orange-500/70 " +
            "backdrop-blur-md border border-orange-400/20 text-white shadow-lg " +
            "rounded-2xl p-6 hover:scale-105 hover:shadow-xl hover:border-orange-500/40 " +
            "transition-transform transition-shadow duration-300 ease-in-out";

      const buttonStyle =
            "px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all";

      return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-dark via-brand-orange to-brand-orange text-white">
                  <Navbar />

                  <ScrollSection className="relative flex flex-col items-center justify-center text-center min-h-[70vh] bg-transparent px-6 py-20 overflow-hidden">

                        {/* ===== Left Logo ===== */}
                        <img
                              src="/Astro.png"
                              alt="Left Logo"
                              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-24 sm:w-32 md:w-40 opacity-80 hover:opacity-100 transition-opacity duration-300 hidden sm:block"
                        />

                        {/* ===== Right Logo ===== */}
                        <img
                              src="/Astro.png"
                              alt="Right Logo"
                              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-24 sm:w-32 md:w-40 opacity-80 hover:opacity-100 transition-opacity duration-300 hidden sm:block"
                        />

                        {/* ===== MOBILE LOGOS (stacked above text) ===== */}
                        <div className="flex sm:hidden w-full justify-center items-center gap-8 mb-4">
                              <img src="/Astro.png" alt="Left Logo" className="w-16 h-auto opacity-90" />
                              <img src="/Astro.png" alt="Right Logo" className="w-16 h-auto opacity-90" />
                        </div>

                        {/* ===== Title ===== */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-20 mb-6 drop-shadow-lg leading-tight text-white">
                              Welcome to{" "}
                              <span className="font-kaushan italic">
                                    <span className="text-white">Steer</span>
                                    <span className="text-[#FFD700]">-U</span>
                              </span>
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <Link
                                          to="/Question"
                                          className="group bg-black text-white/95 w-68 sm:w-auto flex items-center justify-center gap-2 text-center py-3 px-6 rounded-full hover:bg-gray-900 transition"
                                    >
                                          <span>Predict Your Future</span>
                                          <motion.span className="inline-block" initial={{ x: 0 }} whileHover={{ x: 6 }} transition={{ type: "tween", duration: 0.2 }}>
                                                <ArrowRight className="w-5 h-5" />
                                          </motion.span>
                                    </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                                    <Link
                                          to="/paid"
                                          className="group bg-white text-dark w-52 sm:w-auto flex items-center justify-center gap-2 text-center py-3 px-6 rounded-full hover:bg-gray-200 transition"
                                    >
                                          <span>Get Therapy</span>
                                          <motion.span className="inline-block" initial={{ x: 0 }} whileHover={{ x: 6 }} transition={{ type: "tween", duration: 0.2 }}>
                                                <ArrowRight className="w-5 h-5" />
                                          </motion.span>
                                    </Link>
                              </motion.div>
                        </div>
                        <p className="text-gray-200 text-base sm:text-lg md:text-xl mt-8 max-w-2xl leading-relaxed drop-shadow">
                              Integrating future predictions with psychological counselling. Get personalized insights and guidance tailored for you.
                        </p>
                        <AnimatePresence mode="wait">
                              <motion.p
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-lg sm:text-xl md:text-2xl font-semibold mt-8 text-white"
                              >
                                    {messages[currentIndex]}
                              </motion.p>
                        </AnimatePresence>
                  </ScrollSection>

                  <Aboutsection />
                  <ScrollSection className="py-20 px-6 md:px-16 space-y-12">
                        <div className={cardStyle}>
                              <h2 className="text-4xl font-fancy font-bold mb-4 text-white drop-shadow-md">
                                    Future prediction questions
                              </h2>
                              <p className="text-gray-200 mb-6">
                                    Access our in-house core prediction engine with free, referral-unlocked, and paid questions. Choose from tiered packages and get accurate, personalized insights.
                              </p>

                              <div className="grid md:grid-cols-2 gap-6">
                                    <div className={cardStyle}>
                                          <h3 className="font-semibold text-xl mb-2 text-white">
                                                Free Questions
                                          </h3>
                                          <ul className="list-disc list-inside text-md max-h-40 overflow-y-auto space-y-1 text-gray-300">
                                                <li>When can I get my next promotion within the next two years if I make an effort?</li>
                                                <li>When am I likely to get married if I make an effort?</li>
                                                <li>When am I likely to meet my prospective spouse if I make an effort?</li>
                                                <li>Predict my health during the next 1 year.</li>
                                                <li>Other 5+ free questions</li>
                                          </ul>
                                    </div>

                                    <div className={cardStyle}>
                                          <h3 className="font-semibold text-xl mb-2 text-white">
                                                Paid Packages
                                          </h3>
                                          <ul className="list-disc list-inside text-md space-y-1 text-gray-300">
                                                <li>
                                                      ₹1,100{" "}
                                                      <span className="line-through text-gray-400 ml-1">₹1,500</span>{" "}
                                                      <span className="text-[#FFD700] ml-1">-27%</span>: 5 questions, answers in 1 week
                                                </li>

                                                <li>
                                                      ₹2,100{" "}
                                                      <span className="line-through text-gray-400 ml-1">₹2,500</span>{" "}
                                                      <span className="text-[#FFD700] ml-1">-16%</span>: 7 questions, answers in 2 days
                                                </li>

                                                <li>
                                                      ₹5,100{" "}
                                                      <span className="line-through text-gray-400 ml-1">₹6,250</span>{" "}
                                                      <span className="text-[#FFD700] ml-1">-18%</span>: 10 questions, answers in 2 hour
                                                </li>
                                          </ul>
                                    </div>
                              </div>

                              <Link
                                    to="/Question"
                                    onClick={() => window.scrollTo(0, 0)}
                                    className={`${buttonStyle} bg-[#000000] mt-6 inline-block`}
                              >
                                    Explore Future Questions →
                              </Link>
                        </div>
                  </ScrollSection>
                  <section id="relationship-section">
                        <Relationship />
                  </section>
                  <ScrollSection className="py-20 px-6 md:px-16">
                        <div className={cardStyle}>
                              <h2 className="text-3xl font-fancy font-bold mb-4 text-white drop-shadow-md">
                                    <Link to="/counselling" className="hover:text-orange-200 transition">
                                          Psychological Counselling
                                    </Link>
                              </h2>

                              <p className="text-gray-200 mb-6">
                                    Access 21 counselling topics including Anxiety, Depression, ADHD,
                                    Addiction, and more. Use free therapy videos or book paid one-on-one
                                    sessions with professional therapists.
                              </p>

                              <div className="grid md:grid-cols-3 gap-6">
                                    <Link
                                          to="/free-therapy"
                                          onClick={() => window.scrollTo(0, 0)}
                                          className={cardStyle + " text-center hover:bg-white/10 transition"}
                                    >
                                          <h4 className="font-semibold mb-2 text-orange-200">Free Therapy</h4>
                                          <p className="text-gray-300 text-sm">
                                                For each of 21 areas, symptoms, coping strategy and recovery facts shall help customers with support from friends and family.

                                          </p>
                                    </Link>
                                    <Link
                                          to="/paid"
                                          onClick={() => window.scrollTo(0, 0)}
                                          className={cardStyle + " text-center hover:bg-white/10 transition"}
                                    >
                                          <h4 className="font-semibold mb-2 text-orange-200">Paid Therapy</h4>
                                          <p className="text-gray-300 text-sm">
                                                Experienced RCI registered Psychotherapist provide best-in-class counselling, 20+ assessments, and Hypnotherapy through video session.

                                          </p>
                                    </Link>
                                    <Link
                                          to="/counselling"
                                          onClick={() => window.scrollTo(0, 0)}
                                          className={cardStyle + " text-center hover:bg-white/10 transition"}
                                    >
                                          <h4 className="font-semibold mb-2 text-orange-200">Symptom Tracker</h4>
                                          <p className="text-gray-300 text-sm">
                                                Customer can input 8-10 symptoms which will help Psychotherapist to understand customer’s specific challenge well ahead of the paid session.
                                          </p>
                                    </Link>
                              </div>
                              <Link
                                    to="/counselling"
                                    onClick={() => window.scrollTo(0, 0)}
                                    className={`${buttonStyle} bg-[#000000] mt-6 inline-block`}
                              >
                                    Book Counselling Session →
                              </Link>
                        </div>
                  </ScrollSection>
                  <ScrollSection className="py-20 px-6 md:px-16 mt-[10vh] text-center my-10">
                        <div className={cardStyle}>
                              <h2 className="text-3xl font-fancy font-bold text-white  mb-6 drop-shadow-md">
                                    What Our Users Say
                              </h2>
                              <AnimatePresence mode="wait">
                                    <motion.div
                                          key={testimonialIndex}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -20 }}
                                          transition={{ duration: 0.8 }}
                                    >
                                          <p className="text-gray-200 text-lg mb-4 italic">
                                                "{testimonials[testimonialIndex].text}"
                                          </p>
                                          <h4 className="font-semibold text-orange-200">
                                                {testimonials[testimonialIndex].name}
                                          </h4>
                                    </motion.div>
                              </AnimatePresence>
                        </div>
                  </ScrollSection>
                  <ScrollSection className="py-20 px-6 md:px-16 bg-gradient-to-br from-brand-dark via-brand-orange to-brand-orange text-white rounded-lg shadow-lg mt-10">
                        <div className="max-w-3xl mx-auto text-center">
                              <h2 className="text-3xl md:text-4xl font-fancy font-bold text-white  mb-2 drop-shadow-md">
                                    With the Blessings of Late Mrs. Madhuri Goyal
                              </h2>
                              <p className="text-gray-200 text-lg text-white  md:text-xl mb-6">
                                    (1945 - 1999)
                              </p>
                              <p className="text-gray-200 text-md md:text-lg">
                                    This app is lovingly dedicated to the memory of my late mother, <strong>Mrs. Madhuri Goyal</strong>, whose guidance, love, and blessings continue to inspire every step of this journey. May her spirit continue to guide and bless all who seek insight through this platform.
                              </p>
                        </div>
                  </ScrollSection>
                  <FAQSection />

                  <Footer />

                  <AnimatePresence>
                        {visible && (
                              <motion.div
                                    key={quote}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.8 }}
                                    className="fixed bottom-[15vh] right-10 bg-gradient-to-b from-[#0e3b0b] to-[#0a1e0a] backdrop-blur-md text-white p-4 rounded-xl shadow-lg z-50 max-w-xs border border-green-400"
                              >
                                    <p className="text-sm font-medium leading-relaxed">{quote}</p>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
};

export default Home;
