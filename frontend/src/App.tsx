import { useEffect, useState } from "react";
import { fetchGpData } from "./api";
import type { GpData } from "./types/types";
import SatelliteGlobe from "./spacetrack/components/SatelliteGlobe";

export default function App() {
  const [gpData, setGpData] = useState<GpData[]>([]);
  // const [cesiumSats, setCesiumSats] = useState(
  //   [] as { name: string; latitude: number; longitude: number; altitudeKm: number }[]
  // );

  useEffect(() => {
    fetchGpData().then(setGpData).catch(console.error);
  }, []);

  // useEffect(() => {
  //   const updatePositions = () => {
  //     const positions = gpData
  //       .map((sat) => {
  //         const pos = tleToLatLonAlt(sat.TLE_LINE1, sat.TLE_LINE2);
  //         if (!pos) return null;
  //         return {
  //           name: sat.OBJECT_NAME,
  //           latitude: pos.latitude,
  //           longitude: pos.longitude,
  //           altitudeKm: pos.altitudeKm,
  //         };
  //       })
  //       .filter((sat): sat is { name: string; latitude: number; longitude: number; altitudeKm: number } => sat !== null);

  //     setCesiumSats(positions);
  //   };

  //   // Run once immediately
  //   updatePositions();

  //   // Then run every minute
  //   const interval = setInterval(updatePositions, 1000 * 60);

  //   return () => clearInterval(interval);
  // }, [gpData]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Live Satellite Tracker</h1>
      <SatelliteGlobe satellites={gpData} />
    </div>
  );
}