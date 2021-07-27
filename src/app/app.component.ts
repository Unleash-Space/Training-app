import { eventbriteEvent, attendee } from './classes';
import { AfterContentInit, Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterContentInit {
  selectedFacilitator: string = '';
  selectedEvent: any;
  trainings: eventbriteEvent[] = [];
  showConfirm = false;
  showError: boolean = false;
  anyone_attending = false;

  facilitators = [
    'Hayden',
    'Melissa',
    'Mat',
    'Caroline',
    'Petr',
    'Rosa',
    'Julia',
    'Daniele',
    'Andi',
    'Nova',
    'Hajar',
    'Karthik',
    'Iris',
    'Hugh',
    'Blake',
    'Raymond',
    'Etienne',
    'Anne',
    'Sean',
    'Ariel',
  ];

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    this.api.signIn();
    const res = await this.api.getTodaysEvents();

    if (res.status === 0) {
      this.showError = true;
    } else {
      this.trainings = res.trainings;
    }
  }

  newAttendee() {
    this.selectedEvent.attendees.push({
      name: '',
      upi: '',
      id: '',
    });
  }

  async submitData() {
    this.anyone_attending = false;
    this.selectedEvent.attendees.forEach((attendee: any) => {
      if (attendee.attending) this.anyone_attending = true;
    });

    if (!this.anyone_attending) {
      this.showError = true;
      return;
    }

    var table = '';

    if (this.selectedEvent.title.includes('Router')) table = 'CNC Router';
    else if (this.selectedEvent.title.includes('Laser')) table = 'Laser';
    else if (this.selectedEvent.title.includes('3D')) table = '3D Printer';
    else if (this.selectedEvent.title.includes('Vinyl')) table = 'Vinyl';
    else if (this.selectedEvent.title.includes('Sewing')) table = 'Sewing';
    else if (this.selectedEvent.title.includes('Solder')) table = 'Soldering';

    console.log(table, this.selectedEvent, this.selectedFacilitator);

    var res = await this.api.insertData(
      this.selectedEvent,
      table,
      this.selectedFacilitator
    );

    if (res != 200) {
      console.log('ERROR');
      this.showError = true;
    }
  }
}
