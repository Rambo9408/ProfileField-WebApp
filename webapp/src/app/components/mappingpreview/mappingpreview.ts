import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Midheader } from "../midheader/midheader";
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mappingpreview',
  imports: [Header, Midheader, FormsModule, CommonModule, MatTableModule, MatDividerModule, MatListModule, RouterLink],
  templateUrl: './mappingpreview.html',
  styleUrl: './mappingpreview.scss'
})
export class Mappingpreview {
  excelHeaders: { name: string; display: string }[] = [];
  excelData: { [key: string]: any }[] = [];
  panels: any[] = [];

  groupedPanels: {
    panelName: string;
    headers: string[];
    rows: any[][];
  }[] = [];

  constructor(private router: Router) {
    const nav = this.router.currentNavigation();
    const state = nav?.extras.state as {
      excelHeaders: { name: string; display: string }[];
      excelData: { [key: string]: any }[];
      panels: any[];
    };

    if (state) {
      this.excelHeaders = state.excelHeaders || [];
      this.excelData = state.excelData || [];
      this.panels = state.panels || [];
    }
  }

  ngOnInit(): void {
    const grouped: {
      [panel: string]: { headers: Set<string>; rows: any[][] };
    } = {};

    // Build grouped structure
    this.excelData.forEach(row => {
      Object.keys(row).forEach(key => {
        const parts = key.split(":").map(p => p.trim());
        const panelName = parts[0];
        const fieldName = parts[parts.length - 1];
        const value = row[key];

        if (!grouped[panelName]) {
          grouped[panelName] = { headers: new Set(), rows: [] };
        }
        grouped[panelName].headers.add(fieldName);
      });
    });

    // Convert headers + fill rows
    Object.keys(grouped).forEach(panel => {
      const headers = Array.from(grouped[panel].headers);
      const rows = this.excelData.slice(0, 5).map(row =>
        headers.map(h => {
          const key = `${panel}: ${h}`;
          return row[key] ?? "";
        })
      );
      this.groupedPanels.push({ panelName: panel, headers, rows });
    });

    console.log("Grouped Panels:", this.groupedPanels);
  }

  performImport() {
    this.router.navigate(['/updatedAccountPage'], {
      state: { excelHeaders: this.excelHeaders, excelData: this.excelData }
    })
  }
}
