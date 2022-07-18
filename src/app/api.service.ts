import { Injectable } from '@angular/core';
import KEYS from './keys.json';
import { attendee, eventbriteEvent } from './classes';

import { GoogleApiService, GoogleAuthService } from 'ng-gapi';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}`;
  public static SESSION_STORAGE_KEY: string = 'accessToken';
  private user: any;

  constructor(
    private googleAuth: GoogleAuthService,
    public gapiService: GoogleApiService
  ) {}

  async getTodaysEvents(): Promise<any> {
    try {
      const NOW = new Date();
      const startDate = `${NOW.getFullYear()}-${
        NOW.getMonth() + 1
      }-${NOW.getDate()}`;

      const dateEnd = `${NOW.getFullYear()}-${NOW.getMonth() + 1}-${
        NOW.getDate() 
      }`;

      const URL = `${this.eventbriteURL}/events/?start_date.range_start=${startDate}&start_date.range_end=${dateEnd}&token=${KEYS.eventbrite}`;

      const res: eventbriteEvent[] = (await (await fetch(URL)).json()).events;

      var events: eventbriteEvent[] = [];

      res.forEach((event) => {
        const date = new Date(event.start.local);

        const minutes = date.getMinutes() ? `:${date.getMinutes()}` : '';

        let time =
          date.getHours() > 12
            ? `${date.getHours() - 12}${minutes} PM`
            : `${date.getHours()}${minutes} AM`;
        if (date.getHours() === 12) time = `${date.getHours()}${minutes} PM`;

        const format: eventbriteEvent = {
          capacity: event.capacity,
          description: event.description,
          summary: event.summary,
          title: event.name.text,

          id: event.id,
          start: event.start,
          attendees: [],
          fetchedAttendees: false,
          date: {
            date: `${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`,
            time: time,
          },
        };

        events.push(format);
      });

      // events.forEach(async (e) => {
      //   e.attendees = await this.getEventAttendees(e.id);
      // });

      return { trainings: events, status: 200 };
    } catch {
      return { trainings: [], status: 0 };
    }
  }

  async getEventAttendees(id: string) {
    var attendees: attendee[] = [];
    const URL = `https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${KEYS.eventbrite}`;

    const raw = (await (await fetch(URL, { method: 'GET' })).json()).attendees;

    raw.forEach((attendee: any) => {
      try {
        attendees.push({
          attending: false,

          firstName: attendee.profile.first_name,
          lastName: attendee.profile.last_name,
          email: attendee.profile.email,
          upi: this.getUpi(attendee),
          id: this.getId(attendee),
        });
      } catch (error) {
        console.log(error);
      }
    });

    return attendees;
  }

  // Prevents crashing with error handling
  public getId(attendee: any): string {
    try {
      return (
        attendee.answers.find((answer: any) => answer.question.includes('ID'))
          .answer ?? ''
      );
    } catch {
      return '';
    }
  }

  // Prevents crashing with error handling
  public getUpi(attendee: any): string {
    try {
      return (
        attendee.answers.find((answer: any) => answer.question.includes('UPI'))
          .answer ?? ''
      );
    } catch {
      return '';
    }
  }

  public async insertData(
    data: eventbriteEvent,
    table: string,
    facilitator: string
  ) {
    try {
      let body: any[] = [];

      data.attendees?.forEach((e) => {
        if (e.attending) {
          body.push([
            data.date.date,
            data.date.time,
            e.firstName,
            e.lastName,
            e.email,
            parseInt(e.id),
            e.upi,
            facilitator,
            'Training',
          ]);
        }
      });

      var API_URL: string = `https://sheets.googleapis.com/v4/spreadsheets/${KEYS.sheetID}/values/'${table}'!A:F:append/?valueInputOption=RAW`;

      var res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          values: body,
        }),
      });

      return res.status;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  public getToken() {
    let token = sessionStorage.getItem(ApiService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set , authentication required');
    }
    return sessionStorage.getItem(ApiService.SESSION_STORAGE_KEY);
  }

  public async signIn() {
    return await this.googleAuth.getAuth();
  }

  public signInSuccessHandler(res: any) {
    this.user = res;
    sessionStorage.setItem(
      ApiService.SESSION_STORAGE_KEY,
      res.getAuthResponse().access_token
    );
  }

  public updateAccessToken(user: gapi.auth2.AuthResponse) {
    sessionStorage.setItem(ApiService.SESSION_STORAGE_KEY, user.access_token);
  }
}
