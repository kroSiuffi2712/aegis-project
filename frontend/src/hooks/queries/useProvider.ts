import { api } from "@/services/api"
import { useQuery } from "@tanstack/react-query"


export interface Provider {
  id: string
  name: string
  nit: string
  phone: string
  address: string
}
export interface GetIncidentsParams {
  page: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const getProviders = async (params: GetIncidentsParams): Promise<Provider[]> => {
    const { data } = await api.get<Provider[]>("/providers/", {
        params: {
            page: params.page,
            page_size: params.page_size ?? 20,
            sort_by: params.sort_by ?? "created_at",
            sort_order: params.sort_order ?? "desc"
        }
    });

    return data;
};

export const useProviders = (page: number) => {
    return useQuery<Provider[]>({
        queryKey: ["providers", page],
        queryFn: async() =>
            getProviders({
                page,
                page_size: 20,
                sort_by: "created_at",
                sort_order: "desc"
            }),
        placeholderData: previousData => previousData
    });
};