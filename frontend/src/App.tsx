import { useEffect, useState } from "react";
import { fetchGpData } from "./api";
import type { GpData } from "./types/types";
import SatelliteGlobe from "./spacetrack/components/SatelliteGlobe";
import GpList from "./spacetrack/components/GpList";

export default function App() {
  const [gpData, setGpData] = useState<GpData[]>([]);  

  useEffect(() => {
    fetchGpData().then(setGpData).catch(console.error);
  }, []);

  return (    
    <div style={{ display: "flex", flexDirection: "row", maxHeight: "75vh"}}>
      <GpList gpData={gpData}/>
      <SatelliteGlobe satellites={gpData} />
    </div>    
  );
}