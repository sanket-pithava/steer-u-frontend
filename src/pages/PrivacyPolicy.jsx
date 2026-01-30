import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


const cardStyle =
  "bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822] " +
  "backdrop-blur-md border border-orange-400/20 text-white shadow-lg " +
  "rounded-2xl p-6 md:p-10 space-y-6";

const Privacy = () => {
  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-[#6b2400] via-[#f76822] to-[#f76822]">
        <section className="py-20 px-6 md:px-16">
          <div className={cardStyle}>
            <h1 className="text-3xl md:text-4xl font-fancy font-bold mb-4 text-orange-300 drop-shadow-md">
              Steer-U Privacy Policy
            </h1>

            <p className="text-gray-200">
              This Privacy Policy sets forth the manner in which Steer-U ("Company", "we", "our" or "us"), as a Data Fiduciary under the Digital Personal Data Protection Act, 2023 ("DPDPA"), collects, processes, stores, shares, transfers, and protects the personal data of natural persons ("Data Principals" or "you"). By using our website, mobile application, or any of our services (collectively, the "Platform"), you signify your consent to the terms of this Privacy Policy.
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">1. DEFINITIONS</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>“Digital Personal Data”: personal data in digital form or digitised from non-digital form.</li>
                  <li>“Data Fiduciary”: person determining purpose and means of processing.</li>
                  <li>“Data Processor”: person processing data on behalf of a Data Fiduciary.</li>
                  <li>“Data Principal”: natural person to whom the data relates; for children, includes parent/guardian.</li>
                  <li>“Significant Data Fiduciary (SDF)”: designated Data Fiduciary by Central Government.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">2. PERSONAL DATA CATEGORIZATION</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li><strong>Personal Identifiers:</strong> name, email, mobile, etc.</li>
                  <li><strong>Sensitive Personal Data:</strong> date/time/place of birth, astrological details, preferences, emotional/mental health info.</li>
                  <li><strong>Payment Information:</strong> billing info, UPI, etc. via secure gateways.</li>
                  <li><strong>Technical & Usage Data:</strong> device info, IP, browser, clickstream, cookies, etc.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">3. COOKIES AND TRACKING TECHNOLOGIES</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Used to improve functionality, performance, security, analytics, and user experience.</li>
                  <li>Data collected is used solely for operational, analytical, or marketing purposes.</li>
                  <li>Users can manage or disable cookies in browser settings.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">4. LAWFUL BASIS AND CONSENT</h2>
                <p className="text-gray-200">
                  Data processed based on consent or legitimate uses under DPDPA. Users may withdraw consent anytime by contacting the Grievance Officer.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">5. PURPOSE OF PROCESSING</h2>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  <li>Service delivery & personalization</li>
                  <li>Bookings & payment management</li>
                  <li>Customer support & grievance redressal</li>
                  <li>Platform improvement & development</li>
                  <li>Communication (service updates, notices)</li>
                  <li>Compliance & legal obligations</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">6. CHILDREN’S DATA</h2>
                <p className="text-gray-200">
                  No targeted marketing to children. Processing done only with consent and safeguards under law.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">7. SECURITY AND BREACH NOTIFICATION</h2>
                <p className="text-gray-200">
                  Reasonable measures to protect data. Breaches notified as per DPDPA.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">8. RETENTION AND DELETION</h2>
                <p className="text-gray-200">
                  Data retained only as necessary, deleted or anonymized after use or withdrawal of consent.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">9. GDPR COMPLIANCE (EU/UK USERS)</h2>
                <p className="text-gray-200">
                  EU/UK users’ data processed under GDPR; rights include data portability and objection to processing.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">10. GRIEVANCE REDRESSAL AND CONTACT DETAILS</h2>
                <p className="text-gray-200">
                  Grievance Officer: Rajeev Goyal, Director <br />
                  Email: contact@steer-u.com <br />
                  Address: C-241, Gaur Green Avenue, Indirapuram, Ghaziabad - 201014, India
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-orange-200 mb-2">11. POLICY UPDATES</h2>
                <p className="text-gray-200">
                  Policy may be revised; continued use constitutes acceptance of updates.
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

export default Privacy;
