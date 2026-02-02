import React, { createContext, useContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [region, setRegion] = useState('IN'); // Default to IN
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    const savedRegion = localStorage.getItem('userRegion');
    if (savedRegion) {
      setRegion(savedRegion);
      setCurrency(savedRegion === 'IN' ? 'INR' : 'USD');
    }
  }, []);

  const updateRegion = (newRegion) => {
    setRegion(newRegion);
    setCurrency(newRegion === 'IN' ? 'INR' : 'USD');
    localStorage.setItem('userRegion', newRegion);
  };

  return (
    <CurrencyContext.Provider value={{ region, currency, setRegion: updateRegion }}>
      {children}
    </CurrencyContext.Provider>
  );
};