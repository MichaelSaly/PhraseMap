import { Component, OnInit, Input, OnChanges, SimpleChange, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services'
import { WebService } from '../web.service';
import { ActivatedRoute } from "@angular/router";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations'

import { ErrorDialogComponent } from '.././error-dialog/error-dialog.component'
import { LinkDialogComponent } from './link-dialog/link-dialog.component'
import { InfoDialogComponent } from './info-dialog/info-dialog.component'
import { MatDialog } from '@angular/material'

import { Core } from '../objects/core'
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

declare var google: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    animations: [
        trigger('TriggerMap', [
            state('def', style({
                height: '100%'
            })),
            state('second', style({
                height: '65%'
            })),

            transition('def => second', animate('200ms 500ms ease-in')),
        ]),

        trigger('TriggerInfo', [
            state('def', style({
                height: '0%'
            })),
            state('second', style({
                height: '35%'
            })),

            transition('def => second', animate('200ms 500ms ease-in')),
            transition('second => def', animate('200ms 500ms ease-in'))
        ]),

    ]

})
export class MapComponent implements OnInit, OnChanges {

    @Input() input: Core
    core: Core = { latitude:  53.462685160729606, longitude: -7.748994980679186 }
    zoom = 7

    wordQueue = [];
    wordQueueCorrect = true;
    wordQueueErrors = [];

    load = false

    geocoder

    mapState = "def"

