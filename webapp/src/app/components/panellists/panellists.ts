import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fielddetails } from "../fielddetails/fielddetails";
import { Fieldservice } from '../../services/fieldservice';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { Panelinterface } from '../../interfaces/panelinterface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Panelservice } from '../../services/panelservice';
import { MatDialog } from '@angular/material/dialog';
import { Createpanel } from '../manageaction/createpanel/createpanel';
import { Createsubpanel } from '../manageaction/createsubpanel/createsubpanel';
import { Subpanelservice } from '../../services/subpanelservice';
import { Subpanelinterface } from '../../interfaces/subpanelinterface';
import { Subpanelview } from '../subpanelview/subpanelview';

@Component({
  selector: 'app-panellists',
  standalone: true,
  imports: [CommonModule, FormsModule, Fielddetails, DragDropModule, Subpanelview],
  templateUrl: './panellists.html',
  styleUrl: './panellists.scss',
  animations: [
    trigger('slideToggle', [
      state('open', style({
        height: '*',
        // opacity: 1,
        // padding: '10px 33px',
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        padding: '0px 20px',
        overflow: 'hidden',
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class Panellists {
  isOpen = false;
  fields: Fieldinterface[] = [];
  subPanels: Subpanelinterface[] = [];
  openPanels: { [panelId: string]: boolean } = {};
  fixedPanels: string[] = [
    'Name & Contact Details',
    'Location Assignment',
    'Communications History(Outbound)',
    'Timesheet Settings',
    'Log Completion Rate',
    'Associations'
  ];
  @Input() panelNames: Panelinterface[] = [];

  constructor(
    private fieldService: Fieldservice,
    private dialog: MatDialog,
    private panelService: Panelservice,
    private subpanelService: Subpanelservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subpanelService.getSubPanels().subscribe({
      next: (subpanels: Subpanelinterface[]) => {
        console.log("Subpanels fetched:", subpanels);
        this.subPanels = subpanels;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error fetching subpanels:", error);
      }
    });
  }

  getSubPanelsForPanel(panelId: string): Subpanelinterface[] {
    return this.subPanels.filter(subpanel =>
      subpanel.panelId?._id === panelId
    );
  }

  fetchSubPanels(): void {
    this.subpanelService.getSubPanels().subscribe({
      next: (subpanels: Subpanelinterface[]) => {
        this.subPanels = subpanels;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error fetching subpanels:", error);
      }
    });
  }

  loadPanelFields(): void {
    this.fieldService.getFields().subscribe(data => {
      this.fields = data;
    });
  }

  togglePanel(panelId: string): void {
    this.openPanels[panelId] = !this.openPanels[panelId];
  }

  dropPanel(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.panelNames, event.previousIndex, event.currentIndex);

    this.panelNames.forEach((panel, index) => {
      panel.orderId = index + 1;
    });


    this.panelService.updatePanelOrder(this.panelNames).subscribe({
      next: (response) => {
        console.log("Panel order updated successfully:", response);
      },
      error: (error) => {
        console.error("Error updating panel order:", error);
      }
    });
  }

  editPanel(pid: string) {
    // console.log("Edit panel with ID:", pid);
    this.panelService.getPanelById(pid).subscribe({
      next: (panel) => {
        const dialogRef = this.dialog.open(Createpanel, {
          width: '600px',
          data: panel
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // console.log("Panel updated:", result);
            this.panelService.updatePanel(pid, result).subscribe({
              next: (response) => {
                // console.log('Panel updated successfully:', response);
                this.panelService.notifyPanelRefresh(); // Notify other components to refresh
              },
              error: (error) => {
                console.error('Error updating panel:', error);
              }
            });
          }
        });
      },
      error: (error) => {
        console.error("Error fetching panel details:", error);
      }

    });
  }
  createSubPanel(pid: string) {
    // console.log("Create sub-panel for panel with ID:", pid);
    this.dialog.open(Createsubpanel, {
      width: '600px',
      data: {
        panelId: pid,
        content: 'create'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        // console.log("Sub-panel created:", result);
        this.subpanelService.addSubPanel(result).subscribe({
          next: (response) => {
            console.log('Sub-panel created successfully:', response);
            this.fetchSubPanels(); // Notify other components to refresh
          },
          error: (error) => {
            console.error('Error creating sub-panel:', error);
          }
        });
      }
    });
  }
  addField(pid: string) {
    // Logic to add a field to a panel
    console.log("Add field to panel with ID:", pid);
    // You can implement the logic to open a dialog or navigate to a field creation page
  }
  deletePanel(pid: string) {
    // console.log("Delete panel with ID:", pid);
    this.panelService.deletePanel(pid).subscribe({
      next: (response) => {
        // console.log("Panel deleted successfully:", response);
        this.panelService.notifyPanelRefresh(); 
      },
      error: (error) => {
        console.error("Error deleting panel:", error);
      }
    });
  }

}
