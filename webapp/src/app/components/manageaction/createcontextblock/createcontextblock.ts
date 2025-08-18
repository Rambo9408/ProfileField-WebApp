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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
@Component({
  selector: 'app-createcontextblock',
  standalone: true,
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
    MatIconModule,
    CKEditorModule,
    CdkDragPlaceholder
],
  templateUrl: './createcontextblock.html',
  styleUrls: ['./createcontextblock.scss'],
})
export class Createcontextblock {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  public Editor = ClassicEditor;

  selectedPanel: string = '';
  panels: string[] = ['Panel 1', 'Panel 2', 'Panel 3'];
  contentBlockInfo: string = '';
  volunteerAccess: boolean = false;
  // editorConfig = {
  //   toolbar: [
  //     ['Bold', 'Italic', 'Underline', 'TextColor', 'Outdent', 'Indent',
  //       'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock',
  //       'NumberedList', 'BulletedList', 'Table'],
  //     ['Link']
  //   ],
  //   removePlugins: 'elementspath',
  //   resize_enabled: false,
  //   forcePasteAsPlainText: true
  // };

  public editorConfig = {
    toolbar: [
      'bold', 'italic', 'underline', '|',
      'fontColor', 'fontBackgroundColor', '|',
      'outdent', 'indent', '|',
      'alignment', '|',
      'bulletedList', 'numberedList', '|',
      'link', 'insertTable', '|',
      'undo', 'redo'
    ],
    removePlugins: ['Resize'],
    forcePasteAsPlainText: true
  };

  constructor(public dialogRef: MatDialogRef<Createcontextblock>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    console.log('Form submitted');
  }

  onReady(editor: any) {
    const stickyPanel = editor.ui.view.stickyPanel.element;// this will select the first element in the editor
    // const editableElement = editor.ui.view.editable.element;
    // editableElement.style.minHeight = '200px';
    // editableElement.style.maxHeight = '200px';
    stickyPanel.style.borderBottom = "1px solid #000";
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
