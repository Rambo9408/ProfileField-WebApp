import { Fieldinterface } from './fieldinterface';
import { Subpanelinterface } from './subpanelinterface';

export interface Panelinterface {
  _id?: string;
  panelName: string;
  orderId?: number;
  isPanelOpen?: boolean;
  isRemovable?: boolean;
  isShownOnExport?: boolean;
  subpanelId?: Subpanelinterface[];
  fieldId: Fieldinterface[];
}
