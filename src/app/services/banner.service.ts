import { Injectable } from '@angular/core';
import { State } from '../classes';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  state!: State;

  constructor() {}

  init(state: State) {
    this.state = state;
  }

  async show(
    message: string,
    type: 'success' | 'info' | 'error' | 'warning',
    duration: number = 0
  ) {
    this.state.banner.text = message;
    this.state.banner.type = type;
    this.state.banner.open = true;
    if (duration == 0) return;
    setTimeout(() => {
      this.state.banner.open = false;
    }, duration);
  }

  async hide(id: string, time: number = 0) {
    // TODO destroy banner
  }
}
