import { Zone } from "@/types/incidentEmergency";
import atlas from "azure-maps-control";
import { useEffect } from "react";

type Props = {
    mapInstance: React.MutableRefObject<atlas.Map | null>;
    mapReady: boolean;
    zones?: Zone[];
};

export const useZones = ({ mapInstance, mapReady, zones }: Props) => {
    useEffect(() => {
        if (!mapReady || !mapInstance.current || !zones?.length) return;

        const map = mapInstance.current;

        const datasource = new atlas.source.DataSource("zones-source");
        map.sources.add(datasource);

        zones.forEach(zone => {
            const polygon: [number, number][] = zone.coordinates.map(c => [c.lng, c.lat]);

            const shape = new atlas.Shape(new atlas.data.Polygon([polygon]), zone._id);

            datasource.add(shape);

            const bounds = atlas.data.BoundingBox.fromPositions(polygon);
            const center = atlas.data.BoundingBox.getCenter(bounds);

            map.setCamera({
                center,
                zoom: 12,
                duration: 1500,
                type: "fly"
            });
        });

        const polygonLayer = new atlas.layer.PolygonLayer(datasource, "zones-fill", { fillColor: "rgba(0,150,255,0.2)" });

        const borderLayer = new atlas.layer.LineLayer(datasource, "zones-border", {
            strokeColor: "#0096ff",
            strokeWidth: 2
        });

        map.layers.add([polygonLayer, borderLayer]);

        // 👇 AQUÍ ES DONDE VA EL FIX
        return () => {
            if (!mapInstance.current) return;

            const map = mapInstance.current;

            const fillLayer = map.layers.getLayerById("zones-fill");
            const borderLayer = map.layers.getLayerById("zones-border");
            const source = map.sources.getById("zones-source");

            if (fillLayer) {
                map.layers.remove(fillLayer);
            }

            if (borderLayer) {
                map.layers.remove(borderLayer);
            }

            if (source) {
                map.sources.remove(source);
            }
        };
    }, [mapReady, zones]);
};
