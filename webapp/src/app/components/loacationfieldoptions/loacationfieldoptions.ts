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
  selector: 'app-loacationfieldoptions',
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
  templateUrl: './loacationfieldoptions.html',
  styleUrl: './loacationfieldoptions.scss'
})
export class Loacationfieldoptions {
  requireLocationOnEnroll = false;
  locationVisibleToStaff = false;
  requireLocationOnEditOrImport = true;
  requireReviewForSubmanagers = false;
  requireLocationOnArchive = false;

  constructor(
    public dialogRef: MatDialogRef<Loacationfieldoptions>,
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
      requireReviewForSubmanagers: this.requireReviewForSubmanagers,
      requireLocationOnArchive: this.requireLocationOnArchive
    };

    this.dialogRef.close(updatedSettings);
  }
}
