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
    var table = '';

    if (this.selectedEvent.title.includes('Router')) table = 'CNC Router';
    else if (this.selectedEvent.title.includes('Laser')) table = 'Laser Cutter';
    else if (this.selectedEvent.title.includes('3D')) table = '3D Printer';
    else if (this.selectedEvent.title.includes('Vinyl')) table = 'Vinyl Cutter';
    else if (this.selectedEvent.title.includes('Sewing'))
      table = 'Sewing Machine';
    else if (this.selectedEvent.title.includes('Solder'))
      table = 'Soldering Station ';

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
