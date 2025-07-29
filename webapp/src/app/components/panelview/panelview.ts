import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panelview',
  imports: [CommonModule, FormsModule],
  templateUrl: './panelview.html',
  styleUrl: './panelview.scss'
})
export class Panelview {
selectedOption: any;

}
