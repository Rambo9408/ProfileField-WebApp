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
import { Panelservice } from '../../../services/panelservice';
import { Panelinterface } from '../../../interfaces/panelinterface';

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
  panels: Panelinterface[] = [];

  constructor(
    public dialogRef: MatDialogRef<Createsubpanel>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private panelService: Panelservice
  ) { }

  ngOnInit(): void {
    this.panelService.getPanels().subscribe((panels: Panelinterface[]) => {
      this.panels = panels;
      if (this.data && this.data.selectedPanel) {
        this.selectedPanel = this.data.selectedPanel;
      }
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.subPanelName && this.selectedPanel) {
      this.dialogRef.close({
        subPanelName: this.subPanelName,
        selectedPanel: this.selectedPanel
      });
    }  
  }
}
