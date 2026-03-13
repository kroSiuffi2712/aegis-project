import IncidentMarker from "./IncidentMarker";
import EmergencyPanel from "./EmergencyPanel/EmergencyPanel";
import useMapView from "@/hooks/useMapView";
import { useState } from "react";
import AmbulanceMarker from "./AmbulanceMarker";
import { Incident } from "@/types/incidentEmergency";


const MapViewComponent = () => {
    const { mapContainer, mapRef, incidents, ambulances } = useMapView();
    const [openEmergencyDrawer, setOpenEmergencyDrawer] = useState(false);
    const [incidentSelected, setIncidentSelected] = useState<Incident | null>(null);


    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            { mapRef.current && incidents?.data && <IncidentMarker map={mapRef.current} incidents={incidents?.data} open={openEmergencyDrawer} setOpen={setOpenEmergencyDrawer} setIncident={setIncidentSelected} />}

            {(mapRef.current && ambulances?.data) && <AmbulanceMarker map={mapRef.current} ambulances={ambulances?.data} />}

            {/*Emergency Panel*/}
            {incidentSelected && <EmergencyPanel incident={incidentSelected} openEmergencyDrawer={openEmergencyDrawer} setOpenEmergencyDrawer={setOpenEmergencyDrawer} />}

            <div
                ref={mapContainer}
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px"
                }}
            />
        </div>
    );
};

export default MapViewComponent;
