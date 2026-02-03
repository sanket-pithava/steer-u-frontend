import React, { useState } from "react";
import { FiGift } from "react-icons/fi";
import ReferralModal from "./ReferralModal";
const ReferralButton = ({ userReferralCode, userReferralLink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isDisabled = !userReferralCode;

  return (
      <>
      </>
  );
};

export default ReferralButton;