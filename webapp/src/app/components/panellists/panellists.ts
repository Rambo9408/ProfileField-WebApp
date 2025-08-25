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
import { Contextblockservice } from '../../services/contextblockservice';
import { Contextblockinterface } from '../../interfaces/contextblockinterface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Createcontextblock } from '../manageaction/createcontextblock/createcontextblock';
import { Confirmdelete } from '../confirmdelete/confirmdelete';

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
  safeContent: SafeHtml[] = [];

  isOpen = false;
  fields: Fieldinterface[] = [];
  subPanels: Subpanelinterface[] = [];
  selectedContextBlocks: Contextblockinterface[] = [];
  // panelContextBlocks: { [panelId: string]: Contextblockinterface[] } = {};
  panelContextBlocks !: Contextblockinterface[];
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
    private contextBlockService: Contextblockservice,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fetchSubPanels();
    this.subpanelService.refreshSubPanels$.subscribe(() => {
      this.loadPanelFields();
      this.fetchSubPanels();
    });
  }

  getContextBlockContent(panelId: string, subPanelId?: string) {
    if (this.panelContextBlocks) {
      return;
    }

    this.contextBlockService.getContextBlock(panelId, subPanelId).subscribe({
      next: (res) => {
        this.panelContextBlocks = res.data.filter(
          (block: any) => !block.subPanel || block.subPanel === ''
        );
        this.safeContent = this.panelContextBlocks.map(block =>
          this.sanitizer.bypassSecurityTrustHtml(block.content)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`Error fetching context blocks for ${panelId}:`, err);
        this.panelContextBlocks = [];
      }
    });
  }

  getSubPanelsForPanel(panelId: string): Subpanelinterface[] {
    const data = this.subPanels.filter(subpanel =>
      subpanel.panelId?._id === panelId
    );
    return data;
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
    // if (this.openPanels[panelId]) {
    this.getContextBlockContent(panelId);
    // }
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
                this.cdr.detectChanges();
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
            this.fetchSubPanels();
            this.cdr.detectChanges();
            this.panelService.notifyPanelRefresh();
          },
          error: (error) => {
            console.error('Error creating sub-panel:', error);
          }
        });
      }
    });
  }
  addField(pid: string) {
    console.log("Add field to panel with ID:", pid);
  }
  deletePanel(pid: string) {
    // console.log("Delete panel with ID:", pid);
    this.panelService.deletePanel(pid).subscribe({
      next: (response) => {
        // console.log("Panel deleted successfully:", response);
        this.panelService.notifyPanelRefresh();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error deleting panel:", error);
      }
    });
  }

  deleteContextBlock(id: string) {
    console.log("contextBlock id: ", id);
    const dialogRef = this.dialog.open(Confirmdelete, {
      width: '600px',
      data: { id }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contextBlockService.deleteContextBlock(id).subscribe({
          next: (res) => {
            console.log("Context Block deleted successfully:", res);
            
          },
          error: (err) => {
            console.error("Error deleting Context Block:", err);
          }
        });
      }
    });
  }

  getAttachmentUrl(path: string): string {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}${path}`;
  }

  openContextBlock() {
    const dialogRef = this.dialog.open(Createcontextblock, {
      width: '800px',
      data: {
        content: 'edit',
        contextBlocks: this.panelContextBlocks
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log("Context block created/updated:", result);
        // this.contextBlockService.notifyContextBlockRefresh();
        // this.getContextBlockContent(this.panelContextBlocks[0]?.panelId?._id || '');
        this.cdr.detectChanges();
      }
    });
  }

}
