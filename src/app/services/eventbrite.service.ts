import { SheetsService } from './sheets.service';
import { Injectable } from '@angular/core';
import KEYS from '../keys.json';
import { Attendee, eventbriteEvent } from '../classes';

@Injectable({
  providedIn: 'root',
})
export class EventbriteService {
  eventbriteURL = `https://www.eventbriteapi.com/v3/organizations/${KEYS.eventbriteOrganisation}`;

  constructor(public sheet: SheetsService) {}


  async getTodaysEvents(): Promise<any> {
    return await this.getEventsFor(new Date());
  }

  async getEventsFor(date: Date): Promise<any> {
    try {
      const startDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      const dateEnd = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

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

      return { trainings: events, status: 200 };
    } catch {
      return { trainings: [], status: 0 };
    }
  }

  async getEventAttendees(id: string) {
    var attendees: Attendee[] = [];
    const URL = `https://www.eventbriteapi.com/v3/events/${id}/attendees/?token=${KEYS.eventbrite}`;

    const raw = (await (await fetch(URL, { method: 'GET' })).json()).attendees;

    raw.forEach((attendee: any) => {
      try {
        if (attendee.status === 'Not Attending') return;
        attendees.push({
          attending: false,

          firstName: attendee.profile.first_name,
          lastName: attendee.profile.last_name,
          email: attendee.profile.email,
          upi: this.sheet.getUpi(attendee),
          id: this.sheet.getId(attendee),
        });
      } catch (error) {
        console.log(error);
      }
    });

    return attendees;
  }
}
