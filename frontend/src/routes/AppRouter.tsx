import ContentComponent from "@/components/agents/ContentComponent";
import LayoutComponent from "@/components/layout/LayoutComponent";
import AmbulancePanel from "@/components/ambulance/AmbulancePanel";
//import MapComponent from "@/components/MapView/MapComponent";
import PatientsPanel from "@/components/patients/PatientsPanel";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from "@/components/AzureMap/MapPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas protegidas */}
                <Route element={<LayoutComponent />}>
                    <Route path="/" element={<MapPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/agents" element={<ContentComponent/>} />
                    <Route path="/patients" element={<PatientsPanel/>} />
                    <Route path="/ambulances" element={<AmbulancePanel/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
