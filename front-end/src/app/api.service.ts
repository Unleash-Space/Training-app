import { Injectable } from '@angular/core';
import { KEYS } from './keys';
import { eventbriteEvent } from './classes';
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

//   async getTodaysEvents() {
//     const NOW = new Date();
//     const URL = `${this.eventbriteURL}/events/?token=${KEYS.eventbrite}&time_filter=current_future&order_by=start_asc`;
//     const res: eventbriteEvent[] = (await this.baseGet(URL)).events;
//     var events: eventbriteEvent[] = [];

//     var todayEvents = res.filter((e) => {
//       const dateArray = e.start.local.split('T')[0].split('-');
//       const year = parseInt(dateArray[0]);
//       const month = parseInt(dateArray[1]);
//       const date = parseInt(dateArray[2]);

//       if (
//         year == NOW.getFullYear() &&
//         month == NOW.getMonth() + 1 &&
//         date == NOW.getDate()
//       ) {
//         return true;
//       }
//       return false;
//     });

//     todayEvents.forEach((e) => {
//       const format = {
//         capacity: e.capacity,
//         description: e.description,
//         summary: e.summary,
//         id: e.id,
//         start: e.start,
//         attendees: e.attendees,
//       };

//       events.push(format);
//     });

//     events.forEach(async (e) => {
//       e.attendees = await this.getEventAttendees(e.id);
//     });

//     return events;
//   }

//   async getEventAttendees(id: string) {
//     var attendees: any[] = [];
//     const URL = `https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${KEYS.eventbrite}`;

//     var raw = (await this.baseGet(URL)).attendees;

//     raw.forEach((e: any) => {
//       attendees.push(e.profile);
//     });

//     return attendees;
//   }

  public async insertData(data: any, table: string) {
    var API_URL: string = `https://sheets.googleapis.com/v4/spreadsheets/${KEYS.sheetID}/values/'${table}'!A:A:append/?valueInputOption=RAW`;

    var res = await this.http
      .post(API_URL, data, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.getToken()}`,
        }),
      })
      .toPromise();
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
    var res: any = await this.http
      .get(url, { withCredentials: true })
      .toPromise();
    return res;
  }
}
