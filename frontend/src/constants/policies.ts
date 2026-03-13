// src/constants/policies.ts

export type PolicyType = "pdf" | "word";

export interface Policy {
    id: string;
    label: string;
    type: PolicyType;
}

export const POLICIES: Policy[] = [
    {
        id: "CT_Politica_de_Beneficio",
        label: "Política de Beneficio",
        type: "pdf"
    },
    {
        id: "CT_Politica_de_Horarios_Jornada_Laboral",
        label: "Política de Horarios y Jornada Laboral",
        type: "pdf"
    },
    {
        id: "CT_Politica_de_Licencias",
        label: "Política de Licencias",
        type: "pdf"
    },
    {
        id: "CT_Politica_de_Vacaciones",
        label: "Política de Vacaciones",
        type: "pdf"
    },
    {
        id: "CT_Reglamento_interno",
        label: "Reglamento Interno",
        type: "pdf"
    },
    {
        id: "CT_Politica_de_Certificados",
        label: "Política de Certificados",
        type: "pdf"
    }
];
