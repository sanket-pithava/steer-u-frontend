export const formatPrice = (basePriceINR, region) => {
  if (region === 'IN') {
    return `₹${basePriceINR}`;
  } else {
    // internationalPriceINR = basePriceINR * 4
    const internationalPriceINR = basePriceINR * 4;
    // usdPrice = internationalPriceINR / 83
    const usdPrice = internationalPriceINR / 83;
    return `$${usdPrice.toFixed(2)}`;
  }
};