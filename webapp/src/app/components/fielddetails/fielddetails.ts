import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Fieldservice } from '../../services/fieldservice';
import { Createfield } from '../manageaction/createfield/createfield';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-fielddetails',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './fielddetails.html',
  styleUrl: './fielddetails.scss'
})
export class Fielddetails implements OnChanges {
  @Input() fields !: Fieldinterface[];
  @Input() fieldsOfSubPanel !: Fieldinterface[];
  leftFields: Fieldinterface[] = [];
  rightFields: Fieldinterface[] = [];
  fullWidthSubPanelField: Fieldinterface[] = [];
  fullWidthField: Fieldinterface[] = [];
  subPanelFieldsOrder: Fieldinterface[] = [];
  maxRows: number = 0;

  constructor(
    private fieldService: Fieldservice,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }

  get rows(): number[] {
    return Array.from({ length: this.maxRows }, (_, i) => i);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

    if (this.fields) {
      const fieldsCopy = this.fields.filter(f => !f.subpanelId);

      this.leftFields = fieldsCopy
        .filter(f => f.colId === 0)
        .sort((a, b) => a.orderId - b.orderId);

      this.rightFields = fieldsCopy
        .filter(f => f.colId === 1)
        .sort((a, b) => a.orderId - b.orderId);

      this.maxRows = Math.max(this.leftFields.length, this.rightFields.length);

      this.fullWidthField =
        this.leftFields.length === 0 && this.rightFields.length === 0
          ? fieldsCopy
          : [];
    }

    // Handle subpanel fields
    if (this.fieldsOfSubPanel) {
      this.subPanelFieldsOrder = [...this.fieldsOfSubPanel].sort(
        (a, b) => a.orderId - b.orderId
      );
      this.fullWidthSubPanelField =
        this.subPanelFieldsOrder.length > 0 ? this.subPanelFieldsOrder : [];
    }
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
      movedItem.colId = event.container.id === 'leftColumn' ? 0 : 1;

    }

    if (this.subPanelFieldsOrder) {
      this.subPanelFieldsOrder.forEach((field, index) => field.orderId = index + 1)
      var updatedFields = [...this.subPanelFieldsOrder];
    } else {
      this.leftFields.forEach((field, index) => field.orderId = index + 1);
      this.rightFields.forEach((field, index) => field.orderId = index + 1);
      var updatedFields = [...this.leftFields, ...this.rightFields];
    }

    this.fieldService.updateFieldOrder(updatedFields).subscribe({
      next: (res) => console.log("Fields reordered successfully.", res),
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
      if (result) {
        this.fieldService.updateField(id, result).subscribe({
          next: (response) => {
            console.log('Subpanel Updated:', response);
            // this.triggerRefresh();
            // this.panelService.notifyPanelRefresh();
            this.cdRef.detectChanges();
          },
          error: (error) => {
            console.error('Error Updating subpanel:', error);
          }
        });
      }
    });
  }

}
