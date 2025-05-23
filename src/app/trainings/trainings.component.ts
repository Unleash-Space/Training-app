import { EventbriteService } from './../services/eventbrite.service';
import { eventbriteEvent, Attendee, State } from '../classes';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SheetsService } from '../services/sheets.service';
import facilitatorList from './../CTs.json';
import { ValidateService } from '../services/validate.service';
import { BannerService } from '../services/banner.service';
import { DataService } from '../services/data.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  @Output() chooseNewDate = new EventEmitter<Date>();

  constructor(
    public sheet: SheetsService,
    public eventbrite: EventbriteService,
    public validate: ValidateService,
    public banner: BannerService,
    public data: DataService,
  ) {}

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.chooseNewDate.emit(event.value ?? new Date());
  }

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
    if (event.fetchedAttendees) return;

    event.fetchedAttendees = true;
    event.attendees = await this.eventbrite.getEventAttendees(event.id);

    event.attendees.forEach((attendee: Attendee) => {
      const upiMember = this.data.searchMember(attendee.upi);
      const idMember = this.data.searchMember(attendee.id);

      // member not found
      if (!(upiMember || idMember)) return (attendee.status = '🔴');
      const member = (upiMember || idMember)!;

      // Swaps UPI and ID if needed
      attendee.id = member.ID;
      attendee.upi = member.upi;

      // member found
      if (upiMember && idMember == upiMember) return (attendee.status = '🟢');

      // conflicting data
      return (attendee.status = '🟠');
    });

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
        20000,
      );

    if (!valid)
      return this.banner.show(
        "One of the attendees doesn't seem right",
        'error',
        20000,
      );

    return this.submitData();
  }

  searchMember() {}

  trimSpaces(attendee: Attendee) {
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

    var res = await this.sheet.insertData(
      this.selectedEvent,
      table,
      this.state.selectedFacilitator,
    );

    if (res === 200) {
      this.banner.show(
        `Data Submitted Successfully`,
        'success',
        1000 * 60 * 60,
      );

      setTimeout(
        () => {
          this.disableSubmit = false;
        },
        1000 * 60 * 10,
      );
    } else {
      this.banner.show(`Something went wrong code: ${res}`, 'error');
      this.disableSubmit = false;
    }
  }
}
