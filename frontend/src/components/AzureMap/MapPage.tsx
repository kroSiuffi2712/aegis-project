import { useAmbulances } from "@/hooks/queries/useAmbulances";
import { useIncidents } from "@/hooks/queries/useIncidents";
import useAzureMap from "@/hooks/useAzureMap";
import useAmbulanceMarkers from "@/hooks/useAmbulanceMarkers";

import { useState } from "react";
import { Incident } from "@/types/incidentEmergency";
import EmergencyPanel from "../MapView/EmergencyPanel/EmergencyPanel";
import useIncidentMarkers from "@/hooks/useIncidentMarkers";


const MapPage = () => {
    const { mapRef, mapInstance, mapReady  } = useAzureMap();
    const [page, setPage] = useState(1);
    const [openEmergencyDrawer, setOpenEmergencyDrawer] = useState(false);
    const [incidentSelected, setIncidentSelected] = useState<Incident | null>(null);
    const incidents = useIncidents(page);
    const ambulances = useAmbulances();


    useIncidentMarkers({
        mapInstance,
        incidents: incidents.data?.data,
        mapReady,
        setOpen: setOpenEmergencyDrawer,
        setIncident: setIncidentSelected
    });

    useAmbulanceMarkers({
        mapInstance,
        ambulances: ambulances.data?.data,
        mapReady
    });

    return (
        <div ref={mapRef} style={{ position: "relative", width: "100%", height: "100%" }}>
            {/*Emergency Panel*/}
            <EmergencyPanel incident={incidentSelected} openEmergencyDrawer={openEmergencyDrawer} setOpenEmergencyDrawer={setOpenEmergencyDrawer} />
        </div>
    );
};

export default MapPage;
