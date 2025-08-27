import { CountryCode } from "../../types/types";
import { useState } from "react";

type CountryDropdownProps = {
  onSelect: (code: keyof typeof CountryCode) => void;
};

export default function CountryDropdown({ onSelect }: CountryDropdownProps) {
  const [selected, setSelected] = useState<keyof typeof CountryCode | "">("");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value as keyof typeof CountryCode;
    setSelected(code);
    onSelect(code); // <-- notify parent
  }

  return (
    <select value={selected} onChange={handleChange}>
      <option value="">Country</option>
      {Object.entries(CountryCode).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
