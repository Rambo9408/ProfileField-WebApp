import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Fieldservice } from '../../services/fieldservice';
import { Createfield } from '../manageaction/createfield/createfield';
import { MatDialog } from '@angular/material/dialog';
import { Subpanelservice } from '../../services/subpanelservice';
import { Loacationfieldoptions } from '../loacationfieldoptions/loacationfieldoptions';
import { Timesheettemplateoptions } from '../timesheettemplateoptions/timesheettemplateoptions';
import { Panelservice } from '../../services/panelservice';
import { Subpanelinterface } from '../../interfaces/subpanelinterface';
import { Panelinterface } from '../../interfaces/panelinterface';

@Component({
  selector: 'app-fielddetails',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './fielddetails.html',
  styleUrl: './fielddetails.scss'
})
export class Fielddetails implements OnChanges {
  @Input() fields !: Fieldinterface[];
  @Input() fieldsOfSubPanel !: Fieldinterface[];
  @Input() subPanelId !: Subpanelinterface[];

  isSubpanelField: boolean = false;
  leftFields: Fieldinterface[] = [];
  rightColumn: string = 'rightColumn';
  leftColumn: string = 'leftColumn';
  fullWidthColumn: string = 'fullWidthColumn';
  rightFields: Fieldinterface[] = [];
  fullWidthSubPanelField: Fieldinterface[] = [];
  fullWidthField: Fieldinterface[] = [];
  fieldOrder: Fieldinterface[] = [];
  subPanelFieldsOrder: Fieldinterface[] = [];
  panels : Panelinterface[] = [];
  otherPanels : any[] = [];
  maxRows: number = 0;

  fixedPanels: string[] = [
    'Name & Contact Details',
    'Location Assignment',
    'Communications History(Outbound)',
    'Timesheet Settings',
    'Log Completion Rate',
    'Associations'
  ];

  constructor(
    private fieldService: Fieldservice,
    private panelService: Panelservice,
    private subPanelService: Subpanelservice,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  get rows(): number[] {
    return Array.from({ length: this.maxRows }, (_, i) => i);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log("changes: ", changes);
  // }

  ngOnChanges(): void {
    this.processFields();
  }

  ngOnInit(): void {
    this.panelService.getPanels().subscribe({
      next: (res) => {
        this.panels = res.filter(r => !this.fixedPanels.includes(r.panelName));
        this.otherPanels = this.panels.map(panel => panel._id!) as string[];
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching panels:", err);
      }
    });
  }

  // processFields() {
  //   if (this.fields) {
  //     const fieldsCopy = this.fields.filter(f => !f.subpanelId);

  //     this.leftFields = fieldsCopy
  //       .filter(f => f.colId === 0)
  //       .sort((a, b) => a.orderId - b.orderId);

  //     this.rightFields = fieldsCopy
  //       .filter(f => f.colId === 1)
  //       .sort((a, b) => a.orderId - b.orderId);

  //     this.maxRows = Math.max(this.leftFields.length, this.rightFields.length);

  //     this.fullWidthField =
  //       this.leftFields.length === 0 && this.rightFields.length === 0
  //         ? fieldsCopy
  //         : [];
  //   }

  //   // Handle subpanel fields
  //   if (this.fieldsOfSubPanel) {
  //     this.subPanelFieldsOrder = [...this.fieldsOfSubPanel].sort(
  //       (a, b) => a.orderId - b.orderId
  //     );
  //     this.fullWidthSubPanelField =
  //       this.subPanelFieldsOrder.length > 0 ? this.subPanelFieldsOrder : [];
  //   }
  // }

  processFields() {
    if (this.fields) {
      const sortedFields = [...this.fields].sort((a, b) => a.orderId - b.orderId);

      // Separate full-width fields
      this.fullWidthField = sortedFields.filter(f => f.colWidth === 100);

      // Left & right fields based on colId
      this.leftFields = sortedFields
        .filter(f => f.colWidth === 50 && f.colId === 0)
        .sort((a, b) => a.orderId - b.orderId);

      this.rightFields = sortedFields
        .filter(f => f.colWidth === 50 && f.colId === 1)
        .sort((a, b) => a.orderId - b.orderId);

      this.maxRows = Math.max(this.leftFields.length, this.rightFields.length);
    }

    // Handle subpanel fields separately
    if (this.fieldsOfSubPanel) {
      this.subPanelFieldsOrder = [...this.fieldsOfSubPanel].filter(f => f.subpanelId).sort((a, b) => a.orderId - b.orderId);
      this.fullWidthSubPanelField = this.subPanelFieldsOrder.filter(f => f.colWidth === 100);
      this.isSubpanelField = true;
    }
  }

  refreshFields() {
    this.fieldService.getFields().subscribe({
      next: (res) => {
        if (res) {
          this.fields = res.filter(f => !f.subpanelId);
          this.fieldsOfSubPanel = res.filter(f => f.subpanelId);
          this.processFields();
          this.panelService.notifyPanelRefresh();
          this.cdRef.detectChanges();
        }
      },
      error: (err) => {
        console.error("Error refreshing fields:", err);
      }
    });
  }

  dropField(event: CdkDragDrop<Fieldinterface[]>) {

    if (event.previousContainer === event.container) {
      // Moved within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedItem = event.container.data[event.currentIndex];
      // movedItem.colId = event.container.id === this.leftColumn ? 0 : 1;
      if (event.container.id === 'leftColumn') {
        movedItem.colId = 0;
      } else if (event.container.id === 'rightColumn') {
        movedItem.colId = 1;
      }
    }

    if (this.subPanelFieldsOrder.length > 0) {
      this.subPanelFieldsOrder.forEach((field, index) => field.orderId = index + 1)
      var updatedFields = [...this.subPanelFieldsOrder];
    } else {
      this.leftFields.forEach((field, index) => field.orderId = index + 1);
      this.rightFields.forEach((field, index) => field.orderId = index + 1);
      // var updatedFields = [...this.leftFields, ...this.rightFields];
      var updatedFields = [...this.leftFields, ...this.rightFields, ...this.fullWidthField];
    }

    console.log("Updated Field Orders: ", updatedFields.map(f => f.colId));

    this.fieldService.updateFieldOrder(updatedFields).subscribe({
      next: (res) => {
        console.log("Fields reordered successfully.", res)
        this.processFields();
        this.cdRef.detectChanges();
      },
      error: (err) => console.error("Update failed", err)
    });
  }

  editField(id: string) {
    const dialogRef = this.dialog.open(Createfield, {
      width: '600px',
      data: {
        fieldId: id,
        content: 'Update'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.action === 'delete') {
        this.subPanelService.notifySubPanelRefresh();
      } else {
        this.fieldService.updateField(id, result).subscribe({
          next: (res) => {
            if (res) {
              this.subPanelService.notifySubPanelRefresh();
              this.panelService.notifyPanelRefresh();
            }
          },
          error: (error) => console.error('Error updating field:', error)
        });
      }
    });

  }

  openLocationFieldOptions(id: string) {
    const dialogRef = this.dialog.open(Loacationfieldoptions, {
      width: '600px',
      data: { fieldId: id },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog
        this.panelService.notifyPanelRefresh();
        this.subPanelService.notifySubPanelRefresh();
      }
    });
  }

  openTimesheetTemplateOption(id: string) {
    const dialogRef = this.dialog.open(Timesheettemplateoptions, {
      width: '700px',
      data: { fieldId: id },
      autoFocus: false,
      panelClass: 'timesheet-template-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the dialog
      }
    });
  }
}
