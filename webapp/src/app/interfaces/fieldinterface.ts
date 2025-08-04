export interface Fieldinterface {
    _id?: string;
    fieldName: string;
    fieldDescription?: string;
    fieldType: string;
    panelId: string; 
    colId?: number;
    orderId: number;
    isDraggable?: boolean;
    colWidth?: number;
}
