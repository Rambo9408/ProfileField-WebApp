import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fieldinterface } from '../../interfaces/fieldinterface';

@Component({
  selector: 'app-fielddetails',
  imports: [CommonModule, FormsModule],
  templateUrl: './fielddetails.html',
  styleUrl: './fielddetails.scss'
})
export class Fielddetails {
  @Input() fields !: Fieldinterface[];
  leftFields: Fieldinterface[] = [];
  rightFields: Fieldinterface[] = [];

  constructor() { }

  ngOnChanges(): void {
    if (!this.fields) return;

    // Reset first
    this.leftFields = this.fields
      .filter(f => f.colId === 0)
      .sort((a, b) => a.orderId - b.orderId);

    this.rightFields = this.fields
      .filter(f => f.colId === 1)
      .sort((a, b) => a.orderId - b.orderId);

    console.log('Left Fields:', this.leftFields);
    console.log('Right Fields:', this.rightFields);
  }


}
