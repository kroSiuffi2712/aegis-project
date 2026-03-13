import { useEffect, useState } from "react";
import { Ambulance } from "../types/ambulance";
import { getAmbulances } from "../api/mockApi";

export const useAmbulances = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAmbulances();
      setAmbulances(data);
    };

    fetchData();
  }, []);

  // 🔥 Simulación tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances((prev) =>
        prev.map((amb) => ({
          ...amb,
          latitude: amb.latitude + (Math.random() - 0.5) * 0.002,
          longitude: amb.longitude + (Math.random() - 0.5) * 0.002,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { ambulances, setAmbulances };
};
