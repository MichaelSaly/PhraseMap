import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

    mainText = ""

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<ErrorDialogComponent>) { }

    ngOnInit() {
        switch(this.data) {
            case 0: this.mainText = "Your sentence may only contain letters and no numbers!"; break
            case 1: this.mainText = "Make sure your sentence contains at least two words!"; break
            case 2: this.mainText = "The sentence you have entered contains invalid words!"; break
            case 3: this.mainText = "Make sure you select a point within the region of Ireland!"; break
        }
    }

    close() {
        this.ref.close()
    }


}
