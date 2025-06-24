import { SecurityService } from './security.service';
import { Injectable } from '@angular/core';
import KEYS from '../keys.json';
import { Member, eventbriteEvent } from '../classes';

import { GoogleApiService } from 'ng-gapi';
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
    var API_URL: string = `https://sheets.googleapis.com/v4/spreadsheets/${KEYS.sheetID}/values/Members!AN:AS`;

    const lastFetchedMembers =
      Number(localStorage.getItem('lastFetchedMembers')) ?? 0;

    // only refresh after 10 min
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

    const members: Member[] = [];

    data.forEach((memberArray: any) => {
      if (memberArray[0] === 'ID Number') return;
      if (memberArray[0] === '') return;

      const currentMember = {
        ID: memberArray[0],
        upi: memberArray[1],
        firstName: memberArray[2],
        lastName: memberArray[3],
        email: memberArray[4],
        trainings: memberArray[5],
      };

      members.push(currentMember);
    });

    localStorage.setItem(
      'lastFetchedMembers',
      JSON.stringify(new Date().getTime())
    );


    this.saveSheetCache(members);

    return { members, status: res.status };
  }

  public async saveSheetCache(members: Member[]) {
    localStorage.setItem('members', JSON.stringify(members));
  }

  public clearCache(): void {
    localStorage.removeItem('members');
    localStorage.removeItem('lastFetchedMembers');
  }
}
