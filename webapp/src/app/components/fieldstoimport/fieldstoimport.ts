import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() mappingMode: boolean = false;
  @Output() selectedFieldsChange = new EventEmitter<Fieldinterface[]>();
  @Input() excelHeaders: { name: string, display: string }[] = [];
  @Input() excelData: { [key: string]: any }[] = [];

  isSelected: { [key: string]: boolean } = {};
  mappings: { [fieldId: string]: string } = {};
  selectFields: Fieldinterface[] = [];
  validFieldsForMapping: string[] = [
    'First Name',
    'Last Name',
    'E-mail',
    'Mobile',
    'Logs Participation'
  ];

  linkText: string = "Select All";
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fieldIds'] || changes['excelHeaders']) {
      this.setupMappings();
    }
  }

  private setupMappings() {
    this.mappings = {}; // reset
    this.fieldIds.forEach(field => {
      const match = this.excelHeaders.find(
        h => h.name.trim().toLowerCase() === field.fieldName.trim().toLowerCase()
      );
      this.mappings[field._id!] = match ? match.name : "None";
      if (match) {
        this.selectFields.push(field);
        this.isSelected[field._id!] = true;
      } else {
        this.isSelected[field._id!] = false;
      }
    });
    console.log("Pre-mapped:", this.mappings);
  }

  ngOnInit(): void {
    console.log("Received fieldIds:", this.fieldIds);
  }

  selectAllFields() {
    this.fieldIds.forEach(field => {
      if (this.validFieldsForMapping.includes(field.fieldName)) {
        this.isSelected[field._id!] = true;
      }
    });
    this.linkText = "Select None";
    this.updateSelectedFields();
  }

  deselectAllFields() {
    this.fieldIds.forEach(field => {
      if (this.validFieldsForMapping.includes(field.fieldName)) {
        this.isSelected[field._id!] = false;
      }
    });
    this.linkText = "Select All";
    this.updateSelectedFields();
  }

  toggleSelection() {
    if (this.linkText === "Select All") {
      this.selectAllFields();
    } else {
      this.deselectAllFields();
    }
  }

  updateLinkText() {
    const validFields = this.fieldIds.filter(field =>
      this.validFieldsForMapping.includes(field.fieldName)
    );
    const allSelected = validFields.every(field => this.isSelected[field._id!]);
    this.linkText = allSelected ? "Select None" : "Select All";
    this.updateSelectedFields();
  }

  private updateSelectedFields() {
    const selected = this.fieldIds.filter(f => this.isSelected[f._id!]);
    this.selectedFieldsChange.emit(selected);
  }

  hasMatch(fieldName: string): boolean {
    if (!this.excelHeaders) return false;
    return this.excelHeaders.some(h => h.name.trim().toLowerCase() === fieldName.trim().toLowerCase());
  }

}
