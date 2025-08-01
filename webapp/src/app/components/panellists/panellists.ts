import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fielddetails } from "../fielddetails/fielddetails";
import { Fieldservice } from '../../services/fieldservice';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { Panelinterface } from '../../interfaces/panelinterface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Panelservice } from '../../services/panelservice';

@Component({
  selector: 'app-panellists',
  standalone: true,
  imports: [CommonModule, FormsModule, Fielddetails, DragDropModule],
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

  constructor(private fieldService: Fieldservice, private panelService : Panelservice) { }

  loadPanelFields(): void {
    this.fieldService.getFields().subscribe(data => {
      console.log("Fetched fields:", data);
      this.fields = data;
    });
  }

  togglePanel(panelId: string): void {
    this.openPanels[panelId] = !this.openPanels[panelId];
  }

  dropPanel(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.panelNames, event.previousIndex, event.currentIndex);

    this.panelNames.forEach((panel, index) => {
      panel.orderId = index + 1;
    });

    console.log("Updated panel order:", this.panelNames);

    this.panelService.updatePanelOrder(this.panelNames).subscribe({
      next: (response) => {
        console.log("Panel order updated successfully:", response);
      },
      error: (error) => {
        console.error("Error updating panel order:", error);
      }
    });
  }

}
