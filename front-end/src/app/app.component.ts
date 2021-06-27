import { eventbriteEvent } from './classes';
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
  selectedFacilitator = 'FRED!';
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

    console.log(await this.trainings);
    // console.log(this.trainings);
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

    if (this.selectedEvent.description.includes('router')) {
      table = 'CNC Router';
    }

    const body = {
      values: [
        ['1/1/1', 768485633, this.selectedFacilitator],
        ['1/1/1', 12345, this.selectedFacilitator],
      ],
    };

    this.api.insertData(body, table);
  }
}
