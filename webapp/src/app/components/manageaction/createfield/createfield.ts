import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Panelservice } from '../../../services/panelservice';
import { Subpanelservice } from '../../../services/subpanelservice';
import { Panelinterface } from '../../../interfaces/panelinterface';

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
  panelId = '';
  selectedSubPanel = '';
  selectedColumnWidth = '';
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
  columnWidths = [50 , 100];

  constructor(
    public dialogRef: MatDialogRef<Createfield>,
    private panelService: Panelservice,
    private subPanelService: Subpanelservice,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.panelService.getPanels().subscribe((panels : Panelinterface[]) => {
      // this.panels = panels.filter(panel => panel.isRemovable).map(panel => panel.panelName);
      this.panels = panels.filter(panel => panel.isRemovable);
      this.cdRef.detectChanges();
    });
  }

  onCreate(fieldForm: NgForm): void {
    console.log('Field created with panel:', fieldForm.value);
    // Logic to handle field creation
    this.dialogRef.close(fieldForm.value);
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  radioGroupEnable(): void {
    this.radioGroup = !this.radioGroup;
  }
}
