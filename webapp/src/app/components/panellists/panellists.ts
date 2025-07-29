import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panellists',
  imports: [CommonModule, FormsModule],
  templateUrl: './panellists.html',
  styleUrl: './panellists.scss',
  animations: [
    trigger('slideToggle', [
      state('open', style({
        height: '*',
        opacity: 1,
        padding: '10px 20px',
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
  @Input() pname !: string;

  fields = [
    ['First Name', 'Last Name'],
    ['Account Status', 'E-mail'],
    ['Logs Participation', 'Password'],
    ['Mobile', 'Receive Texts'],
    ['Date Created', 'Date Archived'],
  ];


  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }
}
