import { Injectable } from '@angular/core';
import { KEYS } from './keys';
import { eventbriteEvent } from './classes';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}/events/?token=${KEYS.eventbrite}`;

  constructor(public http: HttpClient) {}

  async getTodaysEvents() {
    const NOW = new Date();
    const URL = `${this.eventbriteURL}&time_filter=current_future&order_by=start_asc`;
    const res: eventbriteEvent[] = (await this.baseGet(URL)).events;

    // console.log(new);
    var dateArray = res[0].start.local.split('T')[0].split('-');
    var year = parseInt(dateArray[0]);
    var month = parseInt(dateArray[1]);
    var date = parseInt(dateArray[2]);

    console.log(year, month, date);

    console.log(res[0].start.local.split('T')[0]);

    return res.filter((e) => {
      const dateArray = e.start.local.split('T')[0].split('-');
      const year = parseInt(dateArray[0]);
      const month = parseInt(dateArray[1]);
      const date = parseInt(dateArray[2]);

      if (
        year == NOW.getFullYear() &&
        month == NOW.getMonth() + 1 &&
        date == NOW.getDate()
      ) {
        console.log(true);
        return true;
      }
      // console.log(false);
      return false;
    });
  }

  public async baseGet(url: string) {
    console.log(url);
    var res: any = await this.http.get(url).toPromise();
    console.log(res.events);
    return res;
  }
}
