import { Panelinterface } from "./panelinterface";
import { Subpanelinterface } from "./subpanelinterface";

export interface Fieldinterface {
    _id?: string;
    fieldName: string;
    fieldDescription?: string;
    fieldType: string;
    panelId: Panelinterface; 
    subpanelId: Subpanelinterface;
    colId?: number;
    orderId: number;
    isDraggable?: boolean;
    colWidth?: number;
}
