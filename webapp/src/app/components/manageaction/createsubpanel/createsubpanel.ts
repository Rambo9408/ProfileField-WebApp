import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
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
import { Panelservice } from '../../../services/panelservice';
import { Panelinterface } from '../../../interfaces/panelinterface';
import { Subpanelservice } from '../../../services/subpanelservice';

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
  panelId: string = '';
  originalSubPanelName: string = '';
  btnText: string = 'Create';
  panels: Panelinterface[] = [];

  constructor(
    public dialogRef: MatDialogRef<Createsubpanel>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelService: Panelservice,
    private cdr: ChangeDetectorRef,
    private subPanelService: Subpanelservice
  ) { }

  ngOnInit(): void {
    // console.log("selected sub panel id: ", this.data);
    this.getPanels();
    if (this.data.content === "Update") {
      this.getSubPanelByID(this.data.panelId);
      this.btnText = this.data.content;
    } else if (this.data.content === "clone") {
      this.getSubPanelByID(this.data.panelId);
      this.btnText = this.data.content;
    }
  }

  getSubPanelByID(id: string) {
    this.subPanelService.getSubPanelById(id).subscribe({
      next: (response) => {
        const subpanel = response.data;
        const panelOfSubPanel = subpanel.panelId;
        this.originalSubPanelName = subpanel.subPanelName;
        this.subPanelName = subpanel.subPanelName;
        this.panelId = panelOfSubPanel?._id ?? '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching subpanel:', error);
      }
    });
  }


  getPanels() {
    this.panelService.getPanels().subscribe((panels: Panelinterface[]) => {
      this.panels = panels.filter(panel => panel.isRemovable);
      if (this.data && this.data.selectedPanel) {
        this.panelId = this.data.selectedPanel;
      }
      this.cdr.detectChanges();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (!this.data) {
      // Creating new subpanel
      if (this.subPanelName && this.panelId) {
        this.dialogRef.close({
          subPanelName: this.subPanelName,
          panelId: this.panelId
        });
      }
    } else {
      // Editing existing subpanel
      const updatedData = {
        subPanelName: this.subPanelName,
        panelId: this.panelId,
        oldPanelId: this.data.panelId || ''
      };
      this.dialogRef.close(updatedData);
    }
  }

}
