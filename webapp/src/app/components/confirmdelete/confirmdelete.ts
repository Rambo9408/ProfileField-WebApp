import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirmdelete',
  imports: [
    MatDialogModule,
    MatDialogActions,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmdelete.html',
  styleUrl: './confirmdelete.scss'
})
export class Confirmdelete {
  constructor(
    public dialogRef: MatDialogRef<Confirmdelete>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
