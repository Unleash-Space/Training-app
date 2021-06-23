import { eventbriteEvent } from './classes';
// import { ApiService } from './api.service';
import { Component, OnInit } from '@angular/core';
import { supportsWebAnimations } from '@angular/animations/browser/src/render/web_animations/web_animations_driver';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConfirmComponent } from './confirm/confirm.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'front-end';
  selectedEvent = '';
  selectedFacilitator = '';
  trainings = [
    {
      title: '23 June 2021 / 9AM / Viny cutter practice',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
    {
      title: '23 June 2021 / 9AM / Sewing machine practice',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
    {
      title: '23 June 2021 / 9:30AM / Laser cutter practice',
      time: '3pm',
      complete: false,
      users: [
        { name: 'a', id: 1234, upi: 'abc123', attended: true },
        { name: 'b', id: 1234, upi: 'abc123', attended: true },
      ],
    },
  ];
  attendees = [
    {
      name: 'Hayden Moore',
      upi: 'hmoo908',
      id: '8169070',
    },
    {
      name: 'Etienne Naude',
      upi: 'enaud123',
      id: '123456789',
    },
    {
      name: 'Test Student',
      upi: 'tstud666',
      id: '666666666',
    },
  ];

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

  // constructor(public api: ApiService) {}

  constructor(public dialog: MatDialog) {}

  async ngOnInit() {
    // this.trainings = await this.api.getTodaysEvents();

    console.log(this.trainings);
  }

  newAttendee() {
    this.attendees.push({
      name: '',
      upi: '',
      id: '',
    });
  }

  submit() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);
  }

  eventSelected() {}
}

@Component({
  selector: 'dialog-content-example-dialog',
  template: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
