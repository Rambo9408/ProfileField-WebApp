import { ChangeDetectorRef, Component } from '@angular/core';
import { Midheader } from "../midheader/midheader";
import { Header } from "../header/header";
import { RouterLink } from '@angular/router';
import { Panelinterface } from '../../interfaces/panelinterface';
import { Panelservice } from '../../services/panelservice';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Fieldstoimport } from "../fieldstoimport/fieldstoimport";

@Component({
  selector: 'app-mappingfields',
  imports: [Midheader, Header, RouterLink, Fieldstoimport],
  templateUrl: './mappingfields.html',
  styleUrl: './mappingfields.scss',
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
export class Mappingfields {
  panelNames !: Panelinterface[];
  openPanels: { [panelId: string]: boolean } = {};
  excelHeaders: { name: string, display: string }[] = [];
  excelData: { [key: string]: any }[] = [];

  constructor(
    private panelService: Panelservice,
    private cdr: ChangeDetectorRef
  ) {
    const nav = history.state;
    this.excelHeaders = nav?.excelHeaders || [];
    this.excelData = nav?.excelData || [];
  }

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

  validateFieldMapping() {
    alert("Field Mapping Validated Successfully");
  }
}
