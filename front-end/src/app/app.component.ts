import { eventbriteEvent } from './classes';
import { Component, OnInit } from '@angular/core';
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
  trainings: any = [];
  selectedFacilitator = 'FRED!';
  selectedEvent = { title: 'router' };
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

  async ngAfterContentInit() {
    // this.trainings = await this.api.getTodaysEvents();
    // console.log(this.trainings);
  }

  login() {
    this.api.signIn();
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

  submitData() {
    var table = '';

    if (this.selectedEvent.title.includes('router')) {
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

@Component({
  selector: 'dialog-content-example-dialog',
  template: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {}
