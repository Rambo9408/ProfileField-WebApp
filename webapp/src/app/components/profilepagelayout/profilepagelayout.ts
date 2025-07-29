import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Midheader } from "../midheader/midheader";
import { Panelpage } from "../panelpage/panelpage";

@Component({
  selector: 'profilepagelayout',
  imports: [Header, Midheader, Panelpage],
  templateUrl: './profilepagelayout.html',
  styleUrl: './profilepagelayout.scss'
})
export class Profilepagelayout {
 
}
