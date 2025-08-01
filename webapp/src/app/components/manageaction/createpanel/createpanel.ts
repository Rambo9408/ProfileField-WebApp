import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-createpanel',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './createpanel.html',
  styleUrl: './createpanel.scss'
})
export class Createpanel {
  panelName: string = '';
  visibility: string = 'all';
  showOnImport: string = 'yes';
  openOnLoad: string = 'yes';
  hideFromVolunteers = false;

  constructor(
    public dialogRef: MatDialogRef<Createpanel>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    const payload = {
      panelName: this.panelName,
      visibility: this.visibility,
      showOnImport: this.showOnImport,
      openOnLoad: this.openOnLoad,
      hideFromVolunteers: this.hideFromVolunteers
    };
    this.dialogRef.close(payload);
  }
}
