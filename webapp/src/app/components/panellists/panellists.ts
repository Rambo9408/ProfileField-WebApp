import { Component, Input, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-panellists',
  standalone: true,
  imports: [CommonModule, FormsModule, Fielddetails, DragDropModule],
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
  openPanels: { [panelId: string]: boolean } = {};  // Track open/closed panels
  // fieldsMap: { [panelId: string]: Fieldinterface[] } = {};
  fixedPanels: string[] = [
    'Name & Contact Details',
    'Location Assignment',
    'Communications History(Outbound)',
    'Timesheet Settings',
    'Log Completion Rate',
    'Associations'
  ];
  @Input() panelNames: Panelinterface[] = [];

  constructor(private fieldService: Fieldservice, private dialog: MatDialog, private panelService: Panelservice) { }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['panelNames'] && this.panelNames?.length) {
  //     this.setOpenPanels();
  //   }
  // }

  // setOpenPanels(): void {
  //   this.openPanels = {};
  //   this.panelNames.forEach(panel => {
  //     this.openPanels[panel._id!] = !!panel.isPanelOpen;
  //   });
  // }

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
        // console.log("Panel order updated successfully:", response);
      },
      error: (error) => {
        console.error("Error updating panel order:", error);
      }
    });
  }

  editPanel(pid: string) {
    // Logic to edit a panel
    // console.log("Edit panel with ID:", pid);
    // You can implement the logic to open a dialog or navigate to an edit page
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
    // Logic to create a sub-panel
    // console.log("Create sub-panel for panel with ID:", pid);
    this.dialog.open(Createsubpanel, {
      width: '600px',
      data: { panelId: pid }
    }).afterClosed().subscribe(result => {
      if (result) {
        // console.log("Sub-panel created:", result);
        // You can implement the logic to save the sub-panel data
        // For example, you might call a service to save the sub-panel
        // this.panelService.addPanel(result).subscribe({
        //   next: (response) => {
        //     console.log('Sub-panel created successfully:', response);
        //     this.panelService.notifyPanelRefresh(); // Notify other components to refresh
        //   },
        //   error: (error) => {
        //     console.error('Error creating sub-panel:', error);
        //   }
        // });
      }
    });
  }
  addField(pid: string) {
    // Logic to add a field to a panel
    console.log("Add field to panel with ID:", pid);
    // You can implement the logic to open a dialog or navigate to a field creation page
  }
  deletePanel(pid: string) {
    // Logic to delete a panel
    // console.log("Delete panel with ID:", pid);
    this.panelService.deletePanel(pid).subscribe({
      next: (response) => {
        // console.log("Panel deleted successfully:", response);
        this.panelService.notifyPanelRefresh(); // Notify other components to refresh
      },
      error: (error) => {
        console.error("Error deleting panel:", error);
      }
    });
  }

}
