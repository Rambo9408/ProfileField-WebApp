import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Fieldservice } from '../../services/fieldservice';

@Component({
  selector: 'app-fielddetails',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './fielddetails.html',
  styleUrl: './fielddetails.scss'
})
export class Fielddetails {
  @Input() fields !: Fieldinterface[];
  leftFields: Fieldinterface[] = [];
  rightFields: Fieldinterface[] = [];
  fullWidthField: Fieldinterface[] = [];
  maxRows: number = 0;
  constructor(private fieldService: Fieldservice) { }
  
  get rows(): number[] {
    return Array.from({ length: this.maxRows }, (_, i) => i);
  }

  ngOnChanges(): void {
    if (!this.fields) return;
    const fieldsCopy = [...this.fields];    
    // Reset first
    this.leftFields = fieldsCopy
      .filter(f => f.colId === 0)
      .sort((a, b) => a.orderId - b.orderId);

    this.rightFields = fieldsCopy
      .filter(f => f.colId === 1)
      .sort((a, b) => a.orderId - b.orderId);
    this.maxRows = Math.max(this.leftFields.length, this.rightFields.length);
    if (this.leftFields.length === 0 && this.rightFields.length === 0) {
      this.fullWidthField = fieldsCopy;
    } else {
      this.fullWidthField = [];
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

      // Update colId when moved across
      const movedItem = event.container.data[event.currentIndex];
      movedItem.colId = event.container.id === 'leftColumn' ? 0 : 1;

    }

    // Update orderId after reordering
    this.leftFields.forEach((field, index) => field.orderId = index + 1);
    this.rightFields.forEach((field, index) => field.orderId = index + 1);

    const updatedFields = [...this.leftFields, ...this.rightFields];
    this.fieldService.updateFieldOrder(updatedFields).subscribe({
      next: (res) => console.log("Fields reordered successfully.", res),
      error: (err) => console.error("Update failed", err)
    });

  }


}
