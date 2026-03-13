import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { createRoot, Root } from "react-dom/client";
import { Badge, Tooltip } from "antd";
import { GetAmbulancesResponse } from "@/types/ambulanceMapMarker";

interface Props {
    map: maplibregl.Map;
    ambulances: GetAmbulancesResponse | undefined;
}

const AmbulanceMarker: React.FC<Props> = ({ map, ambulances }) => {
    const markersRef = useRef<{ marker: maplibregl.Marker; root: Root }[]>([]);

    useEffect(() => {
        if (!map || !ambulances?.data) return;

        const renderMarkers = () => {
            // limpiar markers anteriores correctamente
            markersRef.current.forEach(({ marker, root }) => {
                marker.remove();
                root.unmount();
            });

            markersRef.current = [];

            ambulances?.data.forEach(ambulance => {
                const markerElement = document.createElement("div");
                const root = createRoot(markerElement);

                root.render(
                    <Tooltip title={`Ambulance ${ambulance.plate} - ${ambulance.status}`}>
                        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => console.log("Ambulance clicked:", ambulance._id)}>
                            <Badge offset={[6, 34]}>
                                <img src="/ambulance.svg" alt="ambulance" width={40} height={40} />
                            </Badge>
                        </div>
                    </Tooltip>
                );

                const [lng, lat] = ambulance.location.coordinates;

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
    }, [map, ambulances]);

    // Cleanup SOLO cuando el componente se desmonta
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

export default AmbulanceMarker;
