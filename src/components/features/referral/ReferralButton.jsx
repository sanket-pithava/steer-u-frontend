// import React, { useState } from "react";
// import { FiGift } from "react-icons/fi";
// import ReferralModal from "./ReferralModal";
// const ReferralButton = ({ userReferralCode, userReferralLink }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [hovered, setHovered] = useState(false);
//   const isDisabled = !userReferralCode;

//   return (
//     <div className="flex justify-center mt-6">
//       <div className="bg-white shadow-xl rounded-2xl p-6 max-w-lg text-center border border-[#f76822]">
//         <h2 className="text-2xl font-bold text-orange-700 mb-2">
//           Invite Your Friends
//         </h2>
//         <p className="text-orange-800 mb-4">
//           Share your referral link and earn exciting rewards when your friends join!
//         </p>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           onMouseEnter={() => setHovered(true)}
//           onMouseLeave={() => setHovered(false)}
//           disabled={isDisabled}
//           className={`flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold transition transform hover:scale-105 mx-auto shadow-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'animate-pulse hover:bg-orange-700'}`}
//         >
//           <FiGift className="text-xl" />
//           <span>{isDisabled ? 'Loading Code...' : 'Refer & Earn'}</span>
//         </button>
//         {hovered && !isDisabled && (
//           <span className="mt-2 text-sm text-orange-700 block">
//             Invite friends & get rewards!
//           </span>
//         )}
//       </div>
//       <ReferralModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         referralCode={userReferralCode}
//         referralLink={userReferralLink}
//       />
//     </div>
//   );
// };

// export default ReferralButton;