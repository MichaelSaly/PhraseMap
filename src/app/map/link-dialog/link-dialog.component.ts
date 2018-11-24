import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-link-dialog',
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.css']
})
export class LinkDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<LinkDialogComponent>) { }

    link
    copyStatus = "Click to copy to clipboard"

    ngOnInit() {
        console.log(this.data)
        this.link = 'http://localhost:4200/l/' + this.data.escape
    }

    copy() {
        let val = this.link
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.copyStatus = "Link copied!"
    }

    resetCopyStatus() {
        this.copyStatus = "Click to copy to clipboard"
    }

    close() {
        this.ref.close()
    }


}
