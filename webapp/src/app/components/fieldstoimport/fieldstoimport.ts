import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fieldstoimport',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './fieldstoimport.html',
  styleUrl: './fieldstoimport.scss'
})
export class Fieldstoimport {
  @Input() fieldIds: Fieldinterface[] = [];
  @Output() selectedFieldsChange = new EventEmitter<Fieldinterface[]>();
  isSelected: { [key: string]: boolean } = {};
  linkText: string = "Select All";
  constructor() { }

  ngOnInit(): void {
    console.log("Received fieldIds:", this.fieldIds);
  }

  selectAllFields() {
    this.fieldIds.forEach(field => {
      this.isSelected[field._id!] = true;
    });
    this.linkText = "Select None";
  }

  deselectAllFields() {
    this.fieldIds.forEach(field => {
      this.isSelected[field._id!] = false;
    });
    this.linkText = "Select All";
  }

  toggleSelection() {
    if (this.linkText === "Select All") {
      this.selectAllFields();
    } else {
      this.deselectAllFields();
    }
  }

  updateLinkText() {
    const allSelected = this.fieldIds.every(field => this.isSelected[field._id!]);
    this.linkText = allSelected ? "Select None" : "Select All";
    this.updateSelectedFields(); 
  }

  private updateSelectedFields() {
    const selected = this.fieldIds.filter(f => this.isSelected[f._id!]);
    this.selectedFieldsChange.emit(selected);
  }

}
