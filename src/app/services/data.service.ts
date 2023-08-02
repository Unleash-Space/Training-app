import { Injectable } from '@angular/core';
import { Member, State } from '../classes';
import { BannerService } from './banner.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  state!: State;

  constructor(public banner: BannerService) {}

  init(state: State) {
    this.state = state;
  }

  searchMember(upi: string): Member | null {
    upi = upi.toLowerCase();
    const member = this.state.members.find(
      (member) => member.upi.toLowerCase() == upi || member.ID == upi
    );

    if (this.state.members.length == 0) {
      this.banner.show('Data not loaded', 'error');
      return null;
    }

    return member || null;
  }
}
