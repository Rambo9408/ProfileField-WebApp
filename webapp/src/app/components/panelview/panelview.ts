import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-panelview',
  imports: [CommonModule, FormsModule],
  templateUrl: './panelview.html',
  styleUrl: './panelview.scss',
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
export class Panelview {
  selectedOption: number = 1;
  excelHeaders: any[] = [];
  excelData: any[] = [];

  constructor(
    private route: Router
  ) { }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert to JSON (first row = headers)
      const sheetJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // First row = headers
      const rawHeaders = Array.isArray(sheetJson[0]) ? sheetJson[0].map(h => String(h)) : [];
      const cleanHeaders = rawHeaders.map(h =>
        h.includes(":") ? h.split(":").pop()?.trim() || h : h
      );
      this.excelHeaders = cleanHeaders.map((header, i) => ({
        name: header,
        display: `${header} (Col: ${String.fromCharCode(65 + i)})`
      }));

      // Remaining rows = values
      const rows = sheetJson.slice(1);      
      this.excelData = rows.map(row => {
        const obj: { [key: string]: any } = {};
        const rowArray = row as any[];
        cleanHeaders.forEach((header, i) => {
          obj[header] = rowArray[i] ?? "";
        });
        return obj;
      });

      console.log("Headers:", this.excelHeaders);
      console.log("Data Rows:", this.excelData);
    };
    reader.readAsArrayBuffer(file);
  }

  importVolunteers() {
    if (this.excelHeaders.length === 0 || this.excelData.length === 0) {
      alert("Please upload an Excel file first.");
      return;
    }

    // ✅ redirect happens only when user clicks
    this.route.navigate(['/importFieldMapping'], {
      state: { excelHeaders: this.excelHeaders, excelData: this.excelData }
    });
  }

}
