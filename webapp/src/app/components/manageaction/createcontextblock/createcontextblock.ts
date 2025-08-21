import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editortoolbarlink } from '../editortoolbarlink/editortoolbarlink';
import { Panelservice } from '../../../services/panelservice';
import { Panelinterface } from '../../../interfaces/panelinterface';
// console.log(ClassicEditor.builtinPlugins.map((p: any) => p.pluginName));
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
    CKEditorModule
  ],
  templateUrl: './createcontextblock.html',
  styleUrls: ['./createcontextblock.scss'],
})
export class Createcontextblock {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public Editor = ClassicEditor;
  showAtachedFileOptions: boolean = false;
  selectedPanel: string = '';
  originalFileName: string = '';
  fileName: string = '';
  panels: Panelinterface[] = [];
  contentBlockInfo: string = '';
  linkText: string = 'Attach File Here';
  volunteerAccess: boolean = false;
  selectedFileName: string = '';
  attachments: { file?: File; fileName?: string; originalFileName?: string }[] = [
    { file: undefined, fileName: '', originalFileName: '' }
  ];

  public editorConfig = {
    toolbar: [
      'bold', 'italic', 'underline', '|',
      'fontColor', 'fontBackgroundColor', '|',
      'outdent', 'indent', '|',
      'alignment', '|',
      'bulletedList', 'numberedList', '|',
      'insertTable', '|',
      'undo', 'redo', '|',
      // 'customLink'
    ],
    removePlugins: ['Resize'],
    forcePasteAsPlainText: true
  };

  constructor(
    public dialogRef: MatDialogRef<Createcontextblock>,
    private dialog: MatDialog,
    private panelService: Panelservice,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // this.editorConfig.toolbar.splice(20, 0, 'link'); 
    this.getPanels();
  }

  getPanels() {
    this.panelService.getPanels().subscribe({
      next: (panels) => {
        this.panels = panels.filter((p: any) => p.isRemovable === true || p.panelName === "Name & Contact Details");
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching panels:", err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.showAtachedFileOptions && this.attachments.length === 0) {
      alert('Please enter a file name.');
      return;
    }

    // const formData = {
    //   panel: this.selectedPanel,
    //   content: this.contentBlockInfo,
    //   volunteerAccess: this.volunteerAccess,
    //   includeAttachments: this.showAtachedFileOptions,
    //   attachments: this.attachments.filter(att => att.file && att.fileName?.trim())
    // };

    const formData = new FormData();
    formData.append('panel', this.selectedPanel);
    formData.append('content', this.contentBlockInfo);
    formData.append('volunteerAccess', this.volunteerAccess.toString());
    formData.append('includeAttachments', this.showAtachedFileOptions.toString());

    // Add attachments one by one
    this.attachments.forEach(att => {
      if (att.file) {
        formData.append('attachments', att.file);
      }
    });

    this.dialogRef.close(formData);
  }

  onReady(editor: any) {
    const stickyPanel = editor.ui.view.stickyPanel.element;// this will select the first element in the editor
    stickyPanel.style.borderBottom = "1px solid #000";
    // const linkButton = editor.ui.componentFactory.create('customLink');

    // linkButton.on('execute', () => {
    //   this.openLinkDialog(editor);
    // });
  }

  openLinkDialog(editor: any): void {
    const dialogRef = this.dialog.open(Editortoolbarlink, {
      width: '400px',
      data: { linkType: 'url', protocol: 'http://', href: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let url = result.linkType === 'url'
          ? `${result.protocol}${result.href}`
          : `mailto:${result.href}`;

        editor.model.change((writer: any) => {
          const selection = editor.model.document.selection;
          if (selection && !selection.isCollapsed) {
            writer.setAttribute('linkHref', url, selection.getFirstRange());
          } else {
            const textNode = writer.createText(result.href, { linkHref: url });
            editor.model.insertContent(textNode, selection);
          }
        });
      }
    });
  }


  attachFile(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.attachments[index] = {
        ...this.attachments[index],   // keep existing fileName
        file,
        originalFileName: file.name
      };

      if (index === this.attachments.length - 1) {
        this.attachments.push({ file: undefined, fileName: '', originalFileName: '' });
      }
      input.value = '';
    }
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
    if (this.attachments.length === 0) {
      this.attachments.push({ file: undefined, fileName: '' });
    }
  }
}
