import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './createfield.html',
  styleUrl: './createfield.scss'
})
export class Createfield {
  panelName = '';
  fieldDescription = '';
  fieldType !: any;
  longTextLimit !: any;
  editPanelImport = '';
  archivingAccount = '';
  selectedPanel = '';
  selectedColumnWidth = '';
  staffAccess = '';
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

  panels = ['Panel 1', 'Panel 2', 'Panel 3'];
  columnWidths = ['25%', '50%', '75%', '100%'];

  constructor(public dialogRef : MatDialogRef<Createfield>) { }

  onCreate(): void {
    console.log('Field created with panel:', this.selectedPanel);
    // Logic to handle field creation
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  radioGroupEnable(): void {
    this.radioGroup = !this.radioGroup;
  }
}
