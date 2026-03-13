import { api } from "@/services/api";
import { GetAmbulancesResponse } from "@/types/ambulanceMapMarker";
import { useQuery } from "@tanstack/react-query";

export interface GetAmbulancesParams {
    status?: string;
}

export const getAmbulances = async (params: GetAmbulancesParams): Promise<GetAmbulancesResponse> => {
    const { data } = await api.get<GetAmbulancesResponse>("/ambulances/", {
        params: {
            status: params.status ?? "available"
        }
    });

    return data;
};

export const useAmbulances = (status?: string) => {
    return useQuery<GetAmbulancesResponse>({
        queryKey: ["ambulances", status],
        queryFn: () =>
            getAmbulances({
                status
            }),
        placeholderData: previousData => previousData
    });
};
