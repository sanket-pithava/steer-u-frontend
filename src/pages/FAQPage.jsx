import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const cardStyle =
  "bg-gradient-to-b mt-8 from-brand-dark via-brand-orange to-brand-orange " +
  "backdrop-blur-md border border-orange-400/30 text-white shadow-lg " +
  "rounded-2xl p-6 md:p-10 space-y-6";

const faqs = [
  {
    q: "1. What exactly does Steer-U provide?",
    a: `Steer-U is an online web and mobile app platform offering two major services:
    1. Instant Future Prediction — where users get instant answers to life questions based on their birth details and gender, without revealing deeper identity.
    2. Psychological Counselling / Psychotherapy (including Hypnotherapy and Special Needs therapy) through secure, confidential online sessions.
    Services are available in free and paid formats, helping users manage life challenges, emotional struggles, and relationships.`,
  },
  {
    q: "2. How much does online Future Prediction or Psychological Counselling cost?",
    a: `Steer-U lists prices clearly on its official website/app. Typically:
    • Two free questions for Future Prediction, then paid questions in various categories.
    • Paid packages or per-session fees for therapy, based on therapist experience.
    You can check the "Pricing" or "Packages" section on the platform for the latest rates.`,
  },
  {
    q: "3. Can overseas clients use Steer-U services?",
    a: `Yes. Steer-U is an online platform accessible globally. However, international clients should confirm:
    • Therapist licensing applicability in their country.
    • Currency and payment options.
    • Time-zone compatibility for bookings.`,
  },
  {
    q: "4. Can I choose any one service?",
    a: `Yes. You can choose either:
    • The Instant Future Prediction service, or
    • The Psychological Counselling / Psychotherapy service — or both, as per your need.`,
  },
  {
    q: "5. What are free service options on Steer-U?",
    a: `• Two free questions in the Future Prediction section.
    • Free therapy tips for 20+ mental health challenges where your family can support you.
    Check “Free Services” or “Promotions” for current offers.`,
  },
  {
    q: "6. In how many languages is counselling offered?",
    a: `Usually available in English and Hindi. Additional Indian languages will be added soon. Check the “Languages” or “FAQ” section in the app.`,
  },
  {
    q: "7. Why is Steer-U the right choice for wellbeing?",
    a: `Because Steer-U blends both psychological therapy and astrology-based insights. 
    • No talking to unknown astrologers — results are instant and confidential.
    • Therapy is done by RCI-registered professionals.
    • Affordable, accessible, and non-judgemental.
    • Covers a wide range of personal, emotional, and relational issues.`,
  },
  {
    q: "8. How can I start?",
    a: `1. Visit the Steer-U website/app.
    2. Create an account.
    3. Choose your service (Future Prediction or Counselling).
    4. Book and pay for your session (if applicable).
    5. Attend therapy or get instant prediction results.`,
  },
  {
    q: "9. What are the qualifications of Steer-U therapists?",
    a: `All therapists hold Master’s/PhD in Psychology or Special Needs and are RCI-registered. 
    Interns may provide low-cost services under supervision.`,
  },
  {
    q: "10. Can I talk directly to an astrologer?",
    a: `No. Steer-U does not connect clients with astrologers. All future predictions are automated using Vedic astrology algorithms.`,
  },
  {
    q: "11. Does Steer-U provide full horoscopes?",
    a: `No. It provides instant answers to specific questions based on Vedic astrology but not full detailed horoscopes.`,
  },
  {
    q: "12. How accurate are the predictions?",
    a: `Predictions show trends and possibilities, not guarantees. Accuracy depends on correct data and interpretation. Use them as guidance.`,
  },
  {
    q: "13. Are there packages available?",
    a: `Yes. Bundled packages are offered:
    • Multi-session therapy bundles at discounted rates.
    • Custom question packages for future prediction.`,
  },
  {
    q: "14. Can Hypnotherapy be done online?",
    a: `Yes. Online hypnotherapy via video sessions is effective if you have stable internet, privacy, and follow therapist guidance.`,
  },
  {
    q: "15. Can I change my therapist?",
    a: `Yes. You can request to change your therapist anytime if you feel uncomfortable or mismatched.`,
  },
  {
    q: "16. How are psychological assessments conducted?",
    a: `Through intake forms, standardized scales (for anxiety, depression, etc.), and special needs assessments for 20+ areas.`,
  },
  {
    q: "17. What to keep in mind during online therapy?",
    a: `• Ensure stable internet, privacy, and punctuality.
    • Avoid distractions and maintain respectful communication.
    • Keep sessions professional; no personal exchanges with therapists.
    • Understand therapy is a process requiring patience and consistency.`,
  },
  {
    q: "18. Can I ask for a refund?",
    a: `Refunds are not allowed except for counselling appointments canceled on the same day of payment. Refer to the “Refund Policy”.`,
  },
  {
    q: "19. When is the intake form for Psychological Counselling provided?",
    a: `The intake form is shared with customers after completing payment for their counselling session appointment.`,
  },
];

const FAQPage = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-brand-dark via-brand-orange to-brand-orange min-h-screen">
        <section className="py-20 px-6 md:px-14">
          <div className={cardStyle}>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white drop-shadow-md">
              Frequently Asked Questions (FAQ)
            </h1>

            <div className="space-y-8">
              {faqs.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-orange-200/40 pb-4"
                >
                  <h2 className="text-lg md:text-xl font-semibold mb-2 text-white">
                    {item.q}
                  </h2>
                  <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default FAQPage;

