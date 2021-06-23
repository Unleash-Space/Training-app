// import { Injectable } from '@angular/core';
// // import { KEYS } from './keys';
// import { eventbriteEvent } from './classes';
// import { GoogleSheetsDbService } from 'ng-google-sheets-db';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class ApiService {
//   eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}`;

//   constructor(public http: HttpClient) {}

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

//   public async baseGet(url: string) {
//     var res: any = await this.http.get(url).toPromise();
//     return res;
//   }
// }
