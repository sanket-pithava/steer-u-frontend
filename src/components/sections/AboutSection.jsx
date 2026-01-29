import React from "react";
import { Link } from "react-router-dom";


const cardStyle =
  "bg-gradient-to-br from-brand-orange via-orange-600/100 to-orange-500/70 " +
  "backdrop-blur-md border border-orange-400/20 text-white shadow-lg " +
  "rounded-2xl p-6 hover:scale-105 hover:shadow-xl hover:border-orange-500/40 " +
  "transition-transform transition-shadow duration-300 ease-in-out";
const About = () => {
  return (
    <section className="py-20 px-6 md:px-16 from-brand-orange via-orange-600/100 to-orange-500/70">
      <div className={cardStyle}>
        <h2 className="text-3xl md:text-4xl font-fancy font-bold mb-6 drop-shadow-md">
          About{" "}
          <span className="font-kaushan text-white">Steer</span>
          <span className="font-kaushan text-[#FFD700]">-U</span>
        </h2>


        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-200 mb-4 leading-relaxed">
              Steer-U provides instant future predictions with your birth
              details (using an advanced computerised program based on the
              ancient Vedic Astrology) and online Psychological Counselling
              services by the RCI certified Psychologists.
            </p>


            <p className="text-gray-200 mb-4 leading-relaxed">
              With Steer-U, you can {" "}
              <span className="font-semibold text-orange-200">
                Steer Your Happiness
              </span>{" "}
              with the Astrology & Psychology services under one roof (2 free
              questions about your future life and the Free Therapy tips plus
              the paid services).
            </p>


            <p className="text-gray-200 leading-relaxed">
              Save on your valuable time and energy without speaking to any
              astrologer or going to a Psychotherapy clinic. You are not
              required to disclose your identity.{" "}
              <span className="font-semibold text-orange-300">
                Confidentiality is guaranteed.
              </span>
            </p>
          </div>


          {/* Replace wheel and text with a single video */}
          <div className="flex justify-center md:justify-end relative">
            <video
              src="./video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-[40vh] w-auto object-contain rounded-xl shadow-lg"
            ></video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
