import { CountryCode } from "../../types/types";
import { useState } from "react";

type CountryDropdownProps = {
  selected?: keyof typeof CountryCode;
  onSelect: (code: keyof typeof CountryCode) => void;
};

export default function CountryDropdown({ selected, onSelect }: CountryDropdownProps) {  

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value as keyof typeof CountryCode;    
    onSelect(code); // <-- notify parent
  }

  return (
    <select className="th-select" value={selected} onChange={handleChange}>
      <option value="">Country</option>
      {Object.entries(CountryCode).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
