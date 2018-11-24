import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.css']
})
export class HelpDialogComponent implements OnInit {

    mainText = ""

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<HelpDialogComponent>) { }

    ngOnInit() {

    }

    close() {
        this.ref.close()
    }


}
