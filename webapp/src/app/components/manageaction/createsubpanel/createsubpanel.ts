import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-createsubpanel',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatOptionModule,
    MatIconModule,
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './createsubpanel.html',
  styleUrl: './createsubpanel.scss'
})
export class Createsubpanel {
  subPanelName: string = '';
  selectedPanel: string = '';
  panels = ['Panel 1', 'Panel 2', 'Panel 3'];

  constructor(
    public dialogRef: MatDialogRef<Createsubpanel>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    console.log('Creating sub-panel with name:', this.subPanelName);  
    if (this.subPanelName && this.selectedPanel) {
      this.dialogRef.close({
        subPanelName: this.subPanelName,
        selectedPanel: this.selectedPanel
      });
    }  
  }
}
