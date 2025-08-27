import { useState } from "react";

type DaysDropdownProps = {
    selected: number;
    onSelect: (days: number) => void;
};

export default function DaysDropdown({ selected, onSelect }: DaysDropdownProps) {    

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const days = parseInt(e.target.value);        
        onSelect(days);
    }

    return (
        <select value={selected} onChange={handleChange}>            
            <option value={7}>Launched Within 7 Days</option>
            <option value={14}>Launched Within 14 Days</option>
            <option value={30}>Launched Within 30 Days</option>
            <option value={60}>Launched Within 60 Days</option>
        </select>
    )
}