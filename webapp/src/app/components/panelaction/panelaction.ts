import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Createpanel } from '../manageaction/createpanel/createpanel';
import { Createsubpanel } from '../manageaction/createsubpanel/createsubpanel';
import { Createcontextblock } from '../manageaction/createcontextblock/createcontextblock';
import { Createfield } from '../manageaction/createfield/createfield';
import { Panelservice } from '../../services/panelservice';
import { Fieldservice } from '../../services/fieldservice';

@Component({
  selector: 'app-panelaction',
  imports: [],
  templateUrl: './panelaction.html',
  styleUrl: './panelaction.scss'
})
export class Panelaction {
  flag !: number;

  constructor(
    private dialog: MatDialog,
    private panelService: Panelservice,
    private fieldService: Fieldservice // Assuming Fieldservice is defined and imported correctly
  ) { }

  openDialogBox(type: string): void {
    let component: any;

    switch (type) {
      case 'createPanel':
        component = Createpanel;
        this.flag = 1;
        break;
      case 'createSubPanel':
        component = Createsubpanel;
        this.flag = 2;
        break;
      case 'createContextBlock':
        component = Createcontextblock;
        this.flag = 3;
        break;
      case 'createField':
        component = Createfield;
        this.flag = 4;
        break;
      default:
        return;
    }

    const dialogRef = this.dialog.open(component, {
      width: '600px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.flag === 1) {
          console.log(`${type} created/updated:`, result);
          this.panelService.addPanel(result).subscribe({
            next: (response) => {
              this.panelService.notifyPanelRefresh();
            },
            error: (error) => {
              console.error('Error creating panel:', error);
            }
          });
        } else if (this.flag === 4) {
          this.fieldService.addField(result).subscribe({
            next: (response) => {
              console.log('Field created:', response);
            },
            error: (error) => {
              console.error('Error creating field:', error);
            }
          });
        } 
      }
    });
  }

}
