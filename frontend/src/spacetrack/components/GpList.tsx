import type { GpData } from "../../types/types";
import { useState } from "react";

interface Props {
    gpData: GpData[];
}

export default function GpList({ gpData }: Props) {    

    return (
        <div className="scrollable-table-container">
            <table className="scrollable-table">
                <thead>
                    <tr>
                        <th className="scrollable-th">LAUNCHED</th>
                        <th className="scrollable-th">OBJECT</th>
                        <th className="scrollable-th">COUNTRY</th>
                    </tr>
                </thead>
                <tbody>
                    {gpData.map((sat, i) => (
                        <tr key={i}>
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