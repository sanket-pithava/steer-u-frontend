import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";

const LocationDropdown = ({ value, onChange }) => {
  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // 🟢 PREFILL when value comes from parent (edit/profile autofill)
  useEffect(() => {
    if (value) {
      const parts = value.split(",").map(v => v.trim()); // "Surat, Gujarat, India"
      if (parts.length === 3) {
        const [cityName, stateName, countryName] = parts;

        const country = countries.find(c => c.name === countryName);
        if (country) {
          setSelectedCountry(country.isoCode);

          const stateList = State.getStatesOfCountry(country.isoCode);
          setStates(stateList);

          const state = stateList.find(s => s.name === stateName);
          if (state) {
            setSelectedState(state.isoCode);

            const cityList = City.getCitiesOfState(country.isoCode, state.isoCode);
            setCities(cityList);

            const city = cityList.find(c => c.name === cityName);
            if (city) {
              setSelectedCity(city.name);
            }
          }
        }
      }
    }
  }, [value]);

  // 🟢 Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      setStates(stateList);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  // 🟢 Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityList = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(cityList);
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry]);

  // 🟢 Send full location to parent when all selected
  useEffect(() => {
    if (selectedCity && selectedState && selectedCountry) {
      const countryName = countries.find(c => c.isoCode === selectedCountry)?.name;
      const stateName = states.find(s => s.isoCode === selectedState)?.name;

      const fullLocation = `${selectedCity}, ${stateName}, ${countryName}`;
      onChange(fullLocation);
    }
  }, [selectedCity, selectedState, selectedCountry]);

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Country */}
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
        className="p-2 rounded bg-white/20 text-white"
        required
      >
        <option value="">Country</option>
        {countries.map(country => (
          <option key={country.isoCode} value={country.isoCode} className="text-black">
            {country.name}
          </option>
        ))}
      </select>

      {/* State */}
      <select
        value={selectedState}
        onChange={e => setSelectedState(e.target.value)}
        disabled={!states.length}
        className="p-2 rounded bg-white/20 text-white"
        required
      >
        <option value="">State</option>
        {states.map(state => (
          <option key={state.isoCode} value={state.isoCode} className="text-black">
            {state.name}
          </option>
        ))}
      </select>

      {/* City */}
      <select
        value={selectedCity}
        onChange={e => setSelectedCity(e.target.value)}
        disabled={!cities.length}
        className="p-2 rounded bg-white/20 text-white"
        required
      >
        <option value="">City</option>
        {cities.map(city => (
          <option key={city.name} value={city.name} className="text-black">
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationDropdown;
