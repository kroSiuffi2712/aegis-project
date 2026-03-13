import { useEffect, useRef, useState } from "react";
import atlas from "azure-maps-control";

const useAzureMap = () => {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<atlas.Map | null>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {

        if (!mapRef.current || mapInstance.current) return;

        const map = new atlas.Map(mapRef.current, {
            center: [-74.1, 4.71],
            zoom: 12,
            style: "grayscale_dark",
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY
            }
        });

        mapInstance.current = map;

        map.events.add("ready", () => {
            setMapReady(true);
        });

        return () => {
            if (import.meta.env.PROD && mapInstance.current) {
                mapInstance.current.dispose();
                mapInstance.current = null;
            }
        };

    }, []);

    return { mapRef, mapInstance, mapReady };
};

export default useAzureMap;