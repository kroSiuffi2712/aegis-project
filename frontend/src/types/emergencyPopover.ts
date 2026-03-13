import { Incident } from "./incident";

export interface EmergencyPopoverProps {
    incident: Incident;
    open: boolean;
    setOpen: (value: boolean) => void;
}
