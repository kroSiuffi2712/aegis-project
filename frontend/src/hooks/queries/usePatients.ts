import { api } from "@/services/api"
import { useQuery } from "@tanstack/react-query"


export interface Patient {
  _id: string
  first_name: string
  last_name: string
  dni: string
  phone: string
  address: string
  insurance_id: string
  created_at: string
}

export interface GetIncidentsParams {
  page: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const getPatients = async (params: GetIncidentsParams): Promise<Patient[]> => {
    const { data } = await api.get<Patient[]>("/patients/", {
        params: {
            page: params.page,
            page_size: params.page_size ?? 20,
            sort_by: params.sort_by ?? "created_at",
            sort_order: params.sort_order ?? "desc"
        }
    });

    return data;
};

export const usePatients = (page: number) => {
    return useQuery<Patient[]>({
        queryKey: ["patients", page],
        queryFn: async() =>
            getPatients({
                page,
                page_size: 20,
                sort_by: "created_at",
                sort_order: "desc"
            }),
        placeholderData: previousData => previousData
    });
};