import { eventbriteEvent, attendee } from '../classes';
import { AfterContentInit, Component, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import facilitatorList from './../CTs.json';
import trainingList from './../trainings.json';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
})
export class CertificationComponent implements AfterContentInit {
  selectedFacilitator: string = '';
  eventOptions = trainingList;
  facilitators = facilitatorList;
  showConfirm = false;
  authenticated = false;
  attendees: attendee[] = [];
  selectedEvent!: eventbriteEvent;

  @ViewChild('banner') banner: any;
  @ViewChild('errorBanner') errorBanner: any;
  @ViewChild('errorText') errorText: any;

  constructor(public api: ApiService) {}

  async ngAfterContentInit() {
    (await this.api.signIn()).subscribe((auth) => {
      if (auth.isSignedIn.get() === true) {
        this.authenticated = true;

        if (auth.currentUser.get().getId() !== '102985056909257225252') {
          this.showError('Please Sign in with the Unleash Account');
          auth.signIn().then((res: any) => {
            this.api.signInSuccessHandler(res);
            this.authenticated = true;
          });
          return;
        }

        auth.currentUser
          .get()
          .reloadAuthResponse()
          .then((user) => {
            this.api.updateAccessToken(user);
          });
        return;
      }

      auth.signIn().then((res: any) => {
        this.api.signInSuccessHandler(res);
        this.authenticated = true;
      });
    });
  }

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

    if (!anyone_attending) {
      this.showError('No-one Attending');
      return;
    }
    if (this.selectedFacilitator == '') {
      this.showError('No Facilitator Selected');
      return;
    }
    if (!this.authenticated) {
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

  async submitData() {
    var table = '';

    if (this.selectedEvent.title.includes('Router')) table = 'CNC Router';
    else if (this.selectedEvent.title.includes('Laser')) table = 'Laser';
    else if (this.selectedEvent.title.includes('Curricular 3D'))
      table = '3D Printer - Curricular';
    else if (this.selectedEvent.title.includes('3D')) table = '3D Printer';
    else if (this.selectedEvent.title.includes('Vinyl')) table = 'Vinyl';
    else if (this.selectedEvent.title.includes('Sewing')) table = 'Sewing';
    else if (this.selectedEvent.title.includes('Solder')) table = 'Soldering';
    else if (this.selectedEvent.title.includes('5G')) table = '5G';
    else if (this.selectedEvent.title.includes('Artificial Intelligence'))
      table = 'AI';
    else if (this.selectedEvent.title.includes('Internet of Things'))
      table = 'IoT';
    else if (this.selectedEvent.title.includes('Virtual Reality'))
      table = 'Virtual Reality';

    var res = await this.api.insertData(
      this.selectedEvent,
      table,
      this.selectedFacilitator
    );

    if (res === 200) {
      this.banner.nativeElement.className = 'bannerCont show';
      setTimeout(() => {
        this.banner.nativeElement.className = 'bannerCont';
      }, 1500);
    } else {
      this.showError('Something went wrong');
    }
  }

  async showError(errorMessage: string) {
    this.errorText.nativeElement.innerText = errorMessage;
    this.errorBanner.nativeElement.className = 'bannerCont error show';
    setTimeout(() => {
      this.errorBanner.nativeElement.className = 'bannerCont error';
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
