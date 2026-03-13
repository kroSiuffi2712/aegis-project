import { SetStateAction, useEffect, useRef } from "react";
import atlas from "azure-maps-control";
import "@/styles/marker.css";
import { Incident } from "@/types/incidentEmergency";

type Props = {
    mapInstance: React.MutableRefObject<atlas.Map | null>;
    incidents?: Incident[];
    mapReady: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIncident: React.Dispatch<SetStateAction<Incident | null>>;
};

const useIncidentMarkers= ({ mapInstance, incidents, setOpen, setIncident, mapReady }: Props) => {
    const markersRef = useRef<atlas.HtmlMarker[]>([]);

    useEffect(() => {
        if (!mapReady || !mapInstance.current || !incidents) return;

        const map = mapInstance.current;
        if (!map) return;

        markersRef.current.forEach(marker => map.markers.remove(marker));
        markersRef.current = [];

        if (!incidents) return;

        incidents.forEach(incident => {
            const [lng, lat] = incident.location.coordinates;

            const container = document.createElement("div");

            container.innerHTML = `
            <button class="marker-container">
              <span class="marker-center"></span>
              <span class="wave wave1"></span>
              <span class="wave wave2"></span>
              <span class="wave wave3"></span>
            </button>
          `;

            const marker = new atlas.HtmlMarker({
                position: [lng, lat],
                htmlContent: container
            });

            map.markers.add(marker);

            map.events.add("click", marker, () => {
                setIncident(incident);
                setOpen(true);
            });

            markersRef.current.push(marker);
        });
    }, [mapReady, incidents]);
};

export default useIncidentMarkers;
