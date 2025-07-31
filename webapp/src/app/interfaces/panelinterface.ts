import { Fieldinterface } from './fieldinterface';

export interface Panelinterface {
  _id?: string;
  panelName: string;
  orderId?: number;
  fieldId: Fieldinterface[];
}
