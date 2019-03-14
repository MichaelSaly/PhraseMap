import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<InfoDialogComponent>) { }

    ngOnInit() {
        console.log(this.data)
    }

    close() {
        this.ref.close()
    }


}
