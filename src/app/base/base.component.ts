import { Component, OnInit } from '@angular/core'
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations'
import { ActivatedRoute } from "@angular/router";
import { HelpDialogComponent } from '.././help-dialog/help-dialog.component'
import { MatDialog } from '@angular/material'

import { Core } from '../objects/core'

export interface Arrow {
    text?: string
    visible: boolean
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  animations: [

    trigger('TriggerAppearMap', [
        state('hidden', style({
          transform: 'translateY(100vh)', display: 'none'
        })),
        state('active', style({
          transform: 'translateY(22vh)', display: 'block'
        })),
  
        transition('hidden => active', animate('200ms 500ms ease-in')),
        transition('active => hidden', animate('300ms 500ms ease-in')),
      ]),

      trigger('TriggerAppearSearch', [
        state('void', style({
            transform: 'scale3d(0.3, 0.3, 0.3)',
            opacity: '0'
        })),
        state('hidden', style({
            transform: 'translateY(-39vh)'
        })),
        state('active', style({
            transform: 'translateY(0)'
        })),
  
        transition('void => active', animate('750ms cubic-bezier(0.215, 0.61, 0.355, 1)', keyframes([
            style({ transform: 'scale3d(0.3, 0.3, 0.3)', opacity: '0', offset: 0 }),
            style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
            style({ transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
            style({ transform: 'scale3d(1.03, 1.03, 1.03)', opacity: '1', offset: 0.6 }),
            style({ transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
            style({ transform: 'scale3d(1, 1, 1)', opacity: '1', offset: 1 }),
        ]))),

        transition('active => hidden', animate('750ms cubic-bezier(.42,.32,.35,1)', keyframes([
            style({ transform: 'translate3d(0, 0, 0)', offset: 0 }),
            style({ transform: 'translate3d(0, 3vh, 0)', offset: 0.3 }),
            style({ transform: 'translate3d(0, -41vh, 0)', offset: 0.6 }),
            style({ transform: 'translate3d(0, -37vh, 0)', offset: 0.8 }),
            style({ transform: 'translate3d(0, -39vh, 0)', offset: 1 }),
        ]))),
        
        transition('hidden => active', animate('300ms 500ms ease-in')),
      ]),

      trigger('ArrowTrigger', [
        state('default', style({ transform: 'translateY(0)', opacity: '0.7' })),
        state('moused', style({ transform: 'translateY(20px)' })),
        transition('default => moused', animate('800ms 300ms ease-in-out', keyframes([
          style({ transform: 'translateY(0)', opacity: '0.7', offset: 0 }),
          style({ transform: 'translateY(25px)', opacity: '0.8', offset: 0.8 }),
          style({ transform: 'translateY(20px)', opacity: '1', offset: 1 })
        ]))),
        transition('moused => default', animate('700ms 500ms ease-out')),
      ])

  ]

})

export class BaseComponent implements OnInit {

    activeView = 1
    topArrow: Arrow = { text: "", visible: false }
    bottomArrow: Arrow = { text: "", visible: false }
    arrowVisible = false

    // views
    views = ['hidden', 'active', 'hidden']
    viewSearch = 'active'
    viewMap = 'hidden'

    core: Core
    input

    stateDownArrow = 'default'

    constructor(private route: ActivatedRoute, private dialog: MatDialog) { }

    ngOnInit() {

        this.route.params.subscribe( params => {
            if(params.escape) {
                this.changeToView(2)
            }
        })

        this.setArrows(this.activeView)

        // this.openHelpDialog()
        
    }

    setArrows(view) {

        switch(view) {
            case 0: this.topArrow = { visible: false }; this.bottomArrow = { text: 'Go to search', visible: true }; break
            case 1: this.topArrow = { visible: false }; this.bottomArrow = { text: 'Go to map', visible: true }; break
            case 2: this.topArrow = { visible: false }; this.bottomArrow = { visible: false }; break
        }

    }

    onSearch(evt: Core) {

        this.changeToView(2)
        this.core = evt

    }

    changeToView(to) {

        this.views[this.activeView] = 'hidden'
        this.views[to] = 'active'
        this.activeView = to

        this.setArrows(to)

    }

    animate() {
        this.stateDownArrow = this.stateDownArrow == 'default' ? 'moused' : 'default'
    }

    onArrowTopClick() {
        this.changeToView(this.activeView - 1)
    }

    onArrowBottomClick() {
        this.changeToView(this.activeView + 1)
    }

    openHelpDialog() {
        this.dialog.open(HelpDialogComponent, { panelClass: 'panelClass' })
    }

}