    constructor(private route: ActivatedRoute, public mapsApiLoader: MapsAPILoader, private zone: NgZone, private wrapper: GoogleMapsAPIWrapper, private webService: WebService, private dialog: MatDialog) {

        this.mapsApiLoader = mapsApiLoader
        this.zone = zone
        this.wrapper = wrapper
        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder()
        })

    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        let change = changes.input
        if(change.firstChange == false && change.currentValue != undefined) {
            this.mapState = "second"
            this.core = this.input
            this.zoom = 18
            console.log(this.core)
            this.resetwordQueue()
            // this.findAddressByCoordinates()
        }
    }

    resetwordQueue() {
        if(this.core.show) {
            this.wordQueue = [ { 'word': this.core.word1, 'base': true, 'error': false }, { 'word': "", 'base': false, 'error': false }, { 'word': this.core.word2, 'base': true, 'error': false } ]
            this.wordQueueCorrect = true;
            this.wordQueueErrors = []
        }
    }

    ngOnInit() {

        this.route.params.subscribe( params => {
            if(params.escape) {
                this.linkedEntry(params.escape)
            }
        })

    }

    minimize() {

        if(this.mapState == "second") {
            this.mapState = "def"
            document.getElementById("inf").style.display = "none"
        }
        else {
            this.mapState = "second"
            document.getElementById("inf").style.display = "block"
        }
    }

    linkedEntry(key) {

        key = unescape(key).toLowerCase()
        this.load = true
        this.webService.generate(key).subscribe((res) => {
            this.mapState = "second"
            this.load = false
            if(res['error'] == 0) {
                this.zoom = 18
                this.core = res['core']
            }
        })

    }

    generate(lng, lat) {
        this.load = true
        this.mapState = "def"
        this.webService.onChooseLocation(lng, lat).subscribe((res) => {
            this.load = false
            
            if(res['error'] == 0) {
                this.mapState = "second"
                this.zoom = 18
                this.core = res['core']
                this.resetwordQueue()
                // this.dialog.open(InfoDialogComponent, {panelClass: 'panelClass', data: this.core})
                // this.findAddressByCoordinates()
            }
        })  
    }

    onMapClick(evt) {

        if(evt.coords.lng > -5.353975449429186 || evt.coords.lng < -10.594453965054186 || evt.coords.lat > 55.37186727173801 || evt.coords.lat < 51.47826433287424) {
            this.openDialog(3)
        }
        else {
            this.generate(evt.coords.lng, evt.coords.lat)
        }  

    }

    findAddressByCoordinates() {
        this.geocoder.geocode({
          'location': {
            lat: this.core.latitude,
            lng: this.core.longitude
          }
        }, (results, status) => {
            let res = results[0].address_components
            this.core.address.part1 = res[0].long_name
            this.core.address.part2 = res[1].long_name
            this.core.address.part3 = res[2].long_name
            this.core.address.part4 = res[3].long_name
        })
      }

    openDialog(errorId) {
        this.dialog.open(ErrorDialogComponent, {panelClass: 'panelClass', data: errorId})
    }

    openLinkDialog() {
        this.dialog.open(LinkDialogComponent, {panelClass: 'panelClass', data: this.core})
    }

    shouldShow() {
        if(this.core.show == true) {
            return true
        }
        return false;
    }

    onClickQueue(pos) {
        if(pos == -1) {
            this.wordQueue.unshift({ 'word': "", 'base': false, 'error': false })
        }
        else {
            this.wordQueue.splice(pos+1, 0, { 'word': "", 'base': false, 'error': false })
        }

    }

    validateQueue() {
        this.wordQueueCorrect = true
        this.wordQueueErrors = []

        let index = 0, lookFor = "";
        for(let i = 0; i < this.wordQueue.length; i++) {
            if(this.wordQueue[i].word == this.core.word1) {
                this.wordQueue[i].base = true
                lookFor = this.core.word2
                index = i
                break
            }
            else if(this.wordQueue[i].word == this.core.word2) {
                this.wordQueue[i].base = true
                lookFor = this.core.word1
                index = i
                break
            }
            else {
                this.wordQueue[i].base = false
            }
        }

        let secondFound = false
        if(lookFor.length == 0) {
            this.wordQueueCorrect = false
            this.wordQueueErrors.push("Please do not remove keywords to preserve phrase")
            return
        }
        else {
            for(let i = this.wordQueue.length-1; i > index;  i--) {
                if(this.wordQueue[i].word == lookFor) {
                    console.log("found base 2 " + lookFor)
                    this.wordQueue[i].base = true
                    secondFound = true
                }
                else {
                    this.wordQueue[i].base = false
                }
            }
        }

        if(!secondFound) {
            this.wordQueueCorrect = false
            this.wordQueueErrors.push("Second phrase keyword '" + lookFor + "' missing")
            return
        }


        let lookingFor = 0
        for(let i = 0; i < this.wordQueue.length; i++) {

            if(lookingFor == 0) {
                if(this.wordQueue[i].base == false) {
                    if(this.wordQueue[i].word.length > 3) {
                        this.wordQueue[i].error = true
                        this.wordQueueCorrect = false
                        this.wordQueueErrors.push("The first word of over three characters must be a phrase keyword")
                    }
                    else {
                        this.wordQueue[i].error = false
                    }
                }
                else {
                    lookingFor = 1
                    this.wordQueue[i].error = false
                }
            }

            else if(lookingFor == 1) {
                if(this.wordQueue[i].base == false) {
                    this.wordQueue[i].error = false
                }
                else {
                    lookingFor = 2
                    this.wordQueue[i].error = false
                }
            }

            else if(lookingFor == 2) {
                if(this.wordQueue[i].word.length > 3) {
                    this.wordQueue[i].error = true
                    this.wordQueueCorrect = false
                    this.wordQueueErrors.push("The last word of over three characters must be a phrase keyword")
                }
                else {
                    this.wordQueue[i].error = false
                }
            }

        }


        if(this.wordQueueCorrect == true) {
            let temp = ""
            this.wordQueue.forEach(e => { temp = temp + e.word + " " })
            this.core.phrase = temp
        }

    }

    regenerate() {
        this.generate(this.core.longitude, this.core.latitude)
    }

    openHelpDialog() {
        this.dialog.open(HelpDialogComponent, { panelClass: 'panelClass' })
    }
}
