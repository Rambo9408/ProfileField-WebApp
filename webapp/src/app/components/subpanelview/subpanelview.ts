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
import { Contextblockinterface } from '../../interfaces/contextblockinterface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Contextblockservice } from '../../services/contextblockservice';
import { Createcontextblock } from '../manageaction/createcontextblock/createcontextblock';
import { Confirmdelete } from '../confirmdelete/confirmdelete';

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
  panelContextBlocks: Contextblockinterface[] = [];
  safeContent: SafeHtml[] = [];
  subPanelId: Subpanelinterface[] = [];

  constructor(
    private dialog: MatDialog,
    private subPanelService: Subpanelservice,
    private panelService: Panelservice,
    private fieldService: Fieldservice,
    private contextBlockService: Contextblockservice,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.fields = this.subpanel.fieldId as Fieldinterface[];
    this.subPanelId = [this.subpanel];
    if (this.parentPanelId['_id'] && this.subpanel._id) {
      this.getContextBlockContent(this.parentPanelId['_id']!, this.subpanel._id);
    }
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

  cloneSubPanel(id: string) {
    const dialogRef = this.dialog.open(Createsubpanel, {
      width: '600px',
      data: {
        panelId: id,
        content: 'clone'
      },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subPanelService.addSubPanel(result).subscribe({
          next: (response) => {
            // console.log('Subpanel Cloned:', response);
            if (response) {
              this.triggerRefresh();
              this.panelService.notifyPanelRefresh();
              this.cdr.detectChanges();
            }
          },
          error: (error) => {
            console.error('Error Cloning subpanel:', error);
          }
        });
      }
    });
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

  getContextBlockContent(panelId: string, subPanelId?: string) {
    if (this.panelContextBlocks.length > 0) {
      return;
    }

    this.contextBlockService.getContextBlock(panelId, subPanelId).subscribe({
      next: (res) => {
        this.panelContextBlocks = res.data.filter(
          (block: any) => block.subPanel === subPanelId
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
        const contextBlockId = this.panelContextBlocks[0]?._id;
        if (contextBlockId) {
          this.contextBlockService.updateContextBlock(contextBlockId, result.formData).subscribe({
            next: (res) => {
              if (res) {
                this.contextBlockService.notifyContextBlockRefresh();
                this.getContextBlockContent(this.panelContextBlocks[0]?.panelId);
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              console.error("Error updating context block:", err);
            }
          });
        } else {
          console.error("Context block ID is undefined, cannot update context block.");
        }
      }
    });
  }

  triggerRefresh() {
    this.refreshSubpanels.emit();
  }

}
