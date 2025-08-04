import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    FormsModule,
    MatIconModule
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
  btnValue: string = 'Create';

  constructor(
    public dialogRef: MatDialogRef<Createpanel>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.panelName = this.data.panelName;
      this.visibility = this.data.visibility || 'all';
      this.showOnImport = this.data.isShownOnImport ? 'yes' : 'no';
      this.openOnLoad = this.data.isPanelOpen ? 'yes' : 'no';
      this.hideFromVolunteers = this.data.hideFromVolunteers;
      this.btnValue = 'Update';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    const payload = {
      panelName: this.panelName,
      visibility: this.visibility,
      isShownOnImport: (this.showOnImport === 'yes') ? true : false,
      isPanelOpen: (this.openOnLoad === 'yes') ? true : false,
      hideFromVolunteers: this.hideFromVolunteers
    };
    this.dialogRef.close(payload);
  }
}
