import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Panelservice } from '../../../services/panelservice';
import { Subpanelservice } from '../../../services/subpanelservice';
import { Panelinterface } from '../../../interfaces/panelinterface';
import { Subpanelinterface } from '../../../interfaces/subpanelinterface';
import { Fieldservice } from '../../../services/fieldservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-createfield',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule
  ],
  templateUrl: './createfield.html',
  styleUrl: './createfield.scss'
})
export class Createfield {
  @ViewChildren('radioBtn', { read: ElementRef }) radioButtons!: QueryList<ElementRef>;

  fieldName = '';
  fieldDescription = '';
  fieldType !: any;
  selectedFieldType: string = '';
  longTextLimit !: any;
  editPanelImport !: boolean;
  archivingAccount !: boolean;
  selectedPanelId: string = '';
  selectedSubPanel: Subpanelinterface | string = '';
  selectedColumnWidth: any = '';
  selectedFieldColSide: number = 0;
  staffAccess = 'all';
  volunteerCanSee = false;
  radioGroup = false;
  volunteerCanEdit = false;
  volunteerLockAfterEdit = false;
  volunteerEnrollmentRequired = false;
  editByStaff = false;
  requireSubmanagerReview = false;
  volunteerEnrollmentVisible = false;
  volunteerQuickAccess = false;
  volunteerReviewRequired = false;
  isEditable = false;
  // emailAlertDate: Date | null = null;
  // smsAlertDate: Date | null = null;

  // EMAIL ALERT STATES
  emailAlertDate: Date | null = null;
  emailFirstReminder: Date | null = null;
  emailLastReminder: Date | null = null;
  emailDateLabelDisplay: boolean = false;
  emailAlertOptions: boolean = false;

  // SMS ALERT STATES
  smsAlertDate: Date | null = null;
  smsFirstReminder: Date | null = null;
  smsLastReminder: Date | null = null;
  smsDateLabelDisplay: boolean = false;
  smsAlertOptions: boolean = false;

  selectedDateOptional: Date | null = null;// for date picker
  selectedDate: Date | null = null;// for date picker
  showCalendar: boolean = false;// for date picker
  optionalSelectedDate: Date | null = null;
  panels: Panelinterface[] = [];
  subPanels: Subpanelinterface[] = [];
  columnWidths = [50, 100];
  // dateLabelDisplay: boolean = false;
  // emailAlertOptions: boolean = false;
  // smsAlertOptions: boolean = false;
  confirmationAction: string | null = null;


  constructor(
    public dialogRef: MatDialogRef<Createfield>,
    private panelService: Panelservice,
    private fieldService: Fieldservice,
    private subPanelService: Subpanelservice,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getPanels();
    // console.log("Field data received:", this.data);
    if (this.data?.content === 'Update') {
      this.getFieldData(this.data.fieldId);
      this.isEditable = true;
    }
    this.cdRef.detectChanges();
  }

  onPanelChange(panelId: string, subPanelId: String | '') {
    if (!panelId) {
      return;
    }

    this.subPanelService.getSubPanelByPanelID(panelId).subscribe({
      next: (res) => {
        this.subPanels = res.data;
        const match = this.subPanels.find(sp => sp._id === subPanelId);
        if (match) {
          this.selectedSubPanel = match;
        }
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching subpanels:', err);
      }
    });
  }


  getFieldData(id: string) {
    this.fieldService.getFieldById(id).subscribe({
      next: (data) => {
        console.log(data);
        // console.log("Field data received:", data);
        this.fieldName = data.fieldName || '';
        this.fieldDescription = data.fieldDescription || '';
        this.fieldType = data.fieldType || '';
        this.longTextLimit = data.longTextLimit || '';
        this.selectedPanelId = data.panelId?._id || '';
        // this.selectedSubPanel = data.subpanelId?._id || '';
        this.selectedColumnWidth = data.colWidth || '';
        this.staffAccess = data.staffAccess || 'all';
        this.volunteerCanSee = !!data.volunteerCanSee;
        this.volunteerCanEdit = !!data.volunteerCanEdit;
        this.volunteerLockAfterEdit = !!data.volunteerLockAfterEdit;
        this.volunteerEnrollmentRequired = !!data.volunteerEnrollmentRequired;
        this.volunteerEnrollmentVisible = !!data.volunteerEnrollmentVisible;
        this.volunteerQuickAccess = !!data.volunteerQuickAccess;
        this.volunteerReviewRequired = !!data.volunteerReviewRequired;
        this.editByStaff = !!data.editByStaff;
        this.editPanelImport = !!data.editPanelImport;
        this.archivingAccount = !!data.archivingAccount;
        this.requireSubmanagerReview = !!data.requireSubmanagerReview;
        this.onPanelChange(data.panelId?._id!, data.subpanelId?._id!);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching field:", err);
      }
    });
  }

