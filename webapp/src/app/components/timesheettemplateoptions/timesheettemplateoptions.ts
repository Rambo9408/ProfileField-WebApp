import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-timesheettemplateoptions',
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
  templateUrl: './timesheettemplateoptions.html',
  styleUrl: './timesheettemplateoptions.scss'
})
export class Timesheettemplateoptions {
  requireLocationOnEnroll = false;
  locationVisibleToStaff = false;
  requireLocationOnEditOrImport = false;
  requireReviewForSubmanagers = false;
  requireLocationOnArchive = false;
  staffAccessOption: string = 'all';
  availableRoles: any[] = [
    { name: 'role1', selected: false },
    { name: 'role2', selected: false },
    { name: 'role3', selected: false }
  ];
  selectAlllink: string = 'Select All';

  constructor(
    public dialogRef: MatDialogRef<Timesheettemplateoptions>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSettings(): void {
    const updatedSettings = {
      requireLocationOnEnroll: this.requireLocationOnEnroll,
      locationVisibleToStaff: this.locationVisibleToStaff,
      requireLocationOnEditOrImport: this.requireLocationOnEditOrImport,
      staffAccessOption: this.staffAccessOption
    };

    this.dialogRef.close(updatedSettings);
  }

  selectAllRoles(): void {
    const allSelected = this.availableRoles.every(role => role.selected);

    // Toggle selection
    this.availableRoles.forEach(role => role.selected = !allSelected);

    // Update label based on selection
    this.selectAlllink = allSelected ? 'Select All' : 'Unselect All';
  }

  onRoleChange(): void {
    const allSelected = this.availableRoles.every(role => role.selected);
    this.selectAlllink = allSelected ? 'Unselect All' : 'Select All';
  }


}
