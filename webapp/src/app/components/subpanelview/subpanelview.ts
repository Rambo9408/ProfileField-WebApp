import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subpanelinterface } from '../../interfaces/subpanelinterface';
import { Panelinterface } from '../../interfaces/panelinterface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subpanelservice } from '../../services/subpanelservice';
import { Panelservice } from '../../services/panelservice';
import { Createsubpanel } from '../manageaction/createsubpanel/createsubpanel';

@Component({
  selector: 'app-subpanelview',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './subpanelview.html',
  styleUrl: './subpanelview.scss'
})
export class Subpanelview {
  @Input() subpanel!: Subpanelinterface;
  @Input() parentPanelId!: Panelinterface;

  @Output() refreshSubpanels = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private subPanelService: Subpanelservice,
    private panelService: Panelservice
  ) { }

  ngOnInit(): void {
    console.log("subpanel input: ", this.subpanel);
    console.log("parentPanelId input: ", this.parentPanelId);

  }

  editSubPanel(pid: string) {
    const dialogRef = this.dialog.open(Createsubpanel, {
      width: '600px',
      data: {
        panelId: pid,
        content: 'Update'
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {

      this.subPanelService.addSubPanel(result).subscribe({
        next: (response) => {
          console.log('Subpanel Updated:', response);
          this.triggerRefresh();
        },
        error: (error) => {
          console.error('Error Updating subpanel:', error);
        }
      });
    });
  }
  addSubPanel(id: string) {

  }
  deleteSubPanel(id: string) {
    this.subPanelService.deleteSubPanel(id).subscribe({
      next: res => {
        console.log('Sub-panel deleted successfully:', res);
        // Optionally refresh your list or close dialog here
        this.triggerRefresh(); // e.g., refresh the list after deletion
      },
      error: err => {
        console.error('Error deleting sub-panel:', err);
        // Optionally show a UI message or alert
      }
    });
  }


  triggerRefresh() {
    this.refreshSubpanels.emit();
  }

}
