import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-createcontextblock',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './createcontextblock.html',
  styleUrl: './createcontextblock.scss'
})
export class Createcontextblock {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  volunteerAccess: string = '';
  selectedPanel: string = '';
  panels = ['Panel 1', 'Panel 2', 'Panel 3'];


  constructor(public dialogRef: MatDialogRef<Createcontextblock>) { }
  
  onCancel(): void {
      this.dialogRef.close();
  }

  onCreate(): void {
    console.log('Form submitted');
  }

  formatText(command: string) {
    if (command === 'createLink') {
      const url = prompt('Enter URL');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else {
      document.execCommand(command, false, '');
    }

    this.editorRef.nativeElement.focus(); // Keep focus after command
  }

}
