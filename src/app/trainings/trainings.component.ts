import { eventbriteEvent, attendee, State } from '../classes';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../services/api.service';
import facilitatorList from './../CTs.json';
import { DataService } from '../services/data.service';
import { ValidateService } from '../services/validate.service';
import { BannerService } from '../services/banner.service';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent {
  selectedEvent: any;
  showConfirm = false;
  facilitators = facilitatorList;
  disableSubmit = true;

  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  constructor(
    public api: ApiService,
    public validate: ValidateService,
    public banner: BannerService
  ) {}

  newAttendee() {
    this.selectedEvent.attendees.push({
      firstName: '',
      lastName: '',
      upi: '',
      id: '',
      email: '',
      attending: true,
    });
  }

  async getEventAttendees(event: eventbriteEvent) {
    // already have attendees?
    if (event.fetchedAttendees) {
      return;
    }

    event.fetchedAttendees = true;
    event.attendees = await this.api.getEventAttendees(event.id);
    this.disableSubmit = false;
  }

  async preCheck() {
    // validate data
    let valid = true;
    let anyone_attending = false;

    this.selectedEvent.attendees.forEach((attendee: any) => {
      if (!attendee.attending) return;
      else anyone_attending = true;
      this.trimSpaces(attendee);

      if (!this.validate.id(attendee.id)) valid = false;
      if (!this.validate.upi(attendee.upi)) valid = false;
      if (!this.validate.email(attendee.email)) valid = false;
      if (!this.validate.name(attendee.firstName)) valid = false;
      if (!this.validate.name(attendee.lastName)) valid = false;
    });

    if (!anyone_attending)
      return this.banner.show('No-one Attending', 'error', 20000);

    if (this.state.selectedFacilitator == '')
      return this.banner.show('No Facilitator Selected', 'error', 20000);

    if (!this.state.authenticated)
      return this.banner.show(
        'Please Authenticate With Google',
        'error',
        20000
      );

    if (!this.state.authenticated)
      return this.banner.show(
        'Please Authenticate With Google',
        'error',
        20000
      );

    if (!valid)
      return this.banner.show(
        "One of the attendees doesn't seem right",
        'error',
        20000
      );

    this.submitData();
  }

  searchMember() {}

  trimSpaces(attendee: attendee) {
    attendee.email = attendee.email.trim();
    attendee.id = attendee.id.trim();
    attendee.upi = attendee.upi.trim();
    attendee.firstName = attendee.firstName.trim();
    attendee.lastName = attendee.lastName.trim();
  }

  getSheetName(eventTitle: string): string {
    // Classes
    if (eventTitle.includes('3D Printer Practice Session - B112'))
      return '3D Printer - Curricular';
    if (eventTitle.includes('Laser Cutter Practice Session - 100G'))
      return 'Laser Cutter - Curricular';

    // Create space
    if (eventTitle.includes('Router')) return 'CNC Router';
    if (eventTitle.includes('Laser')) return 'Laser';
    if (eventTitle.includes('Vinyl')) return 'Vinyl';
    if (eventTitle.includes('3D')) return '3D Printer';
    if (eventTitle.includes('Sewing')) return 'Sewing';
    if (eventTitle.includes('Solder')) return 'Soldering';

    // Tech hub
    if (eventTitle.includes('5G')) return '5G';
    if (eventTitle.includes('Artificial Intelligence')) return 'AI';
    if (eventTitle.includes('Internet of Things')) return 'IoT';
    if (eventTitle.includes('Virtual Reality')) return 'Virtual Reality';

    this.banner.show('Unknown Event', 'error', 20000);
    return 'Unknown';
  }

  async submitData() {
    this.disableSubmit = true;
    var table = this.getSheetName(this.selectedEvent.title);

    var res = await this.api.insertData(
      this.selectedEvent,
      table,
      this.state.selectedFacilitator
    );

    if (res === 200) {
      this.banner.show(
        `Data Submitted Successfully`,
        'success',
        1000 * 60 * 60
      );

      setTimeout(() => {
        this.disableSubmit = false;
      }, 1000 * 60 * 10);
    } else {
      this.banner.show(`Something went wrong code: ${res}`, 'error');
      this.disableSubmit = false;
    }
  }
}
