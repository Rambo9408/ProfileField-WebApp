import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Createpanel } from '../manageaction/createpanel/createpanel';
import { Createsubpanel } from '../manageaction/createsubpanel/createsubpanel';
import { Createcontextblock } from '../manageaction/createcontextblock/createcontextblock';
import { Createfield } from '../manageaction/createfield/createfield';
import { Managecustomfields } from '../manageaction/managecustomfields/managecustomfields';

@Component({
  selector: 'app-panelaction',
  imports: [],
  templateUrl: './panelaction.html',
  styleUrl: './panelaction.scss'
})
export class Panelaction {

  constructor(private dialog: MatDialog, private router: Router) { }

  openDialogBox(type: string): void {
    let component: any;

    switch (type) {
      case 'createPanel':
        component = Createpanel;
        break;
      case 'createSubPanel':
        component = Createsubpanel;
        break;
      case 'createContextBlock':
        component = Createcontextblock;
        break;
      case 'createField':
        component = Createfield;
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
        console.log(`${type} created/updated:`, result);
      }
    });
  }

}
