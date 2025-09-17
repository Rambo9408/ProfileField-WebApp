import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private route: Router
  ) { }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const validTypes = [
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
      ];
      const validExtensions = ['.xls', '.xlsx'];

      const fileName = file.name.toLowerCase();
      const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      const isValidType = validTypes.includes(file.type);

      if (isValidExtension || isValidType) {
        console.log('Valid Excel file selected:', file);
        // ✅ proceed with upload
      } else {
        alert('Please upload a valid Excel file (.xls or .xlsx)');
        (event.target as HTMLInputElement).value = ''; // reset input
      }
    }
  }

  importVolunteers() {
    this.route.navigate(['/importFieldMapping']);
  }

}
