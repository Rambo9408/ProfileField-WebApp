import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fielddetails } from "../fielddetails/fielddetails";
import { Fieldservice } from '../../services/fieldservice';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { Panelinterface } from '../../interfaces/panelinterface';

@Component({
  selector: 'app-panellists',
  standalone: true,
  imports: [CommonModule, FormsModule, Fielddetails],
  templateUrl: './panellists.html',
  styleUrl: './panellists.scss',
  animations: [
    trigger('slideToggle', [
      state('open', style({
        height: '*',
        opacity: 1,
        padding: '10px 33px',
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
export class Panellists {
  isOpen = false;
  fields: Fieldinterface[] = [];
  openPanels: { [panelId: string]: boolean } = {};  // Track open/closed panels
  // fieldsMap: { [panelId: string]: Fieldinterface[] } = {};

  @Input() panelNames: Panelinterface[] = [];

  constructor(private fieldService: Fieldservice) { }

  loadPanelFields(): void {
    this.fieldService.getFields().subscribe(data => {
      console.log("Fetched fields:", data);
      this.fields = data;
    });
  }

  togglePanel(panelId: string): void {
    this.openPanels[panelId] = !this.openPanels[panelId];
  }

}
