import React from "react";
import { Link } from "react-router-dom";
import { Youtube, Instagram, Facebook, Twitter } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const pages = [
    { name: "Home", path: "/" },
    { name: "Future Prediction", path: "/Question" },
    { name: "Paid Therapy", path: "/paid" },
    { name: "Free counselling", path: "/counselling" },
    { name: "Psychological assessments", path: "/assignment" },
    { name: "Pricing", path: "/pricing" },
  ];

  const extraLinks = [
    { name: "FAQ", path: "/faq" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Feedback & Support", path: "/feedback" },
  ];

  const socialLinks = [
    { icon: <Youtube size={20} />, url: "https://youtube.com/@steer-u?si=ZWCr143Y-qM8MrAC" },
    { icon: <Instagram size={20} />, url: "https://www.instagram.com/steer.your.happiness?igsh=M2NmODQ5MHR3OWx0" },
    { icon: <Facebook size={20} />, url: "https://www.facebook.com/p/Steer-U-61582366083893/" },
    { icon: <Twitter size={20} />, url: "https://twitter.com/SteerU7" },
    { icon: <FaWhatsapp size={20} />, url: "https://chat.whatsapp.com/E8MeFe54zrJG9lgHOBZqYb?mode=wwt" },
  ];

  //Function for smooth scroll-to-top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-brand-dark via-brand-orange to-brand-orange text-white mt-8 shadow-card">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-start">
          <Link
            to="/"
            onClick={scrollToTop}
            className="flex items-center gap-4 mb-4"
          >
            <img
              src="/Astro.png"
              alt="Steer-U Logo"
              className="w-24 h-24 md:w-24 md:h-24 object-contain opacity-100 brightness-200"
            />
            <span className="text-5xl font-kaushan font-bold italic">
              <span className="text-white">Steer</span>
              <span className="text-[#FFD700]">-U</span>
            </span>
          </Link>
          <p className="text-gray-300 text-sm md:text-base">
            Get your personalized guidance and professional therapy support in one platform.
          </p>
        </div>

        {/* Pages */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-3">Pages</h3>
          <ul className="space-y-2">
            {pages.map((page) => (
              <li key={page.name}>
                <Link
                  to={page.path}
                  onClick={scrollToTop}
                  className="hover:text-accent transition-colors duration-300"
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Social */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-3">Support & Social</h3>
          <ul className="space-y-2 mb-4">
            {extraLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={scrollToTop}
                  className="hover:text-accent transition-colors duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex space-x-1 mt-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-10 h-10 rounded-full 
                 bg-gray-100 text-gray-700 hover:bg-accent hover:text-white
                 transition-all duration-300 animate-glowPulse"
              >
                <span className="text-xl">{social.icon}</span>
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="flex justify-between border-t border-gray-700 mt-4 mb-4 pt-4 text-gray-400 text-sm">
        <span className="ml-4">&copy; {new Date().getFullYear()} Steer-U. All rights reserved.</span>
        <span>
          Contact:{" "}
          <a
            href="mailto:admin@steer-u.com"
            className="hover:text-accent mr-4"
          >
            admin@steer-u.com
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
