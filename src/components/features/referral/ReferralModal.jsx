import React, { useState } from "react";
import { X, Copy, Share2 } from "lucide-react";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon } from "react-share";
const ReferralModal = ({ isOpen, onClose, referralCode, referralLink, onShare }) => {
  if (!isOpen) return null;

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const handleShareClick = () => {
    if (onShare) {
      onShare();
    }
  };
  const isLinkValid = referralLink && referralLink.length > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition">
          <X size={24} />
        </button>
        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="text-orange-600" size={32} />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Unlock Free Question!</h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Share your referral code. Once you share, your question unlocks <span className="font-bold text-orange-600">instantly!</span>
        </p>
        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-3 mb-6">
          <span className="text-orange-800 font-bold text-lg tracking-widest pl-2">
            {referralCode || "LOADING..."}
          </span>
          <button
            onClick={handleCopy}
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold shadow-sm border border-orange-100 hover:bg-orange-50 transition flex items-center gap-2"
          >
            {isCopied ? "Copied!" : <><Copy size={16} /> Copy</>}
          </button>
        </div>
        <div className="flex justify-center gap-5 mb-8">
          <FacebookShareButton url={referralLink || ""} onClick={handleShareClick} disabled={!isLinkValid} className="hover:scale-110 transition">
            <FacebookIcon size={48} round />
          </FacebookShareButton>

          <WhatsappShareButton url={referralLink || ""} onClick={handleShareClick} disabled={!isLinkValid} className="hover:scale-110 transition">
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>

          <TwitterShareButton url={referralLink || ""} onClick={handleShareClick} disabled={!isLinkValid} className="hover:scale-110 transition">
            <TwitterIcon size={48} round />
          </TwitterShareButton>

          <LinkedinShareButton url={referralLink || ""} onClick={handleShareClick} disabled={!isLinkValid} className="hover:scale-110 transition">
            <LinkedinIcon size={48} round />
          </LinkedinShareButton>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReferralModal;