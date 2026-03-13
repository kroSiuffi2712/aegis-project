import { useQuery } from "@tanstack/react-query";

import { GetIncidentsResponse } from "@/types/incidentEmergency";
import { api } from "@/services/api";

export interface GetIncidentsParams {
  page: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const getIncidents = async (params: GetIncidentsParams): Promise<GetIncidentsResponse> => {
    const { data } = await api.get<GetIncidentsResponse>("/incidents/", {
        params: {
            page: params.page,
            page_size: params.page_size ?? 20,
            sort_by: params.sort_by ?? "created_at",
            sort_order: params.sort_order ?? "desc"
        }
    });

    return data;
};

export const useIncidents = (page: number) => {
    return useQuery<GetIncidentsResponse>({
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryKey: ["incidents", page],
        queryFn: () =>
            getIncidents({
                page,
                page_size: 20,
                sort_by: "created_at",
                sort_order: "desc"
            }),
        placeholderData: previousData => previousData
    });
};
