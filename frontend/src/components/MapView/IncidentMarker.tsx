import { SetStateAction, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { createRoot, Root } from "react-dom/client";
import { Button } from "antd";
import "@/styles/marker.css";
import { GetIncidentsResponse, Incident } from "@/types/incidentEmergency";

interface Props {
    map: maplibregl.Map;
    incidents: GetIncidentsResponse | undefined;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIncident: React.Dispatch<SetStateAction<Incident | null>>;
}

const IncidentMarker: React.FC<Props> = ({ map, incidents, setOpen, setIncident }) => {
    const markersRef = useRef<{ marker: maplibregl.Marker; root: Root }[]>([]);

    useEffect(() => {
        if (!map || !incidents?.data.length) return;

        const renderMarkers = () => {
            // limpiar markers anteriores
            markersRef.current.forEach(({ marker, root }) => {
                marker.remove();
                root.unmount();
            });
            markersRef.current = [];

            incidents?.data.forEach(incident => {
                const markerElement = document.createElement("div");
                const root = createRoot(markerElement);

                root.render(
                    <Button
                        className={"marker-container"}
                        onClick={() => {
                            setIncident(incident);
                            setOpen(prev => !prev);
                        }}
                    >
                        <span className="marker-center" />
                        <span className="wave wave1" />
                        <span className="wave wave2" />
                        <span className="wave wave3" />
                    </Button>
                );

                const [lng, lat] = incident.location.coordinates;

                const marker = new maplibregl.Marker({
                    element: markerElement,
                    anchor: "center"
                })
                    .setLngLat([lng, lat])
                    .addTo(map);

                markersRef.current.push({ marker, root });
            });
        };

        if (map.loaded()) {
            renderMarkers();
        } else {
            map.once("load", renderMarkers);
        }
    }, [map, incidents]);

    // Cleanup
    useEffect(() => {
        return () => {
            markersRef.current.forEach(({ marker, root }) => {
                marker.remove();
                root.unmount();
            });
            markersRef.current = [];
        };
    }, []);

    return null;
};

export default IncidentMarker;
