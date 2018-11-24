import { Component, OnInit, Input, OnChanges, SimpleChange, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services'
import { WebService } from '../web.service';
import { ActivatedRoute } from "@angular/router";
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations'

import { ErrorDialogComponent } from '.././error-dialog/error-dialog.component'
import { LinkDialogComponent } from './link-dialog/link-dialog.component'
import { MatDialog } from '@angular/material'

import { Core } from '../objects/core'

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
        ]),
    ]

})
export class MapComponent implements OnInit, OnChanges {

    @Input() input: Core
    core: Core = { latitude:  53.462685160729606, longitude: -7.748994980679186 }
    zoom = 7

    load = false

    geocoder

    // infoState = "def"
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
            this.zoom = 12
            // this.findAddressByCoordinates()
        }
    }

    ngOnInit() {

        this.route.params.subscribe( params => {
            if(params.escape) {
                this.linkedEntry(params.escape)
            }
        })

    }

    linkedEntry(key) {

        key = unescape(key).toLowerCase()
        this.load = true
        this.webService.generate(key).subscribe((res) => {
            this.mapState = "second"
            this.load = false
            if(res['error'] == 0) {
                this.zoom = 12
                this.core = res['core']
            }
        })

    }

    onMapClick(evt) {

        if(evt.coords.lng > -5.353975449429186 || evt.coords.lng < -10.594453965054186 || evt.coords.lat > 55.37186727173801 || evt.coords.lat < 51.47826433287424) {
            this.openDialog(3)
        }
        else {
            this.mapState = "second"
            this.load = true
            this.webService.onChooseLocation(evt.coords.lng, evt.coords.lat).subscribe((res) => {
                this.load = false
                if(res['error'] == 0) {
                    this.core = res['core']
                    // this.findAddressByCoordinates()
                }
            })  
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

}
