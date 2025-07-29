import { Component } from '@angular/core';

@Component({
  selector: 'app-midheader',
  imports: [],
  templateUrl: './midheader.html',
  styleUrl: './midheader.scss'
})
export class Midheader {
   logout() {
    // Logic for logging out the user
    console.log('User logged out');
  }
  navigateToProfile() {
    // Logic for navigating to the user profile
    console.log('Navigating to user profile');
  }
}
