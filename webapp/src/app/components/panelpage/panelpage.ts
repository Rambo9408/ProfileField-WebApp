import { Component, Output } from '@angular/core';
import { Panelview } from "../panelview/panelview";
import { Panelaction } from "../panelaction/panelaction";
import { Panellists } from "../panellists/panellists";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panelpage',
  imports: [Panelview, Panelaction, CommonModule, Panellists],
  templateUrl: './panelpage.html',
  styleUrl: './panelpage.scss'
})
export class Panelpage {
  @Output()
  panelNames = [
    'Name & Contact Details',
    'Location Assignment',
    'Timesheet Settings',
    'Communications History(Outbound)',
    'Log Completion Rate',
    'Associations'
  ]

}
