import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { useAmbulances } from "./queries/useAmbulances";
import { useIncidents } from "./queries/useIncidents";
import { message } from "antd";

const useMapView = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [page, setPage] = useState(1);

    const ambulances = useAmbulances();
    const incidents = useIncidents(page);

    // Inicializar mapa
    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://api.maptiler.com/maps/dataviz-dark/style.json?key=PVKNhaz4XoisywQLkCGs",
            center: [-74.0721, 4.711],
            zoom: 12
        });

        mapRef.current = map; 

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        return () => map.remove();
    }, []);

    useEffect(() => {
        if (incidents.error) {
            message.error("No se pudieron cargar los incidentes");
        }
    }, [incidents.error]);

    return { ambulances, mapContainer, mapRef, incidents };
};
export default useMapView;
