// src/components/common/LocationDropdown.jsx
import React, { useState, useEffect } from "react";
import locationData from "../../data/location.json";


const LocationDropdown = ({ value, onChange }) => {
  const countries = locationData.countries || [];

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // 🟢 Prefill for edit mode
  useEffect(() => {
    if (value) {
      const parts = value.split(",").map(v => v.trim()); // "City, State, Country"
      if (parts.length === 3) {
        const [cityName, stateName, countryName] = parts;

        const country = countries.find(c => c.name === countryName);
        if (country) {
          setSelectedCountry(country.name);

          const stateList = country.states || [];
          setStates(stateList);

          const state = stateList.find(s => s.name === stateName);
          if (state) {
            setSelectedState(state.name);

            const cityList = state.cities || [];
            setCities(cityList);

            const city = cityList.find(c => c.name === cityName);
            if (city) {
              setSelectedCity(city.name);
            }
          }
        }
      }
    }
  }, [value, countries]);

  // 🟢 Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      const stateList = country?.states || [];
      setStates(stateList);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry, countries]);

  // 🟢 Load cities when state changes
  useEffect(() => {
    if (selectedState && selectedCountry) {
      const country = countries.find(c => c.name === selectedCountry);
      const state = country?.states?.find(s => s.name === selectedState);
      const cityList = state?.cities || [];
      setCities(cityList);
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry, countries]);

  // 🟢 Send full location to parent when all selected
  useEffect(() => {
    if (selectedCity && selectedState && selectedCountry) {
      const fullLocation = `${selectedCity}, ${selectedState}, ${selectedCountry}`;
      onChange(fullLocation);
    }
  }, [selectedCity, selectedState, selectedCountry, onChange]);

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Country */}
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
        className="p-2 rounded bg-white/20 text-black"
        required
      >
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country.name} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

      {/* State */}
      <select
        value={selectedState}
        onChange={e => setSelectedState(e.target.value)}
        disabled={!states.length}
        className="p-2 rounded bg-white/20 text-black"
        required
      >
        <option value="">Select State</option>
        {states.map(state => (
          <option key={state.name} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>

      {/* City */}
      <select
        value={selectedCity}
        onChange={e => setSelectedCity(e.target.value)}
        disabled={!cities.length}
        className="p-2 rounded bg-white/20 text-black"
        required
      >
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationDropdown;
