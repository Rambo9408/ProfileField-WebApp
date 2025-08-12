import { ChangeDetectorRef, Component, Output } from '@angular/core';
import { Panelview } from "../panelview/panelview";
import { Panelaction } from "../panelaction/panelaction";
import { Panellists } from "../panellists/panellists";
import { CommonModule } from '@angular/common';
import { Panelservice } from '../../services/panelservice';
import { Panelinterface } from '../../interfaces/panelinterface';

@Component({
  selector: 'app-panelpage',
  imports: [Panelview, Panelaction, CommonModule, Panellists],
  templateUrl: './panelpage.html',
  styleUrl: './panelpage.scss'
})
export class Panelpage {

  panelNames !: Panelinterface[];

  constructor(private panelService: Panelservice, private cdr: ChangeDetectorRef) { }

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
        // console.log("Panel Names:", this.panelNames);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error loading panel names:", error);
      }
    })

  }

}
