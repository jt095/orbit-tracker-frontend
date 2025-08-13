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