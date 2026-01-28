import React, { useState, useContext } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { HashLink } from "react-router-hash-link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh-CN', label: '中文(简体)' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'ru', label: 'Русский' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ur', label: 'اردو' },
  ];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  const setCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/; max-age=31536000`;
  };

  React.useEffect(() => {
    const cookie = getCookie('googtrans') || getCookie('GOOGTRANS');
    if (cookie && cookie.startsWith('/')) {
      const parts = cookie.split('/');
      const lang = parts[2] || 'en';
      setSelectedLang(lang);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    // Show loading overlay
    const overlay = document.getElementById('translation-loading-overlay');
    if (overlay) {
      overlay.classList.add('show');
    }
    let observer;
    const stopObserver = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
    const hideOverlay = () => {
      stopObserver();
      setTimeout(() => {
        if (overlay) overlay.classList.remove('show');
      }, 150);
    };
    observer = new MutationObserver(() => {
      const cls = document.documentElement.className || '';
      if (cls.includes('translated-') || document.querySelector('iframe.goog-te-menu-frame')) {
        setTimeout(hideOverlay, 400);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setTimeout(hideOverlay, 3500);
    const value = `/en/${lang}`;
    setCookie('googtrans', value);
    setCookie('GOOGTRANS', value);
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = lang;
      googleSelect.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };
  const pages = [
    { name: "Home", path: "/" },
    {
      name: "Future Prediction",
      dropdown: [
        { name: "Individual", path: "/Question", isHashLink: false },
        { name: "Relationship", path: "/#relationship-section", isHashLink: true },
      ],
    },
    { name: "Paid Therapy", path: "/paid" },
    { name: "Psychological Counselling", path: "/counselling" },
    { name: "Psych Assessment", path: "/assignment" },
    { name: "Pricing", path: "/pricing" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const buttonStyle =
    "px-4 py-2 rounded-2xl font-semibold bg-gradient-to-r from-orange-600 to-orange-400 text-white hover:brightness-110 transition-all";
  const signupButtonStyle =
    "px-4 py-2 rounded-2xl font-semibold bg-white text-dark hover:brightness-105 transition-all";
  const logoutButtonStyle =
    "px-4 py-2 rounded-2xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all";

  return (
    <nav className="bg-gradient-to-r h-[15vh] lg:h-[18vh] from-brand-dark to-brand-orange text-white fixed w-full z-50 shadow-lg">
      <div className="max-w-10xl mx-auto mt-8 px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 flex-shrink-0">
          <h1 className="text-3xl font-kaushan">
            <span className="text-white">Steer</span>
            <span className="text-[#FFD700]">-U</span>
          </h1>
        </Link>
        <div id="google_translate_element" className="hidden"></div>
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-8 font-semibold relative">
            {pages.map((page, index) => (
              <li
                key={page.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {page.dropdown ? (
                  <>
                    <div className="flex items-center cursor-pointer hover:text-[#FFD700] transition-colors duration-300">
                      {page.name}
                      <ChevronDown
                        size={18}
                        className={`ml-1 transition-transform duration-300 ${activeDropdown === index ? "rotate-180" : ""
                          }`}
                      />
                    </div>

                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute left-0 top-full bg-white text-orange-700 mt-2 rounded-lg shadow-lg overflow-hidden z-[9999] min-w-[200px]"
                        >
                          {page.dropdown.map((item) => (
                            <li key={item.name}>
                              {item.isHashLink ? (
                                <HashLink
                                  to={item.path}
                                  smooth
                                  className="block px-4 py-2 hover:bg-orange-100"
                                >
                                  {item.name}
                                </HashLink>
                              ) : (
                                <Link
                                  to={item.path}
                                  className="block px-4 py-2 hover:bg-orange-100"
                                >
                                  {item.name}
                                </Link>
                              )}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={page.path}
                    className="hover:text-[#FFD7a00] transition-colors duration-300"
                  >
                    {page.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:flex space-x-4 items-center">
          <select
            aria-label="Select language"
            value={selectedLang}
            onChange={handleLanguageChange}
            className="bg-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} className="text-black">
                {l.label}
              </option>
            ))}
          </select>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={buttonStyle}>
                Profile
              </Link>
              <button onClick={handleLogout} className={logoutButtonStyle}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={signupButtonStyle}>
              Login
            </Link>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-orange w-full text-center pt-6 px-6 pb-4 text-white font-semibold">
          <div className="flex justify-center mb-4">
            <select
              aria-label="Select language"
              value={selectedLang}
              onChange={handleLanguageChange}
              className="bg-white text-orange-700 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <ul className="divide-y divide-orange-400">
            {pages.map((page, index) => (
              <li key={page.name} className="py-3">
                {page.dropdown ? (
                  <>
                    <div
                      className="flex justify-center items-center cursor-pointer hover:text-[#FFD700]"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === index ? null : index
                        )
                      }
                    >
                      {page.name}
                      {activeDropdown === index ? (
                        <ChevronUp size={18} className="ml-1" />
                      ) : (
                        <ChevronDown size={18} className="ml-1" />
                      )}
                    </div>

                    {activeDropdown === index && (
                      <ul className="mt-2 space-y-2">
                        {page.dropdown.map((item) => (
                          <li key={item.name}>
                            {item.isHashLink ? (
                              <HashLink
                                to={item.path}
                                smooth
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-sm hover:text-[#FFD700]"
                              >
                                {item.name}
                              </HashLink>
                            ) : (
                              <Link
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-sm hover:text-[#FFD700]"
                              >
                                {item.name}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={page.path}
                    onClick={() => setIsOpen(false)}
                    className="hover:text-[#FFD700] transition-colors duration-300"
                  >
                    {page.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-orange-400 flex flex-col items-center space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`${buttonStyle} w-full max-w-sm`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${logoutButtonStyle} w-full max-w-sm`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`${signupButtonStyle} w-full max-w-sm`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
