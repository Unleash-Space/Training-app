import { SecurityService } from './security.service';
import { Injectable } from '@angular/core';
import KEYS from '../keys.json';
import { Member, Attendee, eventbriteEvent } from '../classes';

import { GoogleApiService, GoogleAuthService } from 'ng-gapi';
@Injectable({
  providedIn: 'root',
})
export class SheetsService {
  constructor(
    public gapiService: GoogleApiService,
    public security: SecurityService
  ) {}

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
          Authorization: `Bearer ${this.security.getToken()}`,
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

  public async insertCertificationData(
    member: Member,
    table: string,
    facilitator: string
  ) {
    try {
      let body: any[] = [];
      const date = new Date();
      const dateFormatted =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      const timeFormatted = date.getHours() + ':' + date.getMinutes();

      body.push([
        dateFormatted,
        timeFormatted,
        member.firstName,
        member.lastName,
        member.email,
        parseInt(member.ID),
        member.upi,
        facilitator,
        'Certification',
      ]);

      var API_URL: string = `https://sheets.googleapis.com/v4/spreadsheets/${KEYS.sheetID}/values/'${table}'!A:F:append/?valueInputOption=RAW`;

      var res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.security.getToken()}`,
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

  public async getSheetsData(): Promise<{ members: Member[]; status: number }> {
    var API_URL: string = `https://content-sheets.googleapis.com/v4/spreadsheets/${KEYS.sheetID}/values/Member-lookup!A:F`;

    const lastFetchedMembers =
      Number(localStorage.getItem('lastFetchedMembers')) ?? 0;

    // 10 min
    if (new Date().getTime() - lastFetchedMembers < 3000000) {
      const members = localStorage.getItem('members');
      if (members) return { members: JSON.parse(members), status: 205 };
    }

    var res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.security.getToken()}`,
      },
    });

    const streamReader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    let result = '';
    while (true) {
      const { done, value } = await streamReader!.read();
      if (done) break;
      result += decoder.decode(value);
    }

    const data = JSON.parse(result).values;

    const members: Member[] = data.map((e: any) => {
      return {
        upi: e[0],
        ID: e[1],
        firstName: e[2],
        lastName: e[3],
        email: e[4],
        trainings: e[5],
      };
    });

    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem(
      'lastFetchedMembers',
      JSON.stringify(new Date().getTime())
    );

    return { members, status: res.status };
  }
}
