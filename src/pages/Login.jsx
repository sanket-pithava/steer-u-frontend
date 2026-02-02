import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { CurrencyContext } from "../context/CurrencyContext";
import { FaGoogle, FaApple, FaEnvelope, FaMobileAlt } from "react-icons/fa";
import { generateRecaptcha } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
// Default to backend on port 5555 if VITE_API_BASE_URL is not provided
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5555';
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const Login = () => {
    const [isLoginModal, setIsLoginModal] = useState(true);
    const [isOtpModal, setIsOtpModal] = useState(false);
    const navigate = useNavigate();
    const otpInputRef = useRef([]);


    const [authTarget, setAuthTarget] = useState('phone');

    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [is18Confirmed, setIs18Confirmed] = useState(false);
    const [isTncConfirmed, setIsTncConfirmed] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [emailSent, setEmailSent] = useState(false);
    const [storedEmail, setStoredEmail] = useState('');
    const [isLinkProcessing, setIsLinkProcessing] = useState(false);
    const [region, setRegionState] = useState('');

    const { login } = useContext(AuthContext);
    const { setRegion } = useContext(CurrencyContext);
    const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true,
    };


    useEffect(() => {
        document.body.style.overflow = "hidden";
        if (isSignInWithEmailLink(auth, window.location.href)) {
            setIsLinkProcessing(true);

            let emailToVerify = window.localStorage.getItem('emailForSignIn');

            if (!emailToVerify) {
                emailToVerify = prompt('Please enter your email address to complete sign-in:');
            }
            if (emailToVerify) {
                const completeSignIn = async () => {
                    try {
                        const result = await signInWithEmailLink(auth, emailToVerify, window.location.href);
                        const idToken = await result.user.getIdToken();

                        const res = await api.post("/api/auth/verify-firebase-token", { idToken });

                        login(res.data.token);
                        setRegion(region);
                        window.localStorage.removeItem('emailForSignIn');
                        navigate("/");

                    } catch (error) {
                        console.error("Email Link Sign-in Error:", error);
                        setErrorMsg('Verification Link Invalid/Expired. Please try again.');
                        setIsLinkProcessing(false);
                        setIsLoginModal(true);
                    }
                };
                completeSignIn();

            } else {
                setErrorMsg('Email address required to complete sign-in.');
                setIsLinkProcessing(false);
                setIsLoginModal(true);
            }
        }
        if (authTarget === 'phone' && !window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                },
                'expired-callback': () => {
                    setErrorMsg("Security check expired. Please try again.");
                }
            });
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [authTarget, navigate, login, auth]);
    const clearError = () => setErrorMsg('');
    useEffect(() => {
        if (isOtpModal && otpInputRef.current[0]) {
            otpInputRef.current[0].focus();
        }
    }, [isOtpModal]);
    const handleSendOtp = async () => {
        clearError();

        if (!region) {
            setErrorMsg("Please select your region.");
            return;
        }

        if (!is18Confirmed || !isTncConfirmed) {
            setErrorMsg("Age and T&C confirmations are mandatory.");
            return;
        }
        setLoading(true);
        if (authTarget === 'phone') {
            if (phone.length !== 10) {
                setErrorMsg("Please enter a 10-digit mobile number.");
                setLoading(false);
                return;
            }
            const appVerifier = window.recaptchaVerifier;
            const fullPhoneNumber = `+91${phone}`;
            try {
                if (!appVerifier) {
                    setErrorMsg("Security check failed to initialize. Please try refreshing.");
                    setLoading(false);
                    return;
                }
                const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
                setConfirmationResult(result);
                console.log("OTP successfully sent via Firebase.");
                setIsLoginModal(false);
                setIsOtpModal(true);
            } catch (error) {
                console.error("Firebase Phone Sign-In Error:", error);
                if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.render().then(function (widgetId) {
                        grecaptcha.reset(widgetId);
                    });
                }
                setErrorMsg("Error occurred while sending OTP. Please check the number and try again.");
            } finally {
                setLoading(false);
            }
        } else {
            if (!email || !email.includes("@")) {
                setErrorMsg("Please enter a valid email address.");
                setLoading(false);
                return;
            }
            try {
                await sendSignInLinkToEmail(auth, email, actionCodeSettings);

                window.localStorage.setItem('emailForSignIn', email);

                setStoredEmail(email);
                setEmailSent(true);
                setIsLoginModal(false);

            } catch (error) {
                console.error("Email Link Send Error:", error);
                setErrorMsg(error.message || "Error occurred while sending email verification link.");
            } finally {
                setLoading(false);
            }
        }
    };
    const handleVerifyOtp = async () => {
        clearError();
        if (otp.length !== 6) {
            setErrorMsg("Please enter a 6-digit OTP.");
            return;
        }
        setLoading(true);

        if (authTarget === 'phone') {
            if (!confirmationResult) {
                setErrorMsg("An error occurred while sending OTP. Please try again.");
                setLoading(false);
                return;
            }
            try {
                const credential = await confirmationResult.confirm(otp);
                const user = credential.user;

                const firebaseIdToken = await user.getIdToken();

                const { data } = await api.post("/api/auth/verify-firebase-token", {
                    idToken: firebaseIdToken
                });

                console.log("Firebase Login successful! Custom Token:", data.token);
                login(data.token);
                setRegion(region);
                navigate("/");

            } catch (error) {
                console.error("Firebase Verification Error:", error);
                setErrorMsg("Invalid OTP or session expired. Please enter the correct code.");
            } finally {
                setLoading(false);
            }
        } else {

            setErrorMsg("Please check your email for the verification link.");
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        clearError();
        if (!region) {
            setErrorMsg("Please select your region.");
            return;
        }
        if (!is18Confirmed || !isTncConfirmed) {
            setErrorMsg("Age and T&C confirmations are mandatory for Social Login as well.");
            return;
        }
        localStorage.setItem('userRegion', region);
        const authUrl = `${BACKEND_BASE_URL}/api/auth/${provider}`;
        // Full-page redirect to backend OAuth endpoint; backend will redirect back to /login-success
        window.location.href = authUrl;
    };
    const handleClose = () => {
        setIsLoginModal(false);
        navigate("/");
    };

    const handleOtpClose = () => {
        setIsOtpModal(false);
        navigate("/");
    };
    const verificationTarget = authTarget === 'phone' ? `+91${phone}` : email;
    const AuthTargetSwitch = () => (
        <div className="flex bg-neutral/20 rounded-full p-1 mb-4 text-sm font-semibold">
            <button
                onClick={() => setAuthTarget('phone')}
                className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-2 ${authTarget === 'phone' ? 'bg-accent text-dark shadow-md' : 'text-neutral'
                    }`}
            >
                <FaMobileAlt /> Mobile OTP
            </button>
            <button
                onClick={() => setAuthTarget('email')}
                className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-2 ${authTarget === 'email' ? 'bg-accent text-dark shadow-md' : 'text-neutral'
                    }`}
            >
                <FaEnvelope /> Email Link
            </button>
        </div>
    );
    if (isLinkProcessing) {
        return (
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="text-center p-8 bg-black/50 rounded-lg shadow-xl">
                    <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-white rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold">Verifying Email Link...</h2>
                    <p className="text-sm mt-2">Please wait, logging you in. This will redirect you shortly.</p>
                    {errorMsg && <p className="text-red-400 mt-4">{errorMsg}</p>}
                </div>
            </motion.div>
        );
    }
    if (emailSent && !isLoginModal) {
        return (
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="relative bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange rounded-2xl max-w-sm w-full p-6 text-center shadow-card text-neutral mx-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold mb-4 text-accent">Link Sent!</h2>
                    <p className="text-sm mb-3 text-neutral/90">
                        Please **check your email** inbox (and spam folder) to find the verification link.
                    </p>
                    <p className="text-sm mb-6 text-yellow-300 font-semibold">
                        Check your mail for the next step of the process.
                    </p>
                    <button
                        onClick={() => {
                            setEmailSent(false);
                            setIsLoginModal(true);
                            clearError();
                        }}
                        className="w-full bg-accent text-dark py-2 rounded-full font-semibold hover:brightness-110 transition mt-4"
                    >
                        Go Back to Login
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            {isLoginModal && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange rounded-2xl max-w-md w-full p-6 text-center shadow-card text-neutral mx-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-neutral hover:text-accent transition-colors"
                        >
                            <span style={{ fontSize: "22px", fontWeight: "bold" }}>X</span>
                        </button>

                        <h2 className="text-2xl font-bold mb-2 text-accent">Welcome Back!</h2>
                        <p className="text-sm mb-6 text-neutral/90">
                            Log in to steer your life and access personalized insights
                        </p>
                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-800 text-white rounded-lg text-sm">
                                {errorMsg}
                            </div>
                        )}
                        {emailSent && (
                            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-sm">
                                Verification Link sent to <strong>{storedEmail}</strong>. Please check your email!
                            </div>
                        )}
                        <div id="recaptcha-container" className={authTarget === 'phone' ? 'mb-4' : 'hidden'}></div>
                        <div className="space-y-3 mb-4">
                            <button
                                className="w-full flex items-center justify-center gap-2 bg-neutral text-dark py-2 rounded-full font-semibold shadow-card hover:bg-primary-light transition-colors"
                                onClick={() => handleSocialLogin('google')}
                            >
                                <FaGoogle className="text-lg" /> Google
                            </button>
                            <button disabled className="w-full flex items-center justify-center gap-2 bg-dark text-neutral py-2 rounded-full font-semibold shadow-card opacity-50 cursor-not-allowed">
                                <FaApple className="text-lg" /> Apple
                            </button>
                        </div>

                        <p className="text-xs text-neutral/80 mb-3">Or login with link/OTP</p>
                        <AuthTargetSwitch />
                        <div className="flex flex-col gap-4 mb-3">

                            {authTarget === 'phone' ? (
                                <div className="flex items-center bg-neutral text-dark rounded-full px-3 py-2">
                                    <select className="bg-transparent outline-none pr-2 text-dark">
                                        <option>+91</option>
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder="Enter Mobile number"
                                        className="flex-1 bg-transparent outline-none text-sm text-dark"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center bg-neutral text-dark rounded-full px-3 py-3">
                                    <input
                                        type="email"
                                        placeholder="Enter Email Address"
                                        className="flex-1 bg-transparent outline-none text-sm text-dark"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex items-center bg-neutral text-dark rounded-full px-3 py-3">
                                <select
                                    value={region}
                                    onChange={(e) => setRegionState(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm text-dark"
                                    required
                                >
                                    <option value="">Select Your Region *</option>
                                    <option value="IN">Inside India (INR ₹)</option>
                                    <option value="INT">Outside India (USD $)</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral/90">
                                <input
                                    type="checkbox"
                                    id="ageConfirm"
                                    checked={is18Confirmed}
                                    onChange={(e) => { setIs18Confirmed(e.target.checked); clearError(); }}
                                    className="w-4 h-4 accent-accent cursor-pointer"
                                />
                                <label htmlFor="ageConfirm">
                                    I confirm that I am <strong>18 years or older</strong>
                                </label>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral/90">
                                <input
                                    type="checkbox"
                                    id="tncConfirm"
                                    checked={isTncConfirmed}
                                    onChange={(e) => { setIsTncConfirmed(e.target.checked); clearError(); }}
                                    className="w-4 h-4 accent-accent cursor-pointer"
                                />
                                <label htmlFor="tncConfirm">
                                    I agree to the{" "}
                                    <Link to="/terms" className="underline text-yellow-400 hover:text-yellow-300">
                                        Terms & Conditions
                                    </Link>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                className="w-full bg-accent text-dark py-2 rounded-full font-semibold hover:brightness-110 transition"
                                onClick={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : (authTarget === 'phone' ? 'Send OTP' : 'Send Login Link')}
                            </button>
                            <button
                                className="w-full text-neutral underline font-semibold hover:text-accent transition"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                        </div>

                        <p className="text-xs mt-3 text-neutral-400">
                            By logging in, you agree to our{" "}
                            <Link to="/terms" className="underline text-yellow-400 hover:text-yellow-300 transition-colors">
                                Terms of Use
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="underline text-yellow-400 hover:text-yellow-300 transition-colors">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </motion.div>
                </motion.div>
            )}
            {isOtpModal && (
                <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-black to-primary">
                    <motion.div
                        className="relative bg-gradient-to-b from-black to-primary rounded-2xl max-w-md w-full p-6 text-center shadow-card text-neutral mx-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <button
                            onClick={handleOtpClose}
                            className="absolute top-3 right-3 text-neutral hover:text-accent transition-colors"
                        >
                            <span style={{ fontSize: "22px", fontWeight: "bold" }}>X</span>
                        </button>

                        <h3 className="uppercase text-sm font-semibold mb-2 text-accent">PLANETS & OUR THOUGHTS IMPACT OUR LIFE</h3>
                        <p className="font-bold mb-6 text-neutral">Know your DESTINY and change it with your EFFORTS <span className="text-accent">(KARMA)</span></p>

                        <div className="bg-primary-dark rounded-2xl p-5 space-y-4 text-neutral">
                            <h2 className="font-bold text-lg text-accent">OTP Verification</h2>

                            {errorMsg && (<div className="p-2 bg-red-700 text-white rounded-lg text-xs">{errorMsg}</div>)}

                            <p className="text-sm">A 6 digit code has been sent to **{verificationTarget}**</p>

                            <div className="flex justify-center gap-3 text-black">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpInputRef.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={otp[index] || ""}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, "");
                                            const newOtp = otp.split("");

                                            if (value) {
                                                newOtp[index] = value;
                                                setOtp(newOtp.join(""));
                                                if (index < 5) otpInputRef.current[index + 1].focus();
                                            } else {
                                                newOtp[index] = "";
                                                setOtp(newOtp.join(""));
                                            }
                                        }}

                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace") {
                                                const newOtp = otp.split("");
                                                newOtp[index] = "";
                                                setOtp(newOtp.join(""));

                                                if (index > 0) {
                                                    otpInputRef.current[index - 1].focus();
                                                }
                                            }
                                        }}

                                        className="w-10 h-12 text-center text-xl border border-neutral rounded-lg"
                                    />
                                ))}
                            </div>


                            <button
                                className="w-full bg-accent text-dark py-2 rounded-full font-semibold mt-3 hover:brightness-110 transition"
                                onClick={handleVerifyOtp}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            <button
                                className="w-full border border-accent py-2 rounded-full font-semibold mt-4 flex items-center justify-center gap-2 hover:bg-accent/20 transition"
                                onClick={() => {
                                    setIsOtpModal(false);
                                    setIsLoginModal(true);
                                    clearError();
                                }}
                            >
                                Change Authentication Method
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Login;