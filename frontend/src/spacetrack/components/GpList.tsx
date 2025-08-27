import type { GpData, CountryCode } from "../../types/types";
import { useState } from "react";
import CountryDropdown from "./CountryCodeDropdown";
import DaysDropdown from "./DaysDropdown";

interface Props {
    gpData?: GpData[];
    selectedGpData: GpData[];
    handleSelectedGpData: (item: GpData) => void;
    selectedCountry?: keyof typeof CountryCode;
    handleCountryChange: (country: CountryCode) => void;
    selectedDays: number;
    handleDaysChange: (days: number) => void;
    handleResetGpList: () => void;
}

const checkIsSelected = (sat: GpData, selectedData: GpData[]): boolean => {
    const index = selectedData.findIndex(
      (item) => item.OBJECT_ID === sat.OBJECT_ID
    );

    if (index !== -1) {
      return true;
    } else {
      return false;
    }
}

export default function GpList({
    gpData,
    selectedGpData,
    handleSelectedGpData,
    selectedCountry,
    handleCountryChange,
    selectedDays,
    handleDaysChange,
    handleResetGpList
}: Props) {    

    return (
        <div className="scrollable-table-container">                        
            <table className="scrollable-table">
                <thead>
                    <tr>                        
                        <th className="scrollable-th">
                            <DaysDropdown selected={selectedDays} onSelect={(days) => handleDaysChange(days)} />
                        </th>
                        <th className="scrollable-th">OBJECT</th>
                        <th className="scrollable-th">
                            <CountryDropdown selected={selectedCountry} onSelect={(code) => handleCountryChange(code)} />
                            <button onClick={handleResetGpList} title="Reset All">⟲</button>
                        </th>                        
                        
                    </tr>
                </thead>
                <tbody>
                    {gpData?.map((sat, i) => (
                        <tr className={checkIsSelected(sat, selectedGpData) ? "selected-tr": ""} 
                            key={i} onClick={() => handleSelectedGpData(sat)}>
                            <td className="scrollable-td">{sat.LAUNCH_DATE}</td>
                            <td className="scrollable-td" title={sat.OBJECT_NAME}>
                                {sat.OBJECT_NAME}                      
                            </td>
                            <td className="scrollable-td">{sat.COUNTRY_CODE}</td>
                        </tr>
                    ))}                
                </tbody>
            </table>        
        </div>
    );
}