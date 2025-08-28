import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Subpanelinterface } from '../../../interfaces/subpanelinterface';
import { CommonModule } from '@angular/common';
import { Panelservice } from '../../../services/panelservice';

@Component({
  selector: 'app-createpanel',
  imports: [
    CommonModule,
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
  originalPanelName: string = '';
  visibility: string = 'all';
  showOnImport: string = 'yes';
  openOnLoad: string = 'yes';
  hideFromVolunteers = false;
  includeSubPanel = false;
  subpanelId: Subpanelinterface[] = [];
  btnValue: string = 'Create';
  subPanelName: string = '';

  constructor(
    public dialogRef: MatDialogRef<Createpanel>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelService: Panelservice
  ) { }

  ngOnInit(): void {
    if (this.data.content === "clone") {
      this.panelName = this.data.panelName;
      this.originalPanelName = this.data.panelName;
      this.hideFromVolunteers = true;
      this.subpanelId = this.data.subpanelId;
      if (this.subpanelId.length > 0) {
        this.data.subpanelId.forEach((subpanel: Subpanelinterface) => {
          this.subPanelName = subpanel.subPanelName;
        });
      }
    }
    if (this.data.content === "edit") {
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
      contentType: this.data.content || '',
      panelName: this.panelName,
      visibility: this.visibility,
      isShownOnImport: (this.showOnImport === 'yes') ? true : false,
      isPanelOpen: (this.openOnLoad === 'yes') ? true : false,
      hideFromVolunteers: this.hideFromVolunteers,
      subpanelId: this.subpanelId
    };

    this.panelService.getPanels().subscribe(panels => {
      const panelExists = panels.some((panel: any) => panel.panelName.toLowerCase() === this.panelName.toLowerCase());
      if (panelExists) {
        alert("A panel with this name already exists. Please choose a different name.");
      } else {
        this.dialogRef.close({ action: this.data.content, formData: payload });
      }
    });
  }
}
