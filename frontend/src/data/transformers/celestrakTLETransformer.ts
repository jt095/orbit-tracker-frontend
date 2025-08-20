import * as Cesium from "cesium";
import type { TLEData } from "../../types/types";
import { tleToLatLonAlt, getRandomRgba, rgbaArrayToCesiumColor } from "../../utils/satelliteUtils";

export function createStarlinkCesiumEntities(gpList: TLEData[]): Cesium.Entity[] {
    const entities: Cesium.Entity[] = [];

    gpList.forEach((sat) => {
        const positions = new Cesium.SampledPositionProperty();

        // compute positions every 5 minutes for the day
        for (let seconds = 0; seconds <= 86400; seconds += 30) {
            const date = new Date();
            date.setSeconds(date.getSeconds() + seconds);

            const pos = tleToLatLonAlt(sat.TLE_LINE1, sat.TLE_LINE2, date);
            if (!pos) continue;

            const cartesian = Cesium.Cartesian3.fromDegrees(pos.longitude, pos.latitude, pos.altitudeKm * 1000);
            positions.addSample(Cesium.JulianDate.fromDate(date), cartesian);
        }

        const randColor = getRandomRgba();

        const entity = new Cesium.Entity({
            name: sat.TLE_LINE0,
            position: positions,                        
            point: {
                color: Cesium.Color.RED
            }
        });

        entities.push(entity);
    });

    return entities;
}

