import { useState } from "react";

type DaysDropdownProps = {
    onSelect: (days: number) => void;
};

export default function DaysDropdown({ onSelect }: DaysDropdownProps) {
    const [selected, setSelected] = useState<number>();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const days = parseInt(e.target.value);
        setSelected(days);
        onSelect(days);
    }

    return (
        <select value={selected} onChange={handleChange}>
            <option value="">Launched Within _ Days</option>
            <option value={7}>Launched Within 7 Days</option>
            <option value={14}>Launched Within 14 Days</option>
            <option value={30}>Launched Within 30 Days</option>
            <option value={60}>Launched Within 60 Days</option>
        </select>
    )
}