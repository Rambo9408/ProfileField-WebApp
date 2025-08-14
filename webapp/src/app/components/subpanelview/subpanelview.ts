import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subpanelinterface } from '../../interfaces/subpanelinterface';
import { Panelinterface } from '../../interfaces/panelinterface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Subpanelservice } from '../../services/subpanelservice';
import { Panelservice } from '../../services/panelservice';
import { Createsubpanel } from '../manageaction/createsubpanel/createsubpanel';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { Fielddetails } from '../fielddetails/fielddetails';
import { Fieldservice } from '../../services/fieldservice';

@Component({
  selector: 'app-subpanelview',
  imports: [
    FormsModule,
    CommonModule,
    Fielddetails
  ],
  templateUrl: './subpanelview.html',
  styleUrl: './subpanelview.scss'
})
export class Subpanelview {
  @Input() subpanel!: Subpanelinterface;
  @Input() parentPanelId!: Panelinterface;

  @Output() refreshSubpanels = new EventEmitter<void>();
  fields: Fieldinterface[] = [];

  constructor(
    private dialog: MatDialog,
    private subPanelService: Subpanelservice,
    private panelService: Panelservice,
    private fieldService: Fieldservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.fields = this.subpanel.fieldId as Fieldinterface[];
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
      console.log(result);
      
      this.subPanelService.updateSubPanel(pid, result).subscribe({
        next: (response) => {
          // console.log('Subpanel Updated:', response);
          this.triggerRefresh();
          this.panelService.notifyPanelRefresh();
          this.cdr.detectChanges();
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
        // console.log('Sub-panel deleted successfully:', res);
        this.triggerRefresh();
        this.panelService.notifyPanelRefresh();
      },
      error: err => {
        console.error('Error deleting sub-panel:', err);
      }
    });
  }


  triggerRefresh() {
    this.refreshSubpanels.emit();
  }

}
