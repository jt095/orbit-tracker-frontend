import { useEffect, useState } from "react";
import { fetchGpData } from "./api";
import type { GpData } from "./types/types";
import SatelliteGlobe from "./spacetrack/components/SatelliteGlobe";
import GpList from "./spacetrack/components/GpList";

export default function App() {
  const [gpData, setGpData] = useState<GpData[]>([]);  

  const [selectedTab, setSelectedTab] = useState<number>(0);  

  useEffect(() => {
    fetchGpData().then(setGpData).catch(console.error);
  }, []);

  return (    
    <div className="grid-container">
      {/* title */}
      <div className="title-row"> 
        🌍 Live Satellite Tracker
      </div>
      {/* tabs*/}
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>        
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      <div className="grid-item">
        <button onClick={() => setSelectedTab(0)}>Recent Launches</button>
      </div>
      {/* main content */}
      <div className="grid-item large-col-left">
        {selectedTab === 0 &&  <GpList gpData={gpData}/>}        
      </div>
      <div className="grid-item large-col-right">
        <SatelliteGlobe satellites={gpData} />
      </div>
    </div>    
  );
}