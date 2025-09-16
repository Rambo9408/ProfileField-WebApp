import { Component } from '@angular/core';
import { Profilepagelayout } from './components/profilepagelayout/profilepagelayout';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Overlay } from '@angular/cdk/overlay';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  imports: [Profilepagelayout, CommonModule, FormsModule],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATEPICKER_SCROLL_STRATEGY,
      useFactory: (overlay: Overlay) => () => overlay.scrollStrategies.reposition(),
      deps: [Overlay],
    }
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected title = 'webapp';
}
