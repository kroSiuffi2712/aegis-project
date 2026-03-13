import { useEffect, useRef } from "react";
import atlas from "azure-maps-control";
import { Ambulance } from "@/types/ambulanceMapMarker";

type Props = {
    mapInstance: React.MutableRefObject<atlas.Map | null>;
    ambulances?: Ambulance[];
    mapReady:boolean;
};

const useAmbulanceMarkers = ({ mapInstance, ambulances,mapReady }: Props) => {
    const markersRef = useRef<atlas.HtmlMarker[]>([]);

    useEffect(() => {
        if (!mapReady || !mapInstance.current || !ambulances) return;

        const map = mapInstance.current;
        if (!map) return;

        // limpiar marcadores anteriores
        markersRef.current.forEach(marker => map.markers.remove(marker));
        markersRef.current = [];

        if (!ambulances) return;

        ambulances.forEach(amb => {
            const [lng, lat] = amb.location.coordinates;

            const container = document.createElement("div");

            container.innerHTML = `
            <div class="ambulance-marker" title="Ambulance ${amb.plate} - ${amb.status}">
                <img src="/ambulance.svg" width="40" height="40" />
                <span class="ambulance-badge"></span>
            </div>
            `;

            const marker = new atlas.HtmlMarker({
                position: [lng, lat],
                 htmlContent: container
            });

            map.markers.add(marker);
            markersRef.current.push(marker);
        });
    }, [mapReady, ambulances]);
};

export default useAmbulanceMarkers;
