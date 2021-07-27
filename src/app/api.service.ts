import { Injectable } from '@angular/core';
import { KEYS } from './keys';
import { attendee, eventbriteEvent } from './classes';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GoogleApiService, GoogleAuthService } from 'ng-gapi';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}`;
  public static SESSION_STORAGE_KEY: string = 'accessToken';
  private user: any;

  constructor(
    public http: HttpClient,
    private googleAuth: GoogleAuthService,
    public gapiService: GoogleApiService
  ) {}

  async getTodaysEvents(): Promise<any> {
    try {
      const NOW = new Date();
      const URL = `${this.eventbriteURL}/events/?token=${KEYS.eventbrite}&time_filter=current_future&order_by=start_asc`;
      const res: eventbriteEvent[] = (await this.baseGet(URL)).events;
      var events: eventbriteEvent[] = [];

      var todayEvents = res.filter((e) => {
        const dateArray = e.start.local.split('T')[0].split('-');
        const year = parseInt(dateArray[0]);
        const month = parseInt(dateArray[1]);
        const date = parseInt(dateArray[2]);

        if (
          year == NOW.getFullYear() &&
          month == NOW.getMonth() + 1 &&
          date == NOW.getDate()
        ) {
          return true;
        }
        return false;
      });

      todayEvents.forEach((e) => {
        const date = new Date(e.start.local);

        const minutes = date.getMinutes() ? `:${date.getMinutes()}` : '';

        let time =
          date.getHours() > 12
            ? `${date.getHours() - 12}${minutes} PM`
            : `${date.getHours()}${minutes} AM`;
        if (date.getHours() === 12) time = `${date.getHours()}${minutes} PM`;

        const format = {
          capacity: e.capacity,
          description: e.description,
          summary: e.summary,
          title: e.name.text,

          id: e.id,
          start: e.start,
          attendees: e.attendees,
          date: {
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
            time: time,
          },
        };

        events.push(format);
      });

      events.forEach(async (e) => {
        e.attendees = await this.getEventAttendees(e.id);
      });

      return { trainings: events, status: 200 };
    } catch {
      return { trainings: [], status: 0 };
    }
  }

  async getEventAttendees(id: string) {
    var attendees: attendee[] = [];
    const URL = `https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${KEYS.eventbrite}`;

    var raw = (await this.baseGet(URL)).attendees;

    raw.forEach((e: any) => {
      console.log(e);

      attendees.push({
        attending: false,

        name: {
          firstName: e.profile.first_name,
          lastName: e.profile.last_name,
        },
        email: e.profile.email,
        upi: e.answers.find((answer: any) => answer.question.includes('UPI'))
          .answer,
        id: e.answers.find((answer: any) => answer.question.includes('UoA ID'))
          .answer,
      });
    });

    return attendees;
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
            e.name?.firstName,
            e.name?.lastName,
            e.email,
            parseInt(e.id),
            e.upi,
            facilitator,
            'Training',
          ]);
        }
      });

      console.log(body);

      var API_URL: string = `https://sheets.googleapis.com/v4/spreadsheets/${KEYS.sheetID}/values/'${table}'!A:F:append/?valueInputOption=RAW`;

      var res = await this.http
        .post(
          API_URL,
          { values: body },
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${this.getToken()}`,
            }),
          }
        )
        .toPromise();

      return 200;
    } catch {
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

  public signIn(): void {
    this.googleAuth.getAuth().subscribe((auth: any) => {
      auth.signIn().then((res: any) => this.signInSuccessHandler(res));
    });
  }

  private signInSuccessHandler(res: any) {
    this.user = res;
    sessionStorage.setItem(
      ApiService.SESSION_STORAGE_KEY,
      res.getAuthResponse().access_token
    );
  }

  public async baseGet(url: string) {
    var res: any = await this.http.get(url).toPromise();

    return res;
  }
}
