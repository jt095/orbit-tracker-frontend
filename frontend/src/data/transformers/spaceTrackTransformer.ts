import * as Cesium from "cesium";
import type { GpData } from "../../types/types";
import { tleToLatLonAlt, getRandomRgba, rgbaArrayToCesiumColor } from "../../utils/satelliteUtils";

export function createSpaceTrackCesiumEntity(sat: GpData): Cesium.Entity {
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
        name: sat.OBJECT_NAME,
        id: sat.OBJECT_ID,
        position: positions,
        billboard: {
            image: "/satellite.png",
            scale: 0.025,
            scaleByDistance: new Cesium.NearFarScalar(
                1.5e2, 2.0, 8.0e7, 0.0
            ),
        },
        label: {
            text: sat.OBJECT_NAME,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            pixelOffset: new Cesium.Cartesian2(-20, 0),
            font: "10pt sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            fillColor: rgbaArrayToCesiumColor(randColor),

            // scale based on camera distance
            scale: 1.0,
            scaleByDistance: new Cesium.NearFarScalar(
                1.5e2, 2.0, 8.0e7, 0.0
            ),
        },
        path: {
            resolution: 120, // number of samples per segment
            material: rgbaArrayToCesiumColor(randColor),
            width: 2,
            leadTime: 0,
            trailTime: 3600,
        },
    });
    return entity;
}

