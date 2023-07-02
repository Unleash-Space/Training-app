import KEYS from './keys.json';
import { MaterialModule } from './materials/materials.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG } from 'ng-gapi';
import { HeaderComponent } from './header/header.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { CertificationComponent } from './certification/certification.component';
import { LookupComponent } from './lookup/lookup.component';

let gapiClientConfig: NgGapiClientConfig = {
  client_id: KEYS.clientID,
  discoveryDocs: [
    'https://analyticsreporting.googleapis.com/$discovery/rest?version=v4',
  ],
  scope: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ].join(' '),
};

@NgModule({
  declarations: [AppComponent, HeaderComponent, TrainingsComponent, CertificationComponent, LookupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig,
    }),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
