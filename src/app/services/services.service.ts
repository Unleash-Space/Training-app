import { SecurityService } from './security.service';
import { SheetsService } from './sheets.service';
import { EventbriteService } from './eventbrite.service';
import { Injectable } from '@angular/core';
import { State } from '../classes';
import { BannerService } from './banner.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  state!: State;

  constructor(
    public banner: BannerService,
    public data: DataService,
    public sheet: SheetsService,
    public eventbrite: EventbriteService,
    public security: SecurityService
  ) {}

  init(state: State) {
    this.state = state;

    this.banner.init(state);
    this.data.init(state);
  }
}
