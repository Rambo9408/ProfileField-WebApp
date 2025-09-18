import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Panelinterface } from '../../interfaces/panelinterface';
import { Fieldinterface } from '../../interfaces/fieldinterface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fieldsmappingpopup',
  imports: [],
  templateUrl: './fieldsmappingpopup.html',
  styleUrl: './fieldsmappingpopup.scss'
})
export class Fieldsmappingpopup {
  panels: Panelinterface[] = [];
  fields: Fieldinterface[] = [];
  excelHeaders: { name: string, display: string }[] = [];
  excelData: { [key: string]: any }[] = [];

  constructor(
    public dialogRef: MatDialogRef<Fieldsmappingpopup>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log("Fieldsmappingpopup data:", this.data);
    if (this.data) {
      this.excelHeaders = this.data.excelHeaders || [];
      this.excelData = this.data.excelData || [];
      this.panels = this.data.panels || [];
    }
  }

  mappingPreviewPage() {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe(() => {
      // Logic to navigate to Mapping Preview Page
      // For example, using Angular Router:
      this.router.navigate(['/mappingpreview'], { state: { excelHeaders: this.excelHeaders, excelData: this.excelData, panels: this.panels } });
    });
  }
}
