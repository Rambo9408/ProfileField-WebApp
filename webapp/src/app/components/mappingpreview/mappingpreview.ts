import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Midheader } from "../midheader/midheader";

@Component({
  selector: 'app-mappingpreview',
  imports: [Header, Midheader],
  templateUrl: './mappingpreview.html',
  styleUrl: './mappingpreview.scss'
})
export class Mappingpreview {

}
