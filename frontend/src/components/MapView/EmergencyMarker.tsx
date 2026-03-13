import { Badge } from "antd";
import "@/styles/marker.css";


const EmergencyMarker = () => {
    return (
        <div className="marker-container">
            <Badge/>
            <span className="marker-center" />
            <span className="wave wave1" />
            <span className="wave wave2" />
            <span className="wave wave3" />
        </div>
    );
};

export default EmergencyMarker;
