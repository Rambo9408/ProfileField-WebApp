import { ChangeDetectorRef, Component, Output } from '@angular/core';
import { Panelview } from "../panelview/panelview";
import { Panelaction } from "../panelaction/panelaction";
import { Panellists } from "../panellists/panellists";
import { CommonModule } from '@angular/common';
import { Panelservice } from '../../services/panelservice';
import { Panelinterface } from '../../interfaces/panelinterface';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Fieldstoimport } from "../fieldstoimport/fieldstoimport";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Workbook } from 'exceljs';
import { Fieldinterface } from '../../interfaces/fieldinterface';
@Component({
  selector: 'app-panelpage',
  imports: [Panelview, Panelaction, CommonModule, Panellists, Fieldstoimport],
  templateUrl: './panelpage.html',
  styleUrl: './panelpage.scss',
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
export class Panelpage {

  panelNames !: Panelinterface[];
  openPanels: { [panelId: string]: boolean } = {};
  selectedFieldsByPanel: { [panelId: string]: Fieldinterface[] } = {};

  constructor(
    private panelService: Panelservice,
    private fieldService: Panelservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPanelNames();
    this.panelService.refreshPanels$.subscribe(() => {
      this.loadPanelNames();
    });
  }

  loadPanelNames(): void {
    this.panelService.getPanels().subscribe({
      next: (data: Panelinterface[]) => {
        // this.panelNames = data;
        this.panelNames = data.map(panel => ({
          ...panel,
          fieldId: panel.fieldId.filter(field => !field.subpanelId)
        }));
        console.log("Panel Names:", this.panelNames);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error loading panel names:", error);
      }
    })
  }

  togglePanel(panelId: string): void {
    this.openPanels[panelId] = !this.openPanels[panelId];
  }

  // getFieldsForPanel(panelId: string): void {
  //   this.fieldService.getPanelById(panelId).subscribe({
  //     next: (data) => {
  //       console.log(`Fields for Panel ${panelId}:`, data);
  //       // Handle the fetched fields as needed
  //     },
  //     error: (error) => {
  //       console.error(`Error fetching fields for panel ${panelId}:`, error);
  //     }
  //   });
  // }

  onSelectedFieldsChange(panelId: string, selectedFields: Fieldinterface[]) {
    this.selectedFieldsByPanel[panelId] = selectedFields;
  }

  async downloadTemplate(): Promise<void> {
    if (!this.panelNames || this.panelNames.length === 0) {
      console.warn("No panels available to download.");
      return;
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Template');

    const headers: string[] = [];

    this.panelNames.forEach(panel => {
      const selectedFields = this.selectedFieldsByPanel[panel._id!] || [];
      selectedFields.forEach(field => {
        headers.push(`${panel.panelName}: ${field.fieldName}`);
      });
    });

    // Add header row with only selected fields
    const headerRow = worksheet.addRow(headers);

    // Style header row
    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' } // White background
      };
      cell.font = { bold: true, color: { argb: '000000' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Auto-fit column widths
    worksheet.columns.forEach(column => {
      let maxLength = 10;
      column?.eachCell?.({ includeEmpty: true }, cell => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      if (column) {
        column.width = maxLength + 2;
      }
    });


    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Profile_Template_${Date.now()}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  }
}
