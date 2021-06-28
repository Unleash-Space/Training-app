import { eventbriteEvent, attendee } from './classes';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { supportsWebAnimations } from '@angular/animations/browser/src/render/web_animations/web_animations_driver';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmComponent } from './confirm/confirm.component';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  title = 'front-end';
  selectedFacilitator = '';
  selectedEvent: any;
  trainings: eventbriteEvent[] = [];

  facilitators = [
    'Hayden Moore',
    'Sean Kelly',
    'Ariel Dannenbring',
    'Etienne Naude',
    'Anne Pan',
    'Melissa Bather',
    'Mat Barry',
    'Caroline Brown',
  ];

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    this.trainings = await this.api.getTodaysEvents();
    this.api.signIn();
  }

  login() {
    this.api.signIn();
  }

  newAttendee() {
    this.selectedEvent.attendees.push({
      name: '',
      upi: '',
      id: '',
    });
  }

  submitData() {
    var table = '';

    if (this.selectedEvent.title.includes('Router')) table = 'CNC Router';
    else if (this.selectedEvent.title.includes('Laser')) table = 'Laser Cutter';
    else if (this.selectedEvent.title.includes('3D')) table = '3D Printer';
    else if (this.selectedEvent.title.includes('Vinyl')) table = 'Vinyl Cutter';
    else if (this.selectedEvent.title.includes('Sewing'))
      table = 'Sewing Machine';
    else if (this.selectedEvent.title.includes('Solder'))
      table = 'Soldering Station ';

    this.api.insertData(this.selectedEvent, table, this.selectedFacilitator);
  }
}
