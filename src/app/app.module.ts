import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import {
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatSidenavModule,
    MatTableModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MAT_DIALOG_DEFAULT_OPTIONS
    } from '@angular/material';


import { AppComponent } from './app.component';
import { WebService } from './web.service';
// import { HomeComponent } from './home/home.component';

// import { IntroDialogComponent } from './home/intro-dialog/intro-dialog.component';
import { SearchComponent } from './search/search.component';
import { BaseComponent } from './base/base.component';
import { MapComponent } from './map/map.component';

import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { LinkDialogComponent } from './map/link-dialog/link-dialog.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorDialogComponent,
    LinkDialogComponent,
    HelpDialogComponent,
    SearchComponent,
    BaseComponent,
    MapComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyB4TerrzYhbp9g21yKfSPlURCqXFTNBa0E'
    })
  ],
  providers: [ WebService, GoogleMapsAPIWrapper, CookieService ],
  bootstrap: [AppComponent],
  entryComponents: [ ErrorDialogComponent, LinkDialogComponent, HelpDialogComponent ]
})
export class AppModule { }
