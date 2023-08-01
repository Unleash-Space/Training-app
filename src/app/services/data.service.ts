import { Injectable } from '@angular/core';
import KEYS from '../keys.json';
import { Member, attendee, eventbriteEvent } from '../classes';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}`;
  public static SESSION_STORAGE_KEY: string = 'accessToken';

  constructor() {}
}
