import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const cardStyle =
  "bg-gradient-to-b mt-12 from-[#6b2400] via-[#f76822] to-[#f76822] " +
  "backdrop-blur-md border border-orange-400/20 text-white shadow-lg " +
  "rounded-2xl p-6 md:p-10 space-y-6";

const Terms = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822]">
        <section className="py-20 px-6 md:px-16">
          <div className={cardStyle}>
            <h1 className="text-3xl md:text-4xl font-fancy font-bold mb-4 text-orange-300 drop-shadow-md">
              Steer-U Terms of Use
            </h1>
            <p className="text-gray-200">
              Welcome to Steer-U (“Company,” “we,” “our,” or “us”). These Terms of
              Use (“Terms”) govern your access to and use of our website, mobile
              application, and all services offered by us, including astrological
              consulting, counseling sessions, and related offerings (collectively,
              the “Platform” or “Services”).
            </p>
            <p className="text-gray-200">
              By accessing, browsing, or using the Platform, you acknowledge that
              you have read, understood, and agreed to be bound by these Terms.
            </p>
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">
                  1. ACCEPTANCE OF TERMS
                </h2>
                <p className="text-gray-200">
                  By using the Platform, you agree to comply with these Terms and
                  all applicable laws and regulations. If you do not agree with
                  these Terms, you must discontinue use immediately. These Terms
                  constitute a legally binding agreement between you and Steer-U.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">
                  2. ELIGIBILITY
                </h2>
                <p className="text-gray-200">
                  You must be at least 18 years of age and capable of forming a
                  legally binding contract to use our Services. By using our
                  Platform, you represent and warrant that you meet these
                  requirements.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">3. SERVICES OFFERED</h2>
                <p className="text-gray-200">
                  Steer-U provides instant future prediction (based on your birth details through ancient Vedic Astrology)
                  and online psychological counselling services.
                </p>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li><strong>Astrological Consulting:</strong> Horoscope readings, birth chart analysis, compatibility
                    readings, remedies, and spiritual guidance.</li>
                  <li><strong>Psychological Counseling Services:</strong> Emotional and mental well-being counseling
                    (non-emergency support).</li>
                </ul>
                <p className="text-gray-200 mt-2">
                  Our Services are intended solely for informational, educational, and self-improvement purposes and should
                  not be considered a substitute for professional medical, legal, or financial advice.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">4. ACCOUNT CREATION & RESPONSIBILITIES</h2>
                <p className="text-gray-200">
                  To use certain features, you may be required to create an account by providing accurate and complete
                  information, including your name, email, and other details. You are solely responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities under your account</li>
                  <li>Immediately notifying us of unauthorized use</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">5. USER CONDUCT & ACCEPTABLE USE</h2>
                <p className="text-gray-200">You agree not to engage in any prohibited activities including:</p>
                <ul className="list-disc list-inside text-gray-200 space-y-1 mt-2">
                  <li>Unlawful Activities</li>
                  <li>Interference & Disruption</li>
                  <li>Unauthorized Access</li>
                  <li>Data Harvesting & Scraping</li>
                  <li>Misrepresentation & Impersonation</li>
                  <li>Intellectual Property Infringement</li>
                  <li>Commercial Exploitation</li>
                  <li>Harassment & Abuse</li>
                  <li>Violation of Rights</li>
                  <li>Illegal or Prohibited Transactions</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">6. BOOKING, PAYMENT & CANCELLATION</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Bookings must be scheduled exclusively through the Platform.</li>
                  <li>Payments through integrated secure gateways.</li>
                  <li>Cancellation/rescheduling at least 24h prior; no refunds policy.</li>
                  <li>Refunds (if applicable) follow Steer-U’s internal policy.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">7. THIRD-PARTY CONTENT & LINKS</h2>
                <p className="text-gray-200">
                  We are not responsible for third-party content, privacy policies, or interactions.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">8. INTELLECTUAL PROPERTY RIGHTS</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Ownership of content remains with Steer-U or licensors.</li>
                  <li>Limited License to use for personal purposes only.</li>
                  <li>Restrictions on copying, reverse-engineering, or misuse.</li>
                  <li>User Content grants Steer-U limited license to operate and improve services.</li>
                  <li>Third-party IP subject to their terms.</li>
                  <li>Reservation of all rights not expressly granted.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">9. DISCLAIMERS</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Astrological info is for guidance only, not professional advice.</li>
                  <li>Counseling services provide general guidance, not substitute for licensed professionals.</li>
                  <li>No guarantees on accuracy, completeness, or outcomes.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">10. LIMITATION OF LIABILITY</h2>
                <p className="text-gray-200">
                  Steer-U is not liable for any direct, indirect, or consequential damages. Aggregate liability limited to
                  INR 1,000.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">11. INDEMNIFICATION</h2>
                <p className="text-gray-200">
                  You agree to indemnify and hold Steer-U harmless from claims, losses, or expenses arising from your use or
                  violation of these Terms.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">12. TERMINATION AND RESTRICTED ACCESS</h2>
                <p className="text-gray-200">
                  Steer-U may suspend or terminate access for breach, misuse, or any reason to protect Platform or users.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">13. ASSIGNMENT</h2>
                <p className="text-gray-200">
                  Steer-U may assign rights or obligations without your consent; you may not assign without prior written
                  consent.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">14. SEVERABILITY</h2>
                <p className="text-gray-200">
                  If any provision is unenforceable, remaining provisions remain in effect.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">15. GOVERNING LAW & DISPUTE RESOLUTION</h2>
                <p className="text-gray-200">
                  Governed by Indian laws. Arbitration under Arbitration and Conciliation Act, 1996, in New Delhi.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">16. VARIATION</h2>
                <p className="text-gray-200">
                  Terms may be revised. Continued use implies acceptance of updated Terms.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">
                  17. CONTACT INFORMATION
                </h2>
                <p className="text-gray-200">
                  For questions or concerns regarding these Terms, please contact us
                  at:
                </p>
                <p className="text-gray-200 mt-2">
                  <strong>Email:</strong> contact@steer-u.com
                  <br />
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Terms;
