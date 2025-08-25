import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';
import { Editortoolbarlink } from '../editortoolbarlink/editortoolbarlink';
import { Panelservice } from '../../../services/panelservice';
import { Panelinterface } from '../../../interfaces/panelinterface';
import { Subpanelservice } from '../../../services/subpanelservice';
import { Subpanelinterface } from '../../../interfaces/subpanelinterface';
import { Tabledialog } from '../../tabledialog/tabledialog';

type Attachment = {
  file?: File;
  fileName: string;
  originalFileName: string;
  filePath?: string;
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
    QuillModule
    // CKEditorModule
  ],
  templateUrl: './createcontextblock.html',
  styleUrls: ['./createcontextblock.scss'],
})
export class Createcontextblock {
  // @ViewChild(QuillEditorComponent) editorRef!: QuillEditorComponent;
  @ViewChild(QuillEditorComponent, { static: true }) editorRef!: QuillEditorComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  showAttachedFileOptions = false;
  selectedPanel: string = '';
  selectedSubPanel: string = '';

  panels: Panelinterface[] = [];
  subPanels: Subpanelinterface[] = [];
  isEditMode = false;
  contextBlockId: string = '';
  contentBlockInfo: string = '';
  linkText: string = 'Attach File Here';
  volunteerAccess: boolean = false;

  attachments: Attachment[] = [
    { file: undefined, fileName: '', originalFileName: '' }
  ];

  public quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
        ['table'],
      ],
      handlers: {
        link: (value: string) => {
          if (value) {
            // const url = prompt('Enter the link URL:');
            // if (url) {
            //   const range = this.editorRef.quillEditor.getSelection();
            //   this.editorRef.quillEditor.format('link', url);
            // }
            this.openLinkDialog();
          } else {
            this.editorRef.quillEditor.format('link', false);
          }
        },
        // table: () => this.insertCustomTable()
        table: () => this.openTableDialog()
      }
    }
  };

  constructor(
    public dialogRef: MatDialogRef<Createcontextblock>,
    private dialog: MatDialog,
    private panelService: Panelservice,
    private cdr: ChangeDetectorRef,
    private subPanelService: Subpanelservice,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getPanels();
    this.cdr.detectChanges();
    if (this.data && this.data.contextBlocks && this.data.contextBlocks.length > 0) {
      const block = this.data.contextBlocks[0];

      this.selectedPanel = block.panel || '';
      this.selectedSubPanel = block.subPanel || '';
      this.contentBlockInfo = block.content || '';
      this.volunteerAccess = block.volunteerAccess || false;
      this.showAttachedFileOptions = block.includeAttachments || false;
      this.attachments = block.attachments || [];
      this.contextBlockId = block._id;  // <-- capture ID for editing

      this.isEditMode = this.data.content === 'edit';

      this.onPanelChange(this.selectedPanel, this.selectedSubPanel);
    }
  }

  openTableDialog() {
    const dialogRef = this.dialog.open(Tabledialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.rows && result.cols) {
        this.insertCustomTable(result.rows, result.cols);
      }
    });
  }

  insertCustomTable(rows: number, cols: number) {
    let table = '<table style="border-collapse: collapse; width: 100%;border: 1px solid #000;">';

    for (let r = 0; r < rows; r++) {
      table += '<tr>';
      for (let c = 0; c < cols; c++) {
        table += `<td style="border: 1px solid #000; padding: 6px;">&nbsp;</td>`;
      }
      table += '</tr>';
    }

    table += '</table>';

    const quillEditor = this.editorRef.quillEditor;
    const range = quillEditor.getSelection();
    quillEditor.clipboard.dangerouslyPasteHTML(range?.index || 0, table);
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
    if (this.showAttachedFileOptions) {
      const hasAtLeastOneFile = this.attachments.some(att => !!att.file);
      if (!hasAtLeastOneFile) {
        alert('Please attach at least one file or turn off “Attach file” option.');
        return;
      }
    }
    console.log(this.attachments);

    const formData = new FormData();
    formData.append('panel', this.selectedPanel);
    formData.append('subPanel', this.selectedSubPanel || '');
    formData.append('content', this.contentBlockInfo);
    formData.append('volunteerAccess', String(this.volunteerAccess));
    formData.append('includeAttachments', String(this.showAttachedFileOptions));

    // If editing, include ID
    if (this.isEditMode) {
      formData.append('_id', this.contextBlockId);
    }

    this.attachments.forEach((att, idx) => {
      if (att.file) {
        formData.append('attachments', att.file);
        formData.append('attachmentFileNames', att.fileName || `file-${idx + 1}`);
        formData.append('attachmentOriginalNames', att.originalFileName || att.file.name);
      } else if (att.filePath) {
        // If already uploaded, preserve path
        formData.append('existingAttachments', JSON.stringify({
          filePath: att.filePath,
          fileName: att.fileName,
          originalFileName: att.originalFileName
        }));
      }

    });

    // this.dialogRef.close(formData);
    this.dialogRef.close({ isEdit: this.isEditMode, formData });
  }

  onReady(editor: any) {
    const stickyPanel = editor?.ui?.view?.stickyPanel?.element;
    if (stickyPanel) {
      stickyPanel.style.borderBottom = '1px solid #000';
    }
  }

  openLinkDialog(): void {
    const dialogRef = this.dialog.open(Editortoolbarlink, {
      width: '400px',
      data: { linkType: 'url', protocol: 'http://', href: '' },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const url =
        result.linkType === 'url'
          ? `${result.protocol}${result.href}`
          : `mailto:${result.href}`;

      const quillEditor = this.editorRef?.quillEditor;
      if (quillEditor) {
        const range = quillEditor.getSelection();
        if (range) {
          quillEditor.insertText(range.index, result.href, 'link', url);
          quillEditor.setSelection(range.index + result.href.length, 0);
        }
      }
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

    const last = this.attachments[this.attachments.length - 1];
    if (last.file) {
      this.attachments.push({ file: undefined, fileName: '', originalFileName: '' });
    }

    input.value = '';
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
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
