import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Midheader } from "../midheader/midheader";
import { Header } from "../header/header";

@Component({
  selector: 'app-updatedaccountpage',
  imports: [
    Midheader,
    Header,
    RouterLink
  ],
  templateUrl: './updatedaccountpage.html',
  styleUrl: './updatedaccountpage.scss'
})
export class Updatedaccountpage {
  excelHeaders: { name: string; display: string }[] = [];
  excelData: { [key: string]: any }[] = [];
  panels: any[] = [];

  constructor(private router: Router) {
    const nav = this.router.currentNavigation();
    const state = nav?.extras.state as {
      excelHeaders: { name: string; display: string }[];
      excelData: { [key: string]: any }[];
      panels: any[];
    };

    if (state) {
      this.excelHeaders = state.excelHeaders || [];
      this.excelData = state.excelData || [];
      this.panels = state.panels || [];
    }
  }

  ngOnInit() {
    console.log("the exceldata: ", this.excelData);

    // Transform into cleaner objects
    this.excelData = this.excelData.map(item => ({
      firstName: item["Name & Contact Details: First Name"] || "",
      lastName: item["Name & Contact Details: Last Name"] || "",
      email: item["Name & Contact Details: E-mail"] || ""
    }));

    console.log("Transformed excelData: ", this.excelData);
  }

}
