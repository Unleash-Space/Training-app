import { eventbriteEvent, attendee, State } from '../classes';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../api.service';
import facilitatorList from './../CTs.json';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent {
  selectedEvent: any;
  showConfirm = false;
  facilitators = facilitatorList;

  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  constructor(public api: ApiService) { }

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
  }

  async preCheck() {
    // validate data
    let valid = true;
    let anyone_attending = false;

    this.selectedEvent.attendees.forEach((attendee: any) => {
      if (!attendee.attending) return;
      else anyone_attending = true;
      this.trimSpaces(attendee);

      if (!this.validId(attendee.id)) valid = false;
      if (!this.validUpi(attendee.upi)) valid = false;
      if (!this.validEmail(attendee.email)) valid = false;
      if (!this.validName(attendee.firstName)) valid = false;
      if (!this.validName(attendee.lastName)) valid = false;
    });

    if (!anyone_attending) {
      this.showError('No-one Attending');
      return;
    }
    if (this.state.selectedFacilitator == '') {
      this.showError('No Facilitator Selected');
      return;
    }
    if (!this.state.authenticated) {
      this.showError('Please Authenticate With Google');
      return;
    }

    if (valid) {
      this.submitData();
    } else {
      this.showConfirm = true;
    }
  }

  async trimSpaces(attendee: attendee) {
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
    if (eventTitle.includes('Artificial Intelligence'))
      return 'AI';
    if (eventTitle.includes('Internet of Things'))
      return 'IoT';
    if (eventTitle.includes('Virtual Reality'))
      return 'Virtual Reality';

    this.showError('Unknown Event')
    return "Unknown";
  }

  async submitData() {
    var table = this.getSheetName(this.selectedEvent.title);

    var res = await this.api.insertData(
      this.selectedEvent,
      table,
      this.state.selectedFacilitator
    );

    if (res === 200) {
      this.state.banner.text = 'Data Submitted Successfully';
      this.state.banner.type = 'success';
      this.state.banner.open = true;
      setTimeout(() => {
        this.state.banner.open = false;
      }, 1500);
    } else {
      this.showError('Something went wrong');
    }
  }

  async showError(errorMessage: string) {
    this.state.banner.text = errorMessage;
    this.state.banner.type = 'error';
    this.state.banner.open = true;
    setTimeout(() => {
      this.state.banner.open = false;
    }, 1500);
  }

  public validId(id: string) {
    id = id.trim();

    const regExp = /^(\d{7}|\d{9})$/;

    return id.match(regExp) !== null;
  }

  public validUpi(upi: string) {
    upi = upi.trim();

    const regExp = /^[a-zA-Z]{1,4}\d{3}$/;
    return upi.match(regExp) !== null;
  }

  public validEmail(email: string) {
    email = email.trim();

    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return email.match(regExp) !== null;
  }

  public validName(name: string) {
    name = name.trim();

    const regExp = /..+/;
    return name.match(regExp) !== null;
  }
}
