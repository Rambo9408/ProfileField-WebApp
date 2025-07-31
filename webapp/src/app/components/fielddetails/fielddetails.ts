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

  constructor(private fieldService: Fieldservice) { }

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

    console.log('Left Fields:', this.leftFields);
    console.log('Right Fields:', this.rightFields);
  }

  dropField(event: CdkDragDrop<Fieldinterface[]>) {
    
    if (event.previousContainer === event.container) {
      // Moved within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moved between left and right columns
      console.log("Moved between left and right columns");
      
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

    console.log("Updated left:", this.leftFields);
    console.log("Updated right:", this.rightFields);

    const updatedFields = [...this.leftFields, ...this.rightFields];
    this.fieldService.updateFieldOrder(updatedFields).subscribe({
      next: (res) => console.log("Fields reordered successfully.", res),
      error: (err) => console.error("Update failed", err)
    });

  }


}
