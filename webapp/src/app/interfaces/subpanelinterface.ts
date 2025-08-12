import { Fieldinterface } from "./fieldinterface";
import { Panelinterface } from "./panelinterface";

export interface Subpanelinterface {
    _id?: string;
    subPanelName: string;
    panelId: Panelinterface;
    order: number;
    fieldId?: Fieldinterface[];
    fieldType?: string;
}
