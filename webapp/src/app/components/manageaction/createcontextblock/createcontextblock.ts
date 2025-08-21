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
import { Subpanelservice } from '../../../services/subpanelservice';
import { Subpanelinterface } from '../../../interfaces/subpanelinterface';

type Attachment = {
  file?: File;
  fileName: string;
  originalFileName: string;
};

@Component({
  selector: 'app-createcontextblock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
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

  // UI state
  showAttachedFileOptions = false; // fixed spelling (“Attached”)
  selectedPanel: string = '';
  selectedSubPanel: string = '';   // store just the _id consistently

  panels: Panelinterface[] = [];
  subPanels: Subpanelinterface[] = [];

  contentBlockInfo: string = '';
  linkText: string = 'Attach File Here';
  volunteerAccess: boolean = false;

  attachments: Attachment[] = [
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
      'undo', 'redo'
    ],
    removePlugins: ['Resize'],
    // Classic build already pastes styled content; to keep it simple:
    // (not all builds honor forcePasteAsPlainText)
  };

  constructor(
    public dialogRef: MatDialogRef<Createcontextblock>,
    private dialog: MatDialog,
    private panelService: Panelservice,
    private cdr: ChangeDetectorRef,
    private subPanelService: Subpanelservice
  ) {}

  ngOnInit() {
    this.getPanels();
  }

  getPanels() {
    this.panelService.getPanels().subscribe({
      next: (panels) => {
        this.panels = panels.filter(
          (p: any) => p.isRemovable === true || p.panelName === 'Name & Contact Details'
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching panels:', err);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    // If file section is enabled, ensure at least one valid attachment is present
    if (this.showAttachedFileOptions) {
      const hasAtLeastOneFile = this.attachments.some(att => !!att.file);
      if (!hasAtLeastOneFile) {
        alert('Please attach at least one file or turn off “Attach file” option.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('panel', this.selectedPanel);
    formData.append('subPanel', this.selectedSubPanel || '');
    formData.append('content', this.contentBlockInfo);
    formData.append('volunteerAccess', String(this.volunteerAccess));
    formData.append('includeAttachments', String(this.showAttachedFileOptions));

    // Append file + an optional display name (fileName) if you support it on backend
    this.attachments.forEach((att, idx) => {
      if (att.file) {
        formData.append('attachments', att.file);
        // Optional: send names in parallel arrays if your API expects them
        formData.append('attachmentFileNames', att.fileName || att.originalFileName || `file-${idx + 1}`);
        formData.append('attachmentOriginalNames', att.originalFileName || att.file.name);
      }
    });

    this.dialogRef.close(formData);
  }

  onReady(editor: any) {
    // Visual tweak for sticky panel
    const stickyPanel = editor?.ui?.view?.stickyPanel?.element;
    if (stickyPanel) {
      stickyPanel.style.borderBottom = '1px solid #000';
    }
  }

  openLinkDialog(editor: any): void {
    const dialogRef = this.dialog.open(Editortoolbarlink, {
      width: '400px',
      data: { linkType: 'url', protocol: 'http://', href: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const url =
        result.linkType === 'url'
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
    });
  }

  attachFile(): void {
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const current = this.attachments[index] ?? { fileName: '', originalFileName: '' };
    this.attachments[index] = {
      ...current,
      file,
      originalFileName: file.name,
      fileName: current.fileName || '' // preserve typed name if any
    };

    // Always keep an empty row at the bottom
    const last = this.attachments[this.attachments.length - 1];
    if (last.file) {
      this.attachments.push({ file: undefined, fileName: '', originalFileName: '' });
    }

    // reset input so selecting the same filename again works
    input.value = '';
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
    // Always keep at least one empty row
    if (this.attachments.length === 0 || this.attachments.every(att => !!att.file)) {
      this.attachments.push({ file: undefined, fileName: '', originalFileName: '' });
    }
  }

  onPanelChange(panelId: string, subPanelId: string | '') {
    if (!panelId) {
      this.subPanels = [];
      this.selectedSubPanel = '';
      this.cdr.detectChanges();
      return;
    }

    this.subPanelService.getSubPanelByPanelID(panelId).subscribe({
      next: (res) => {
        this.subPanels = res.data;
        // auto-select if subPanelId provided
        const match = this.subPanels.find(sp => sp._id === subPanelId);
        this.selectedSubPanel = match?._id ?? '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching subpanels:', err);
      }
    });
  }
}
