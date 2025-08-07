import { Panelinterface } from "./panelinterface";

export interface Fieldinterface {
    _id?: string;
    fieldName: string;
    fieldDescription?: string;
    fieldType: string;
    panelId: Panelinterface; 
    colId?: number;
    orderId: number;
    isDraggable?: boolean;
    colWidth?: number;
}
