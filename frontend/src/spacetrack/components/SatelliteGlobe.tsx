import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

interface Props {
    entities: Cesium.Entity[];
}

export default function SatelliteGlobe({ entities }: Props) {

    const cesiumContainer = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [viewerReady, setViewerReady] = useState(false);

    useEffect(() => {
        if (!viewerReady) return;
        const viewer = viewerRef.current;
        if (!viewer || entities.length === 0) return;

        // Clear previous entities
        viewer.entities.removeAll();

        // Add new entities
        entities.forEach((entity) => viewer.entities.add(entity));

        // Force Cesium to render
        viewer.scene.requestRender();
    }, [entities, viewerRef.current]);
    
    useEffect(() => {
        if (!cesiumContainer.current || viewerRef.current) return;

        const viewer = new Cesium.Viewer(cesiumContainer.current, {
            sceneMode: Cesium.SceneMode.SCENE3D,
            baseLayerPicker: false,
            sceneModePicker: false,
        });

        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        const darkImagery = new Cesium.UrlTemplateImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        });

        viewer.imageryLayers.removeAll(); // Remove default Bing layer
        viewer.imageryLayers.addImageryProvider(darkImagery);                
        if (viewer.scene.skyAtmosphere) {
            viewer.scene.skyAtmosphere.show = false;
        }
        
        viewer.scene.globe.showGroundAtmosphere = false;
        viewerRef.current = viewer;

        const start = Cesium.JulianDate.fromDate(new Date());
        const stop = Cesium.JulianDate.addDays(start, 1, new Cesium.JulianDate());

        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        viewer.clock.multiplier = 1; //16x speed
        viewer.timeline.zoomTo(start, stop);
        viewer.clock.shouldAnimate = true;

        setViewerReady(true); // signal that the viewer is ready

        return () => {
            if (viewerRef.current) {
                viewer.destroy();
                viewerRef.current = null;
            }            
        };
    }, []);

    return <div ref={cesiumContainer} className="cesium-container"/>;
}


