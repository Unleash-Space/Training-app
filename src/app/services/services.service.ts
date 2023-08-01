import { Injectable } from '@angular/core';
import KEYS from '../keys.json';
import { Member, State, attendee, eventbriteEvent } from '../classes';
import { BannerService } from './banner.service';
import { ApiService } from './api.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  state!: State;

  constructor(
    public banner: BannerService,
    public data: DataService,
    public api: ApiService
  ) {}

  init(state: State) {
    this.state = state;

    this.banner.init(state);
    this.data.init(state);
  }
}
