import * as Cesium from "cesium";
import * as satellite from "satellite.js";

export interface SatellitePosition {
    latitude: number;
    longitude: number;
    altitudeKm: number;
}

/**
 * Compute current lat/long/alt from TLE lines
 */
export function tleToLatLonAlt(line1: string, line2: string, date: Date): SatellitePosition | null {    
    const satrec = satellite.twoline2satrec(line1, line2);    
    const positionAndVelocity = satellite.propagate(satrec, date);

    if (!positionAndVelocity) {
    console.warn(`Propagation failed for provided satellite. Check TLE validity or epoch.`);
    return null;
  }
    const postitionEci = positionAndVelocity.position;

    if (!postitionEci) return { latitude: 0, longitude: 0, altitudeKm: 0 };

    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(postitionEci, gmst);

    return {
        latitude: satellite.degreesLat(positionGd.latitude),
        longitude: satellite.degreesLong(positionGd.longitude),
        altitudeKm: positionGd.height,
    }
}    

function getRandInt(min: number, max: number) {  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rgbaArrayToCesiumColor([r, g, b, a]: number[]) {
  return Cesium.Color.fromBytes(r, g, b, a);
}

export function getRandomRgba() {
  const highVisColors = [    
    [255, 0, 0, 255],
    [255, 165, 0, 255],
    [255, 255, 0, 255],
    [0, 255, 0, 255],
    [0, 255, 255, 255],
    [0, 0, 255, 255],
    [255, 0, 255, 255],
    [255, 105, 180, 255],
    [255, 69, 0, 255],
    [255, 20, 147, 255],
    [255, 182, 193, 255],
    [255, 140, 0, 255],
    [255, 215, 0, 255],
    [240, 128, 128, 255],
    [255, 99, 71, 255],
    [255, 215, 50, 255],
    [102, 255, 51, 255],
    [255, 248, 220, 255],
    [255, 250, 205, 255],
    [255, 255, 255, 255],
    [255, 140, 0, 255],
    [173, 216, 230, 255],
    [255, 105, 180, 255],
    [0, 128, 128, 255],
    [0, 0, 139, 255],
    [154, 205, 50, 255],
    [128, 0, 128, 255],
    [0, 128, 0, 255],
    [255, 69, 0, 255],
    [204, 255, 255, 255],
  ]
  return highVisColors[getRandInt(0, highVisColors.length - 1)];
}