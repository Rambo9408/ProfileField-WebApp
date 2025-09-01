import { Component } from '@angular/core';
import { Profilepagelayout } from './components/profilepagelayout/profilepagelayout';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-root',
  imports: [Profilepagelayout, CommonModule, FormsModule],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected title = 'webapp';
}
