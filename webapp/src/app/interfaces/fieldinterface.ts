import { Panelinterface } from "./panelinterface";
import { Subpanelinterface } from "./subpanelinterface";

export interface Fieldinterface {
    _id?: string;

    // Basic Field Info
    fieldName: string;
    fieldDescription?: string;
    fieldType: string;                // Keeping this as string instead of 'any'
    selectedFieldType?: string;

    // Limits & Configurations
    longTextLimit?: number | null;    // Better than using 'any'
    editPanelImport?: boolean;
    archivingAccount?: boolean;

    // Panel & Subpanel Mapping
    panelId: Panelinterface;
    subpanelId: Subpanelinterface;
    selectedPanelId?: string;
    selectedSubPanel?: Subpanelinterface;
    selectedColumnWidth?: number;

    // Access & Permissions
    staffAccess?: 'all' | 'restricted';  // Better than string | any
    volunteerCanSee?: boolean;
    volunteerCanEdit?: boolean;
    volunteerLockAfterEdit?: boolean;
    volunteerEnrollmentRequired?: boolean;
    volunteerEnrollmentVisible?: boolean;
    volunteerQuickAccess?: boolean;
    volunteerReviewRequired?: boolean;
    requireSubmanagerReview?: boolean;
    editByStaff?: boolean;

    // State & Control Flags
    radioGroup?: boolean;
    isEditable?: boolean;

    // Drag & Drop Support
    colId?: number;
    orderId: number;
    isDraggable?: boolean;
    colWidth?: number;
}
