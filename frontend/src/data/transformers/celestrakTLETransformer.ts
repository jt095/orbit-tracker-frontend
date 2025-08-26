import * as Cesium from "cesium";
import type { TLEData } from "../../types/types";
import { tleToLatLonAlt, getRandomRgba, rgbaArrayToCesiumColor } from "../../utils/satelliteUtils";

export function createStarlinkCesiumEntities(
    gpList: TLEData[],
    sampleSeconds = 1440,    // your current spacing (24 min)
    derivativeDelta = 480     // used to compute velocity (seconds)
): Cesium.Entity[] {
    const entities: Cesium.Entity[] = [];

    gpList.forEach((sat) => {
        // Request 1 derivative (velocity)
        const positions = new Cesium.SampledPositionProperty(
            Cesium.ReferenceFrame.FIXED,
            1
        );

        for (let seconds = 0; seconds <= 86400; seconds += sampleSeconds) {
            const start = Cesium.JulianDate.fromDate(new Date());
            const date = new Date(Cesium.JulianDate.toDate(start).getTime() + seconds * 1000);
            const jd = Cesium.JulianDate.fromDate(date);

            const pos = tleToLatLonAlt(sat.TLE_LINE1, sat.TLE_LINE2, date);
            if (!pos) continue;
            const cart = Cesium.Cartesian3.fromDegrees(
                pos.longitude,
                pos.latitude,
                pos.altitudeKm * 1000
            );

            // compute velocity via central difference
            const prevDate = new Date(date.getTime() - derivativeDelta * 1000);
            const nextDate = new Date(date.getTime() + derivativeDelta * 1000);

            const prevPos = tleToLatLonAlt(sat.TLE_LINE1, sat.TLE_LINE2, prevDate);
            const nextPos = tleToLatLonAlt(sat.TLE_LINE1, sat.TLE_LINE2, nextDate);

            let derivatives: Cesium.Cartesian3[] | undefined;
            if (prevPos && nextPos) {
                const cartPrev = Cesium.Cartesian3.fromDegrees(
                    prevPos.longitude,
                    prevPos.latitude,
                    prevPos.altitudeKm * 1000
                );
                const cartNext = Cesium.Cartesian3.fromDegrees(
                    nextPos.longitude,
                    nextPos.latitude,
                    nextPos.altitudeKm * 1000
                );

                // vel = (next - prev) / (2 * deltaSeconds)
                const vel = Cesium.Cartesian3.subtract(cartNext, cartPrev, new Cesium.Cartesian3());
                Cesium.Cartesian3.divideByScalar(vel, 2 * derivativeDelta, vel);

                derivatives = [vel];
            }

            // add sample with derivatives if available
            positions.addSample(jd, cart, derivatives);
        }

        // Use Hermite so the derivatives are used for interpolation
        positions.setInterpolationOptions({
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
            interpolationDegree: 2, // try 2 or 3 – higher degrees need more data points
        });

        const entity = new Cesium.Entity({
            name: sat.TLE_LINE0,
            position: positions,
            point: { pixelSize: 4, color: Cesium.Color.RED },
        });

        entities.push(entity);
    });

    return entities;
}

