import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Overlay } from '@angular/cdk/overlay';
import { MAT_DATEPICKER_SCROLL_STRATEGY } from '@angular/material/datepicker';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
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

  constructor(
    public router: Router
  ) { }

}
