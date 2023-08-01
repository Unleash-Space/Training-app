import { Injectable } from '@angular/core';
import KEYS from '../keys.json';
import { Member, attendee, eventbriteEvent } from '../classes';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}`;
  public static SESSION_STORAGE_KEY: string = 'accessToken';

  constructor() {}

  public id(id: string) {
    id = id.trim();

    const regExp = /^(\d{7}|\d{9})$/;

    return id.match(regExp) !== null;
  }

  public upi(upi: string) {
    upi = upi.trim();

    const regExp = /^[a-zA-Z]{1,4}\d{3}$/;
    return upi.match(regExp) !== null;
  }

  public email(email: string) {
    email = email.trim();

    const regExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return email.match(regExp) !== null;
  }

  public name(name: string) {
    name = name.trim();

    const regExp = /..+/;
    return name.match(regExp) !== null;
  }
}
