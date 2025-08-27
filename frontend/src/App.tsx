import { useEffect, useState, useMemo } from "react";
import * as Cesium from "cesium";
import { fetchGpData, fetchStarlinkTLEData } from "./api";
import { CountryCode, type GpData, type TLEData } from "./types/types";
import SatelliteGlobe from "./spacetrack/components/SatelliteGlobe";
import GpList from "./spacetrack/components/GpList";
import { createSpaceTrackCesiumEntity } from "./data/transformers/spaceTrackTransformer";
import { createStarlinkCesiumEntities } from "./data/transformers/celestrakTLETransformer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [gpData, setGpData] = useState<GpData[]>([]);  
  const [selectedGpData, setSelectedGpData] = useState<GpData[]>([]);
  const [selectedGpEntities, setSelectedGpEntities] = useState<Cesium.Entity[]>([]);
  const [starlinkData, setStarlinkData] = useState<TLEData[]>([]);

  // GpList
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedDays, setSelectedDays] = useState<number>(14);
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof CountryCode | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    fetchGpData(selectedDays, selectedCountry)
      .then(setGpData)
      .catch(console.error)      
      .finally(() => setIsLoading(false));
  }, [selectedDays, selectedCountry]);

  useEffect(() => {
    setIsLoading(true);
    fetchStarlinkTLEData()
      .then(setStarlinkData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
    
  }, []);

  const starlinkEntities = useMemo(() => {
    return createStarlinkCesiumEntities(starlinkData);
  }, [starlinkData]);

  const handleSelectGpData = (selectedItem: GpData): void => {
    const index = selectedGpData.findIndex(
      (item) => item.OBJECT_ID === selectedItem.OBJECT_ID
    );

    const entity = createSpaceTrackCesiumEntity(selectedItem);         

    if (index !== -1) {      
      setSelectedGpData(prev => prev.filter((_, i) => i !== index));              
    } else {
      setSelectedGpData(prev => [...prev, selectedItem]);
    }
    addSpaceTrackCesiumEntity(entity);           
  }

  const handleCountryChange = (country: CountryCode): void => {
    setSelectedCountry(country);
  }

  const handleDaysChange = (days: number): void => {
    setSelectedDays(days);
  }

  const handleResetGpList = (): void => {
    setSelectedGpData([]);
    setSelectedGpEntities([]);
    setSelectedCountry(undefined);
    setSelectedDays(14);
  }

  const addSpaceTrackCesiumEntity = (newEntity: Cesium.Entity): void => {
    const index = selectedGpEntities.findIndex(
      (item) => item.id === newEntity.id
    );

    if (index !== -1) {
      // create cesium entity and add it
      setSelectedGpEntities(prev => prev.filter((_, i) => i !== index));                  
    } else {
      setSelectedGpEntities(prev => [...prev, newEntity]);
    }
  }  

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
        <button onClick={() => setSelectedTab(1)}>Starlink</button>
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
        {isLoading && <p>LOADING...</p>}
        {selectedTab === 0 && !isLoading &&
          <GpList 
            gpData={gpData}
            selectedGpData={selectedGpData}
            handleSelectedGpData={handleSelectGpData}
            selectedCountry={selectedCountry}
            handleCountryChange={handleCountryChange}
            selectedDays={selectedDays}
            handleDaysChange={handleDaysChange}
            handleResetGpList={handleResetGpList}/>}        
      </div>
      <div className="grid-item large-col-right">
        {isLoading && <p>LOADING...</p>}
        {selectedTab === 0 && !isLoading && <SatelliteGlobe entities={selectedGpEntities}/>}                
        {selectedTab === 1 && !isLoading && <SatelliteGlobe entities={starlinkEntities}/>}           
      </div>
    </div>    
  );
}