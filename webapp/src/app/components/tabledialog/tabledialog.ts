import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // For dropdowns
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-tabledialog',
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './tabledialog.html',
  styleUrl: './tabledialog.scss'
})
export class Tabledialog {
  // rows: number = 2;
  // cols: number = 2;

  // constructor(public dialogRef: MatDialogRef<Tabledialog>) { }

  // insertTable() {
  //   if (this.rows < 1 || this.cols < 1) {
  //     return;
  //   }
  //   this.dialogRef.close({ rows: this.rows, cols: this.cols });
  // }

  // closeDialog() {
  //   this.dialogRef.close();
  // }

  tableData = {
    rows: 2,
    cols: 2,
    width: 500,
    widthUnit: 'px',
    height: '',
    headers: 'none',
    border: 1,
    align: 'left',
    cellSpacing: 1,
    cellPadding: 1,
    caption: '',
    summary: ''
  };

  constructor(
    public dialogRef: MatDialogRef<Tabledialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog() {
    this.dialogRef.close();
  }

  insertTable() {
    this.dialogRef.close(this.tableData);
  }
}
