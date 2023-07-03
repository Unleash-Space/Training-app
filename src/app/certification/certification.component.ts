import { attendee, State } from '../classes';
import { ApiService } from '../api.service';
import facilitatorList from './../CTs.json';
import trainingList from './../trainings.json';

import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
})
export class CertificationComponent {
  selectedFacilitator: string = '';
  eventOptions = trainingList;
  facilitators = facilitatorList;
  showConfirm = false;
  attendees: attendee[] = [];
  selectedTraining: string = '';

  @Input() state!: State;
  @Output() stateChange = new EventEmitter<State>();

  constructor(public api: ApiService) {}

  newAttendee() {
    console.log('new attendee');
    this.attendees.push({
      firstName: '',
      lastName: '',
      upi: '',
      id: '',
      email: '',
      attending: true,
    });
  }

  async preCheck() {
    // validate data
    let valid = true;
    let anyone_attending = false;

    this.attendees.forEach((attendee: any) => {
      if (!attendee.attending) return;
      else anyone_attending = true;
      this.trimSpaces(attendee);

      if (!this.validId(attendee.id)) valid = false;
      if (!this.validUpi(attendee.upi)) valid = false;
      if (!this.validEmail(attendee.email)) valid = false;
      if (!this.validName(attendee.firstName)) valid = false;
      if (!this.validName(attendee.lastName)) valid = false;
    });

    if (this.selectedFacilitator == '') {
      this.showError('No Facilitator Selected');
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

  async submitData() {
    var res = await this.api.insertCertificationData(
      this.attendees,
      this.selectedTraining,
      this.selectedFacilitator
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
