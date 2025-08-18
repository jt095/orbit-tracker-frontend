import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { tleToLatLonAlt } from "../../utils/satelliteUtils";
import type { GpData } from "../../types/types";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

interface Props {
    satellites: GpData[];
}

export default function SatelliteGlobe({ satellites }: Props) {
    const cesiumContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cesiumContainer.current) return;

        const viewer = new Cesium.Viewer(cesiumContainer.current, {
            sceneMode: Cesium.SceneMode.SCENE3D,      
            baseLayerPicker: false,
            sceneModePicker: false,
        });

        // Simulation start/end
        const start = Cesium.JulianDate.fromDate(new Date());
        const stop = Cesium.JulianDate.addDays(start, 1, new Cesium.JulianDate());

        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // loop at end
        viewer.clock.multiplier = 1; // sim speed: 1x real time
        viewer.timeline.zoomTo(start, stop);

        // Add satellites as points
        satellites.forEach((sat) => {
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
                      
            viewer.entities.add({
                name: sat.OBJECT_NAME,                
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
        });

        return () => {
            viewer.destroy();
        };
    }, [satellites]);

    return <div ref={cesiumContainer} className="cesium-container"/>;
}

function getRandInt(min: number, max: number) {  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgbaArrayToCesiumColor([r, g, b, a]: number[]) {
  return Cesium.Color.fromBytes(r, g, b, a);
}

function getRandomRgba() {
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
