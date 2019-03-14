import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations'
import { WebService } from '../web.service';
import { ErrorDialogComponent } from '.././error-dialog/error-dialog.component'
import { MatDialog } from '@angular/material'

import { Core } from '../objects/core'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [

      trigger('ShakeTrigger', [
        transition('false <=> true', animate('600ms', keyframes([
            style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
            style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.2 }),
            style({ transform: 'translate3d(10px, 0, 0)', offset: 0.4 }),
            style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.6 }),
            style({ transform: 'translate3d(10px, 0, 0)', offset: 0.8 }),
            style({ transform: 'translate3d(0, 0, 0)', offset: 1 }),
        ]))),
        transition('active => hidden', animate('300ms 500ms ease-in')),
        transition('hidden => active', animate('300ms 500ms ease-in')),
      ]),

  ]
})
export class SearchComponent implements OnInit {

    @Output() search = new EventEmitter<any>()
    @Output() loc = new EventEmitter<any>()
    // @Input() active

    placeholder = "Enter sentence or phrase..."
    input = ""

    shakeState = false

    searching = false

    firstFocus = true

    constructor(private webService: WebService, private dialog: MatDialog) { }

    ngOnInit() {

    }

    onSearchFocus() {
        if(this.firstFocus == true) {
            this.firstFocus = false
        }
        else {
            this.placeholder = ""
        }
    }

    onSearchBlur() {
        this.placeholder = "Enter sentence or phrase..."
    }

    onSearchButtonClick() {
        if(this.input.length != 0 && this.errorCheck() && this.input.split(' ').length >= 2) {
            this.submit()
        }
        else {
            this.openDialog(1)
        }
    }

    searchByLocation() {
        this.swapButtons()
        navigator.geolocation.getCurrentPosition(pos => {
            this.webService.onChooseLocation(pos.coords.longitude, pos.coords.latitude).subscribe(res => {
                this.swapButtons()
                if(res["error"] == 0) {
                    this.loc.emit(res['core']);
                }
                else {
                    this.openDialog(2)
                }
            })
            // this.loc.emit(pos.coords)
        })
    }

    shake() {
        this.shakeState = !this.shakeState
    }

    onKeyUp(event) {
        if(this.errorCheck() == true) {
            if(this.input.length != 0 && event.key == "Enter") {
                this.submit()
            }
        }
        else {
            this.openDialog(0)
        }
    }

    errorCheck() {
        let patt = new RegExp("[^a-zA-Z ]")
        let res = patt.test(this.input)
        if(res == true)
            this.input = this.input.substring(0, this.input.length-1)
        return !res
    }

    submit() {
        this.swapButtons()
        this.webService.generate(this.input.toLowerCase()).subscribe((res) => {
            if(res['error'] == 0) {
                let emission: Core = res['core']
                this.search.emit(emission)
                this.swapButtons()
            }
            else {
                this.openDialog(2)
                this.swapButtons()
            }
        })
    }

    swapButtons() {
        this.searching = !this.searching
        if(this.searching == true) {
            document.getElementById('iconBeforeClick').style.display = 'none'
            document.getElementById('iconAfterClick').style.display = 'block'
        }
        else {
            document.getElementById('iconBeforeClick').style.display = 'initial'
            document.getElementById('iconAfterClick').style.display = 'none'
        }
    }

    openDialog(errorId) {
        this.shake()
        this.dialog.open(ErrorDialogComponent, {panelClass: 'panelClass', data: errorId})
    }

}