  getPanels() {
    this.panelService.getPanels().subscribe((panels: Panelinterface[]) => {
      // console.log("panels getting: ", panels);
      // this.panels = panels.filter(panel => panel.isRemovable).map(panel => panel.panelName);
      // this.subPanels = panels.filter(panel => panel.subpanelId?.length).flatMap(panel => panel.subpanelId ?? []);
      this.panels = panels.filter(panel => panel.isRemovable);
      this.cdRef.detectChanges();
    });
  }

  // get filteredSubPanels(): Subpanelinterface[] {
  //   if (!this.selectedPanelId) return [];
  //   return this.subPanels.filter(sub => {
  //     if (Array.isArray(sub.panelId)) {
  //       return sub.panelId.some(p => p._id === this.selectedPanelId);
  //     }
  //     return sub.panelId === this.selectedPanelId;
  //   });
  // }

  onCreate(fieldForm: NgForm): void {
    // console.log('Field created with panel:', fieldForm.value);
    const payload = {
      ...fieldForm.value,
      emailReminder: {
        first: this.emailFirstReminder,
        last: this.emailLastReminder
      },
      smsReminder: {
        first: this.smsFirstReminder,
        last: this.smsLastReminder
      }
    };

    if (this.data?.fieldId) {
      this.dialogRef.close({ action: 'update', field: payload });
    } else {
      this.dialogRef.close(payload);
    }
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  radioGroupEnable(): void {
    this.radioGroup = !this.radioGroup;
  }

  confirmationBtn(action: string) {
    if (this.confirmationAction === action) {
      this.confirmationAction = null;
    } else {
      this.confirmationAction = action;
    }
  }

  onConfirmAction() {
    if (this.confirmationAction === 'delete') {
      this.fieldService.deleteField(this.data.fieldId).subscribe({
        next: (res) => {
          console.log("Field deleted successfully:", res);
          this.dialogRef.close({ action: 'delete', fieldId: this.data.fieldId });
        },
        error: (err) => {
          console.error('Error deleting field:', err);
        }
      });
    } else if (this.confirmationAction === 'archive') {
      console.log("Archiving field...");
    }

    this.confirmationAction = null;
  }

  onFieldTypeChange(event: any) {
    const selectedElement = event.source._elementRef.nativeElement;
    this.selectedFieldType = selectedElement.innerHTML.trim();
  }

  applyFieldType() {
    const selectedRadio = this.radioButtons.find(
      (radio) => radio.nativeElement.querySelector('input').value === this.fieldType
    );

    if (selectedRadio) {
      this.selectedFieldType = selectedRadio.nativeElement.innerText.trim();
    }
    this.radioGroup = false;
  }

  openCalendar(type: string) {
    if (type === 'email') {
      this.emailAlertOptions = true;
      this.emailFirstReminder = this.emailFirstReminder || new Date();
    } else if (type === 'sms') {
      this.smsAlertOptions = true;
      this.smsFirstReminder = this.smsFirstReminder || new Date();
    }
  }

  onDateSelected(event: any) {
    this.selectedDate = event.value;
  }

  saveReminder(type: string) {
    if (type === 'email') {
      this.emailDateLabelDisplay = true;
      this.emailAlertOptions = false;
    } else if (type === 'sms') {
      this.smsDateLabelDisplay = true;
      this.smsAlertOptions = false;
    }
  }

  cancelReminder(type: string) {
    if (type === 'email') {
      this.emailAlertOptions = false;
    } else if (type === 'sms') {
      this.smsAlertOptions = false;
    }
  }

  undoEmailDate(type: string) {
    this.clearEmailDate(type);
  }

  undoSmsDate(type: string) {
    this.clearSmsDate(type);
  }


  // undoSelectedDate(id: string) {
  //   if (id === '0') {
  //     this.selectedDate = null;
  //   } else if (id === '1') {
  //     this.selectedDateOptional = null;
  //   }
  // }

  onOptionalDateSelected(event: any) {
    this.selectedDateOptional = event.value;
  }

  clearEmailDate(type: string) {
    if (type === 'first') this.emailFirstReminder = null;
    else if (type === 'last') this.emailLastReminder = null;
  }

  clearSmsDate(type: string) {
    if (type === 'first') this.smsFirstReminder = null;
    else if (type === 'last') this.smsLastReminder = null;
  }
}
