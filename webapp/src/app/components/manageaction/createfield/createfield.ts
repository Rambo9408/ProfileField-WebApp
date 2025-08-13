import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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
import { Fieldinterface } from '../../../interfaces/fieldinterface';

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
    MatIconModule
  ],
  templateUrl: './createfield.html',
  styleUrl: './createfield.scss'
})
export class Createfield {
  fieldName = '';
  fieldDescription = '';
  fieldType !: any;
  longTextLimit !: any;
  editPanelImport = '';
  archivingAccount = '';
  selectedPanelId: Panelinterface | '' = '';
  selectedSubPanel: Subpanelinterface | '' = '';
  selectedColumnWidth !: any;
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

  panels: Panelinterface[] = [];
  subPanels !: Subpanelinterface[];
  columnWidths = [50, 100];



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
    console.log("Field data received:", this.data);
    if (this.data?.content === 'Update') {
      this.getFieldData(this.data.fieldId);
    }
    this.cdRef.detectChanges();
  }

  getFieldData(id: string) {
    this.fieldService.getFieldById(id).subscribe({
      next: (data) => {
        console.log("Field data received:", data);
        this.fieldName = data.fieldName || '';
        this.fieldDescription = data.fieldDescription || '';
        this.fieldType = data.fieldType || '';
        // this.longTextLimit = data.longTextLimit || '';
        this.selectedPanelId = data.panelId || '';
        this.selectedSubPanel = data.subpanelId || '';
        this.selectedColumnWidth = data.colWidth || '';
        // this.staffAccess = data.staffAccess || 'all';
        // this.volunteerCanSee = !!data.volunteerCanSee;
        // this.volunteerCanEdit = !!data.volunteerCanEdit;
        // this.volunteerLockAfterEdit = !!data.volunteerLockAfterEdit;
        // this.volunteerEnrollmentRequired = !!data.volunteerEnrollmentRequired;
        // this.volunteerEnrollmentVisible = !!data.volunteerEnrollmentVisible;
        // this.volunteerQuickAccess = !!data.volunteerQuickAccess;
        // this.volunteerReviewRequired = !!data.volunteerReviewRequired;
        // this.editByStaff = !!data.editByStaff;
        // this.editPanelImport = !!data.editPanelImport;
        // this.archivingAccount = !!data.archivingAccount;
        // this.requireSubmanagerReview = !!data.requireSubmanagerReview;

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching field:", err);
      }
    });
  }



  getPanels() {
    this.panelService.getPanels().subscribe((panels: Panelinterface[]) => {
      console.log("panels getting: ", panels);
      // this.panels = panels.filter(panel => panel.isRemovable).map(panel => panel.panelName);
      this.subPanels = panels.filter(panel => panel.subpanelId?.length).flatMap(panel => panel.subpanelId ?? []);
      this.panels = panels.filter(panel => panel.isRemovable);
      this.cdRef.detectChanges();
    });
  }

  get filteredSubPanels(): Subpanelinterface[] {
    if (!this.selectedPanelId) return [];
    return this.subPanels.filter(sub => {
      if (Array.isArray(sub.panelId)) {
        return sub.panelId.some(p => p._id === this.selectedPanelId);
      }
      return sub.panelId === this.selectedPanelId;
    });
  }


  onCreate(fieldForm: NgForm): void {
    console.log('Field created with panel:', fieldForm.value);
    // Logic to handle field creation
    this.cdRef.detectChanges();
    this.dialogRef.close(fieldForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  radioGroupEnable(): void {
    this.radioGroup = !this.radioGroup;
  }
}
